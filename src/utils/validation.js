// =============================================================
// Validações de Pacientes, Locais e Senhas
// =============================================================

export const isValidPatientName = (name) => {
    if (!name || typeof name !== "string") return false;
    const clean = name.trim();
    if (clean.length < 2) return false;

    const lower = clean.toLowerCase();

    // Palavras e padrões que identificam inicialização ou placeholders do UniGUI/Delphi
    if (lower.includes("inicializ")) return false; // "Inicializando", "Inicializando..", etc.
    if (lower.includes("carreg")) return false;   // "Carregando", "Carregando..."
    if (lower.includes("aguard")) return false;   // "Aguardando", "Aguarde..."
    if (lower.includes("usuário") || lower.includes("usuario")) return false; // "Nome Usuário", "Usuário", etc.
    if (lower.includes("paciên") || lower.includes("pacien")) return false; // "Nome Paciente", "Paciente", etc.
    if (lower.includes("local atend") || lower.includes("local de atend")) return false;
    if (lower === "consultório" || lower === "consultorio" || lower === "atendimento") return false;
    if (lower === "painel" || lower === "sistema" || lower === "undefined" || lower === "null" || lower === "teste") return false;

    // Padrões de pontuação pura, traços ou símbolos (ex: "-", "--", "...", ".")
    if (/^[\s\-._+*#?!/\\()]+$/.test(clean)) return false;

    return true;
};

export const isValidLocation = (loc) => {
    if (!loc || typeof loc !== "string") return false;
    const clean = loc.trim();
    if (clean.length < 2) return false;
    const lower = clean.toLowerCase();
    if (lower.includes("inicializ") || lower.includes("carreg") || lower.includes("aguard")) return false;
    if (lower.includes("local atend") || lower.includes("local de atend")) return false;
    if (lower === "undefined" || lower === "null" || lower === "-") return false;
    return true;
};

export const isValidTicket = (ticket) => {
    if (!ticket || typeof ticket !== "string") return false;
    const clean = ticket.trim().toLowerCase();
    if (!clean || clean === "atendimento" || clean === "senha" || clean === "0" || clean === "-" || clean === "null" || clean === "undefined") return false;
    return true;
};
