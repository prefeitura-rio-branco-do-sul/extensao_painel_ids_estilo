// =============================================================
// Monitoramento do Ciclo de Vida (Login -> Painel)
// =============================================================

export const initLoginCapture = () => {
    const recordUnit = (val) => {
        if (!val || typeof val !== "string") return;
        const clean = val.trim();
        if (clean && !clean.toLowerCase().includes("filtro")) {
            try {
                sessionStorage.setItem("rbs_selected_unit", clean);
                console.log(`[Painel RBS] Unidade capturada: "${clean}"`);
            } catch (e) {}
        }
    };

    // Escuta passiva de alteração no campo de pesquisa/unidade
    document.addEventListener("change", (e) => {
        if (e.target && e.target.id && e.target.id.includes("O3F") && e.target.value) {
            recordUnit(e.target.value);
        }
    }, true);

    // Escuta passiva de seleção no dropdown ExtJS
    document.addEventListener("click", (e) => {
        const item = e.target.closest && e.target.closest(".x-boundlist-item");
        if (item && item.textContent) {
            recordUnit(item.textContent);
        }
    }, true);
};

export const initLoginObserver = (onPanelReady) => {
    const checkState = () => {
        // Se #O95_id existir, o login já ocorreu e o painel principal foi montado pelo UniGUI
        if (document.getElementById("O95_id") !== null) {
            onPanelReady();
        }
    };

    // 1. Checagem imediata
    checkState();

    // 2. Observador de mutações para detectar criação do painel após login
    const targetNode = document.body || document.documentElement;
    if (targetNode) {
        const stateObserver = new MutationObserver(() => {
            checkState();
        });

        stateObserver.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }

    // 3. Verificação de segurança periódica a cada 500ms
    const safetyTimer = window.setInterval(checkState, 500);

    return { checkState, safetyTimer };
};
