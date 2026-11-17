// =============================================================
// Script de Empacotamento Oficial Chrome Extension (CRX3)
// Gera: key.pem, extensao_painel_ids_estilo.crx e updates.xml
// Uso: node scripts/pack.js
// =============================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

// 1. Executa o build para sincronizar dist/bundle.js
console.log('[Pack] Sincronizando bundle standalone (build.js)...');
try {
    execSync(`node "${path.join(rootDir, 'build.js')}"`, { stdio: 'inherit', cwd: rootDir });
} catch (e) {
    console.error('[Pack] Erro ao executar build.js:', e.message);
    process.exit(1);
}

// 2. Lê informações do manifest.json
const manifestPath = path.join(rootDir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version || '1.0';
const extName = manifest.name || 'Extensao Painel IDS';
const crxFilename = 'extensao_painel_ids_estilo.crx';

// 3. Obtém ou gera a chave privada RSA (2048-bit)
const keyPath = path.join(rootDir, 'key.pem');
let privateKeyPem;
let publicKeyDer;

if (fs.existsSync(keyPath)) {
    console.log('[Pack] Usando chave privada existente: key.pem');
    privateKeyPem = fs.readFileSync(keyPath, 'utf8');
    const privKeyObj = crypto.createPrivateKey(privateKeyPem);
    const pubKeyObj = crypto.createPublicKey(privKeyObj);
    publicKeyDer = pubKeyObj.export({ type: 'spki', format: 'der' });
} else {
    console.log('[Pack] Gerando nova chave RSA de 2048 bits: key.pem...');
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'der' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    privateKeyPem = privateKey;
    publicKeyDer = publicKey;
    fs.writeFileSync(keyPath, privateKeyPem, 'utf8');
    console.log(`[Pack] Chave privada salva em: ${keyPath}`);
}

// 4. Calcula o Extension ID oficial do Chrome (32 caracteres a-p)
const sha256Pub = crypto.createHash('sha256').update(publicKeyDer).digest();
const crxIdRaw = sha256Pub.subarray(0, 16);
const extensionId = crxIdRaw.toString('hex').split('').map(c => String.fromCharCode(parseInt(c, 16) + 97)).join('');

// 5. Coleta todos os arquivos necessários para a extensão
const includeDirs = ['assets', 'dist', 'src', 'templates'];
const includeFiles = ['manifest.json', 'content.js'];

function getFilesRecursively(dir, baseDir = '') {
    let results = [];
    const fullPath = path.join(dir, baseDir);
    if (!fs.existsSync(fullPath)) return results;

    const list = fs.readdirSync(fullPath, { withFileTypes: true });
    for (const item of list) {
        const relPath = baseDir ? `${baseDir}/${item.name}` : item.name;
        if (item.isDirectory()) {
            results = results.concat(getFilesRecursively(dir, relPath));
        } else if (item.isFile()) {
            results.push({
                name: `${path.basename(dir)}/${relPath}`.replace(/\\/g, '/'),
                fullPath: path.join(dir, relPath)
            });
        }
    }
    return results;
}

const fileList = [];
for (const file of includeFiles) {
    const p = path.join(rootDir, file);
    if (fs.existsSync(p)) {
        fileList.push({ name: file, fullPath: p });
    }
}
for (const dir of includeDirs) {
    const fullDirPath = path.join(rootDir, dir);
    if (fs.existsSync(fullDirPath)) {
        fileList.push(...getFilesRecursively(fullDirPath));
    }
}

console.log(`[Pack] Total de ${fileList.length} arquivos mapeados para o pacote da extensão.`);

// 6. Constrói o buffer ZIP puro (sem dependências externas)
function createZip(files) {
    const localHeaders = [];
    const centralHeaders = [];
    let offset = 0;

    for (const file of files) {
        const content = fs.readFileSync(file.fullPath);
        const nameBuf = Buffer.from(file.name.replace(/\\/g, '/'), 'utf8');
        const compressed = zlib.deflateRawSync(content);
        const crc = zlib.crc32(content);

        // Local file header (30 bytes + name + compressed)
        const lh = Buffer.alloc(30);
        lh.writeUInt32LE(0x04034b50, 0);
        lh.writeUInt16LE(20, 4);
        lh.writeUInt16LE(0, 6);
        lh.writeUInt16LE(8, 8);
        lh.writeUInt16LE(0, 10);
        lh.writeUInt16LE(0, 12);
        lh.writeUInt32LE(crc, 14);
        lh.writeUInt32LE(compressed.length, 18);
        lh.writeUInt32LE(content.length, 22);
        lh.writeUInt16LE(nameBuf.length, 26);
        lh.writeUInt16LE(0, 28);

        localHeaders.push(lh, nameBuf, compressed);

        // Central directory header (46 bytes + name)
        const cd = Buffer.alloc(46);
        cd.writeUInt32LE(0x02014b50, 0);
        cd.writeUInt16LE(20, 4);
        cd.writeUInt16LE(20, 6);
        cd.writeUInt16LE(0, 8);
        cd.writeUInt16LE(8, 10);
        cd.writeUInt16LE(0, 12);
        cd.writeUInt16LE(0, 14);
        cd.writeUInt32LE(crc, 16);
        cd.writeUInt32LE(compressed.length, 20);
        cd.writeUInt32LE(content.length, 24);
        cd.writeUInt16LE(nameBuf.length, 28);
        cd.writeUInt16LE(0, 30);
        cd.writeUInt16LE(0, 32);
        cd.writeUInt16LE(0, 34);
        cd.writeUInt16LE(0, 36);
        cd.writeUInt32LE(0, 38);
        cd.writeUInt32LE(offset, 42);

        centralHeaders.push(cd, nameBuf);
        offset += 30 + nameBuf.length + compressed.length;
    }

    const localData = Buffer.concat(localHeaders);
    const centralData = Buffer.concat(centralHeaders);

    // End of central directory record (22 bytes)
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0);
    eocd.writeUInt16LE(0, 4);
    eocd.writeUInt16LE(0, 6);
    eocd.writeUInt16LE(files.length, 8);
    eocd.writeUInt16LE(files.length, 10);
    eocd.writeUInt32LE(centralData.length, 12);
    eocd.writeUInt32LE(localData.length, 16);
    eocd.writeUInt16LE(0, 20);

    return Buffer.concat([localData, centralData, eocd]);
}

const zipBuffer = createZip(fileList);
console.log(`[Pack] Payload ZIP gerado (${zipBuffer.length} bytes).`);

// 7. Constrói o cabeçalho CRX3 assinado (Protobuf)
function encodeVarint(val) {
    const bytes = [];
    while (val > 127) {
        bytes.push((val & 127) | 128);
        val = val >>> 7;
    }
    bytes.push(val);
    return Buffer.from(bytes);
}

function encodeLengthDelimited(fieldNumber, data) {
    const tag = encodeVarint((fieldNumber << 3) | 2);
    const len = encodeVarint(data.length);
    return Buffer.concat([tag, len, data]);
}

// SignedData: field 1 = crx_id (16 bytes)
const signedData = encodeLengthDelimited(1, crxIdRaw);

// Assinatura: "CRX3 SignedData\x00" + len(signedData) (uint32 LE) + signedData + zipBuffer
const formatPrefix = Buffer.from('CRX3 SignedData\x00', 'utf8');
const signedDataLenBuf = Buffer.alloc(4);
signedDataLenBuf.writeUInt32LE(signedData.length, 0);
const dataToSign = Buffer.concat([formatPrefix, signedDataLenBuf, signedData, zipBuffer]);

const signer = crypto.createSign('SHA256');
signer.update(dataToSign);
const signature = signer.sign(privateKeyPem);

// AsymmetricKeyProof: field 1 = public_key, field 2 = signature
const proof = Buffer.concat([
    encodeLengthDelimited(1, publicKeyDer),
    encodeLengthDelimited(2, signature)
]);

// CrxFileHeader: field 2 = sha256_with_rsa, field 10000 = signed_header_data
const headerField10000Tag = encodeVarint((10000 << 3) | 2);
const headerField10000 = Buffer.concat([
    headerField10000Tag,
    encodeVarint(signedData.length),
    signedData
]);

const crxFileHeader = Buffer.concat([
    encodeLengthDelimited(2, proof),
    headerField10000
]);

// CRX3: Magic "Cr24" + Version 3 (uint32 LE) + Header Length (uint32 LE) + Header + ZIP
const magic = Buffer.from([0x43, 0x72, 0x32, 0x34]); // "Cr24"
const versionBuf = Buffer.alloc(4);
versionBuf.writeUInt32LE(3, 0);
const headerLenBuf = Buffer.alloc(4);
headerLenBuf.writeUInt32LE(crxFileHeader.length, 0);

const crxBuffer = Buffer.concat([magic, versionBuf, headerLenBuf, crxFileHeader, zipBuffer]);
const crxOutPath = path.join(rootDir, crxFilename);
fs.writeFileSync(crxOutPath, crxBuffer);

const crxSha256 = crypto.createHash('sha256').update(crxBuffer).digest('hex');

// 8. Gera / Atualiza updates.xml oficial (Protocolo Omaha v2)
const updateXmlPath = path.join(rootDir, 'updates.xml');
const updateXml = `<?xml version='1.0' encoding='UTF-8'?>
<gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
  <app appid='${extensionId}'>
    <updatecheck codebase='https://raw.githubusercontent.com/prefeitura-rio-branco-do-sul/extensao_painel_ids_estilo/main/${crxFilename}' version='${version}' />
  </app>
</gupdate>
`;
fs.writeFileSync(updateXmlPath, updateXml, 'utf8');

console.log('\n=============================================================');
console.log('[Pack] EXTENSÃO EMPACOTADA COM SUCESSO! (CRX3 OFICIAL)');
console.log('=============================================================');
console.log(`Nome da Extensão:  ${extName}`);
console.log(`Versão:            ${version}`);
console.log(`Extension ID:      ${extensionId}`);
console.log(`Arquivo CRX:       ${crxFilename} (${(crxBuffer.length / 1024).toFixed(1)} KB)`);
console.log(`Chave Privada:     key.pem (RSA 2048-bit)`);
console.log(`XML de Atualização: updates.xml`);
console.log(`SHA-256 do CRX:    ${crxSha256}`);
console.log('=============================================================\n');
