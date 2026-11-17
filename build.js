// =============================================================
// Build script para gerar dist/bundle.js (para testes locais offline)
// Uso: node build.js
// =============================================================

const fs = require('fs');
const path = require('path');

function build() {
    const rootDir = __dirname;
    console.log('[Build] Gerando bundle a partir de src/ e templates/...');

    // 1. Lê o template desacoplado panel.html
    const templatePath = path.join(rootDir, 'templates', 'panel.html');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const templateInjection = `\n// --- Inlined templates/panel.html ---\nwindow.__RBS_PANEL_TEMPLATE__ = ${JSON.stringify(templateContent)};\n`;

    // 2. Arquivos fonte em ordem de dependência
    const files = [
        path.join(rootDir, 'src', 'config', 'constants.js'),
        path.join(rootDir, 'src', 'utils', 'formatters.js'),
        path.join(rootDir, 'src', 'utils', 'validation.js'),
        path.join(rootDir, 'src', 'utils', 'dom.js'),
        path.join(rootDir, 'src', 'services', 'rssService.js'),
        path.join(rootDir, 'src', 'components', 'clock.js'),
        path.join(rootDir, 'src', 'components', 'carousel.js'),
        path.join(rootDir, 'src', 'components', 'calls.js'),
        path.join(rootDir, 'src', 'core', 'panel.js'),
        path.join(rootDir, 'src', 'core', 'stateObserver.js'),
        path.join(rootDir, 'src', 'main.js')
    ];

    let combined = templateInjection;
    files.forEach(file => {
        let code = fs.readFileSync(file, 'utf8');
        // Remove import statements
        code = code.replace(/import\s+[^;]+;\r?\n/g, '');
        // Remove export keywords
        code = code.replace(/export\s+(const|let|var|function|async function|class)\s+/g, '$1 ');
        code = code.replace(/export\s+default\s+/g, '');
        combined += `\n// --- ${path.relative(rootDir, file).replace(/\\/g, '/')} ---\n` + code;
    });

    const bundle = `// =============================================================
// Extensão Painel IDS Saúde - Rio Branco do Sul
// Bundle standalone gerado automaticamente a partir de src/
// =============================================================
(() => {
${combined}
})();
`;

    const distDir = path.join(rootDir, 'dist');
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    const outPath = path.join(distDir, 'bundle.js');
    fs.writeFileSync(outPath, bundle, 'utf8');
    console.log(`[Build] Sucesso! ${outPath} (${bundle.length} bytes)`);
}

build();
