# Extensão Painel IDS Saúde - Rio Branco do Sul

Extensão para o navegador Google Chrome (Manifest V3) desenvolvida pelo **Departamento de Tecnologia da Informação (DETEC)** da **Prefeitura Municipal de Rio Branco do Sul - PR**.

O objetivo desta extensão é modernizar a apresentação visual do painel eletrônico de atendimento do sistema **IDS Saúde**, substituindo a interface padrão por uma identidade visual institucional limpa, moderna, de alta legibilidade para TVs/monitores de salas de espera e com integração de notícias oficiais da cidade.

---

## Principais Recursos

- **Identidade Visual Institucional**: Cores oficiais da Prefeitura, brasão do município e tipografia Rubik de alta legibilidade.
- **Responsividade Absoluta (0 px / 0 rem)**: Todo o layout utiliza unidades relativas à tela (`vw` e `vh`), garantindo adaptação perfeita e sem cortes em televisores 720p, 1080p, 4K ou qualquer proporção de tela.
- **Destaque Dinâmico de Chamada ("Chamando Agora")**: Quando um paciente é chamado, a interface entra em modo de destaque, exibindo o nome, local de destino e senha com animações suaves de pulsação e visibilidade prioritária.
- **Histórico das Últimas Chamadas**: Lista lateral com os últimos pacientes chamados, calculando o tempo decorrido de forma automática.
- **Carrossel de Notícias Oficiais (Feed RSS)**: Integração com o feed oficial de notícias da Prefeitura (`riobrancodosul.atende.net`), com controle de rotação e cálculo de até 5 linhas com reticências para textos longos.
- **Relógio e Calendário em Tempo Real**: Data completa em português e relógio digital sincronizado.
- **Compatibilidade com o Ciclo de Login UniGUI / ExtJS**: Monitora a etapa de autenticação prévia, captura a Unidade Básica de Saúde selecionada pelo operador e aplica o novo tema apenas após a conclusão do login, sem interferir nas requisições do sistema original.
- **Auto-Atualização (Omaha v2)**: Suporte nativo ao mecanismo de atualização automática do Chrome por meio de arquivo `updates.xml`.

---

## Estrutura do Repositório

```text
extensao_painel_ids_estilo/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Pipeline de validação contínua no GitHub Actions
├── assets/
│   ├── css/                       # Folhas de estilo modularizadas (100% viewport)
│   │   ├── calls.css              # Destaque de chamada ativa e lista de histórico
│   │   ├── header.css             # Cabeçalho superior, logos, título e relógio
│   │   ├── layout.css             # Estrutura de base e overlay tela cheia
│   │   ├── news.css               # Card de notícias, carrossel e barra de progresso
│   │   ├── painel.css             # Folha principal agregadora
│   │   └── responsive.css         # Regras de adaptação para diferentes telas
│   └── images/                    # Recursos visuais e logotipos institucionais
│       ├── brasao-rio-branco.png  # Brasão oficial do município
│       ├── fallback-1.jpeg        # Imagem de contingência 1 (Fachada da Prefeitura)
│       ├── fallback-2.jpeg        # Imagem de contingência 2 (Ações municipais)
│       └── logo-ids.png           # Logotipo do sistema IDS
├── dist/
│   └── bundle.js                  # Script consolidado para execução offline
├── scripts/
│   └── pack.js                    # Utilitário para geração do pacote .crx, .pem e updates.xml
├── src/
│   ├── components/                # Componentes da interface
│   │   ├── calls.js               # Gestão de chamadas e histórico
│   │   ├── carousel.js            # Carrossel e rotação de notícias
│   │   └── clock.js               # Relógio e formatação de datas
│   ├── config/
│   │   └── constants.js           # Constantes e caminhos de recursos
│   ├── core/
│   │   ├── panel.js               # Inicialização e orquestração do painel
│   │   └── stateObserver.js       # Observador de login e transição de telas
│   ├── services/
│   │   └── rssService.js          # Consumo e sanitização do feed RSS
│   ├── utils/
│   │   ├── dom.js                 # Manipulação do DOM e injeção do template
│   │   ├── formatters.js          # Formatadores de texto e tempo
│   │   └── validation.js          # Validação e filtros de chamadas
│   └── main.js                    # Ponto de entrada modular
├── templates/
│   └── panel.html                 # Template semântico desacoplado do painel
├── .gitattributes                 # Normalização de quebras de linha no Git
├── .gitignore                     # Arquivos ignorados pelo controle de versão
├── build.js                       # Script de geração do bundle
├── CHANGELOG.md                   # Histórico detalhado de versões
├── content.js                     # Entrypoint Manifest V3 da extensão
├── CONTRIBUTING.md                # Diretrizes de desenvolvimento para o time
├── extensao_painel_ids_estilo.crx # Extensão empacotada pronta para distribuição
├── key.pem                        # Chave privada RSA (mantém o ID da extensão fixo)
├── LICENSE                        # Termos de uso e licença institucional
├── manifest.json                  # Manifesto da extensão Manifest V3
├── package.json                   # Metadados e scripts de automação npm
├── README.md                      # Esta documentação
└── updates.xml                    # Manifesto de auto-atualização do Chrome
```

---

## Como Instalar e Utilizar

### Método 1: Instalação Descompactada (Modo Desenvolvedor / Testes)

Ideal para manutenção, desenvolvimento ou testes rápidos:

1. Abra o Google Chrome e acesse `chrome://extensions/`.
2. Ative a chave **Modo do desenvolvedor** no canto superior direito.
3. Clique em **Carregar sem compactação** (Load unpacked).
4. Selecione a pasta raiz deste repositório (`extensao_painel_ids_estilo`).
5. Acesse a URL do painel da sua unidade (`https://riobrancodosul-saude.ids.inf.br/riobrancodosul/painel/idspaiele.dll`).
6. Faça o login normalmente. Assim que a tela do painel abrir, o tema institucional será ativado automaticamente.

---

### Método 2: Instalação via Pacote `.crx`

O arquivo `extensao_painel_ids_estilo.crx` gerado já está assinado digitalmente com a chave privada `key.pem`.

#### Instalação manual:
1. Abra o Chrome e acesse `chrome://extensions/`.
2. Certifique-se de que o **Modo do desenvolvedor** está ativo.
3. Arraste e solte o arquivo `extensao_painel_ids_estilo.crx` diretamente dentro da página de extensões.
4. Confirme a instalação na caixa de diálogo do Chrome.

#### Instalação corporativa via Política de Grupo (GPO / Registro do Windows):
Para computadores gerenciados nas salas de atendimento das unidades de saúde, a extensão pode ser instalada e fixada via Registro do Windows ou GPO através do Extension ID fixo:
- **Extension ID**: `gclbcjhjbpibjakacaakcgdomkkefmaj`
- **Chave de Registro**:
  ```text
  [HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist]
  "1"="gclbcjhjbpibjakacaakcgdomkkefmaj;https://raw.githubusercontent.com/prefeitura-rio-branco-do-sul/extensao_painel_ids_estilo/main/updates.xml"
  ```

---

## Como Funciona a Auto-Atualização

A extensão utiliza o protocolo oficial **Google Update (Omaha v2)**:

1. O arquivo `manifest.json` possui a propriedade `"update_url"` apontando para o arquivo `updates.xml` hospedado no repositório.
2. O arquivo `updates.xml` informa o `appid` (`gclbcjhjbpibjakacaakcgdomkkefmaj`), a versão mais recente e o link direto do arquivo `.crx`.
3. O Google Chrome verifica periodicamente o XML. Quando uma versão maior que a instalada for publicada, o download e a atualização ocorrem de forma silenciosa e transparente.

---

## Scripts Disponíveis

No terminal, dentro da pasta do projeto, você pode executar:

| Comando | Descrição |
|---|---|
| `npm run build` | Compila os módulos de `src/` e o template HTML em `dist/bundle.js`. |
| `npm run pack` | Executa o build, gera o arquivo `.crx` assinado com `key.pem` e atualiza o `updates.xml`. |
| `npm test` | Realiza a verificação de sintaxe de todos os arquivos JavaScript do projeto. |

---

## Publicando no GitHub

Para subir este repositório no GitHub:

1. Inicialize o Git na pasta do projeto (caso ainda não esteja inicializado):
   ```bash
   git init
   git branch -M main
   ```
2. Adicione os arquivos ao commit:
   ```bash
   git add .
   git commit -m "feat: release v1.3.0 - padronizacao institucional e empacotamento crx"
   ```
3. Conecte ao repositório remoto no GitHub:
   ```bash
   git remote add origin https://github.com/prefeitura-rio-branco-do-sul/extensao_painel_ids_estilo.git
   ```
4. Envie as alterações:
   ```bash
   git push -u origin main
   ```

> **Atenção**: Se utilizar outra conta ou organização no GitHub, ajuste a URL correspondente no `manifest.json`, no `updates.xml` e no `package.json`.

---

## Licença e Créditos

Desenvolvido pelo **Departamento de Tecnologia da Informação (DETEC)**  
Secretaria Municipal de Administração (SEMAD)  
**Prefeitura Municipal de Rio Branco do Sul - PR**
