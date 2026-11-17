# Registro de Alterações (Changelog)

Todas as modificações notáveis neste projeto são documentadas neste arquivo.

## [1.3.0] - 2026-11-17

### Adicionado
- Empacotamento oficial no formato Chrome Extension CRX3 (`extensao_painel_ids_estilo.crx`).
- Geração da chave criptográfica RSA de 2048 bits (`key.pem`) para garantir um Extension ID fixo.
- Protocolo de auto-atualização via arquivo `updates.xml` (Omaha v2).
- Script automatizado de build e empacotamento (`scripts/pack.js`).
- Estruturação profissional para publicação no GitHub (`README.md`, `LICENSE`, `package.json`, `.gitignore`, `.gitattributes`).

### Modificado
- Reorganização completa da pasta de recursos:
  - Estilos centralizados em `assets/css/` (`layout.css`, `header.css`, `calls.css`, `news.css`, `responsive.css`).
  - Imagens centralizadas em `assets/images/` (`brasao-rio-branco.png`, `fallback-1.jpeg`, `fallback-2.jpeg`, `logo-ids.png`).
- Desacoplamento do template HTML para `templates/panel.html`.

---

## [1.2.0] - 2026-11-12

### Modificado
- Conversão de todas as medidas de estilo (`px` e `rem`) para unidades relativas de viewport (`vw` e `vh`), garantindo adaptação perfeita a qualquer resolução de TV/monitor sem distorção.
- Implementação de cálculo dinâmico para título e descrição de notícias limitados a 5 linhas no total, com truncamento via reticências (`overflow: ellipsis`).
- Refinamento do carrossel de notícias integrado ao feed RSS oficial da Prefeitura.

---

## [1.1.0] - 2026-11-11

### Adicionado
- Observador de ciclo de vida para suporte à tela de autenticação prévia do UniGUI/ExtJS.
- Captura passiva do nome da unidade de saúde selecionada no formulário de login.
- Remoção automática de máscaras residuais de validação de login (`Validando login`).

---

## [1.0.0] - 2026-11-10

### Adicionado
- Versão inicial da extensão para modernização da interface do painel eletrônico IDS Saúde.
- Injeção de identidade visual da Prefeitura Municipal de Rio Branco do Sul.
- Sincronização em tempo real de chamadas de pacientes via MutationObserver.
- Exibição de relógio digital, data completa e destaques de atendimento.
