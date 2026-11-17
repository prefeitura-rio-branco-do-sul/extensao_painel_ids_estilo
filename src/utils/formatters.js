// =============================================================
// Formatadores e Manipulação de Texto
// =============================================================

export const cleanHtmlText = (raw) => {
    if (!raw || typeof raw !== "string") return "";
    let text = raw.replace(/<[^>]*>/g, " ");
    text = text.replace(/&nbsp;/g, " ")
               .replace(/&amp;/g, "&")
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'")
               .replace(/&lt;/g, "<")
               .replace(/&gt;/g, ">");
    text = text.replace(/\s+/g, " ").trim();
    text = text.replace(/\s*([,;:.!?])\s*/g, "$1 ");
    return text.trim();
};

export const formatCallAge = (calledAt, fallbackTime = "") => {
    if (!calledAt || Number.isNaN(calledAt)) return fallbackTime;
    const elapsedMinutes = Math.max(0, Math.floor((Date.now() - calledAt) / 60000));
    if (elapsedMinutes < 1) return "agora";
    if (elapsedMinutes < 60) return `há ${elapsedMinutes} min`;
    if (fallbackTime) return fallbackTime;
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    return `há ${elapsedHours} h`;
};

export const parseDestination = (raw) => {
    if (!raw) return { location: "CONSULTÓRIO", timeStr: "" };
    let clean = raw.replace(/^comparecer\s+[àa]\s*:\s*/i, "").trim();
    const match = clean.match(/^(.*?)\s*-\s*(\d{1,2}:\d{2})$/);
    if (match) {
        return { location: match[1].trim(), timeStr: match[2].trim() };
    }
    return { location: clean, timeStr: "" };
};
