// =============================================================
// Componente de Relógio e Data em Tempo Real
// =============================================================

export const initClock = (clockEl, dayOfWeekEl, fullDateEl) => {
    const updateClock = () => {
        if (!clockEl || !dayOfWeekEl || !fullDateEl) return;
        const now = new Date();

        clockEl.textContent = new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        }).format(now);

        const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(now);
        dayOfWeekEl.textContent = weekday.charAt(0).toUpperCase() + weekday.slice(1);

        fullDateEl.textContent = new Intl.DateTimeFormat("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now);
    };

    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return { updateClock, timer };
};
