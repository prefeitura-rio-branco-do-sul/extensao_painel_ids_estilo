# Guia de Contribuição

Obrigado pelo interesse em contribuir com a extensão do Painel IDS Saúde da Prefeitura de Rio Branco do Sul.

## Diretrizes de Desenvolvimento

1. **Unidades de Medida**:
   - Nunca utilize valores fixos em `px` ou `rem` nos arquivos de estilo (`assets/css/`).
   - Utilize sempre unidades baseadas na viewport (`vw` para medidas horizontais e fontes; `vh` para medidas verticais e margens).

2. **Modularidade**:
   - Mantenha a separação de responsabilidades nas pastas correspondentes (`src/components/`, `src/services/`, `src/utils/`, etc.).
   - Não acople código HTML diretamente em arquivos JavaScript; utilize o template desacoplado em `templates/panel.html`.

3. **Fluxo de Trabalho e Build**:
   - Sempre que alterar arquivos em `src/` ou `templates/`, execute:
     ```bash
     npm run build
     ```
   - Para gerar um novo pacote `.crx` atualizado para distribuição:
     ```bash
     npm run pack
     ```
   - Lembre-se de incrementar a versão no `manifest.json` e no `package.json` antes de gerar uma nova versão para os painéis das unidades.

4. **Chave Privada (`key.pem`)**:
   - A chave privada é necessária para que o Chrome reconheça a extensão sob o mesmo ID (`gclbcjhjbpibjakacaakcgdomkkefmaj`).
   - Mantenha este arquivo preservado para não invalidar instalações já realizadas nos terminais das UBS.
