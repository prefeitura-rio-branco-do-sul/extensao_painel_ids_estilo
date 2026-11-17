// =============================================================
// Extensão Painel IDS Saúde - Rio Branco do Sul
// Entrypoint Principal da Extensão (Manifest V3)
// =============================================================

(async () => {
    if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
        // Modo Extensão Chrome (Manifest V3): carrega módulos ES nativamente
        try {
            const src = chrome.runtime.getURL("src/main.js");
            await import(src);
        } catch (err) {
            console.error("[Painel RBS] Erro ao carregar módulos da extensão:", err);
        }
    } else {
        // Modo Teste Local Offline (file://): carrega bundle auxiliar para evitar bloqueio CORS
        try {
            const script = document.createElement("script");
            script.src = "dist/bundle.js";
            document.body.appendChild(script);
        } catch (e) {
            console.error("[Painel RBS] Erro ao carregar script no ambiente local:", e);
        }
    }
})();
