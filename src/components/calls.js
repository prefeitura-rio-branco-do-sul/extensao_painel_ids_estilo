// =============================================================
// Componente de Chamadas e Sincronização IDS Saúde (UniGUI)
// =============================================================

import { CALL_PRESENTATION_DURATION, RECENT_CALL_PAIRS, MAX_CALL_HISTORY } from "../config/constants.js";
import { isValidPatientName, isValidLocation, isValidTicket } from "../utils/validation.js";
import { parseDestination, formatCallAge } from "../utils/formatters.js";
import { createHistoryItem } from "../utils/dom.js";

export const initCalls = (elements, options = {}) => {
    const { mainContainer, callPresentation, callingName, callingTicket, callingLocation, callsList } = elements;
    const { onCallEnd } = options;

    let callTimeout = null;
    let lastCalledName = "";
    let lastCall1Text = "";

    // Pré-carrega valores iniciais do DOM para evitar falso disparo de inicialização
    const initialCallingEl = document.getElementById("O113_id");
    if (initialCallingEl) {
        lastCalledName = initialCallingEl.textContent.trim();
    }
    const initialCall1El = document.getElementById("O249_id");
    if (initialCall1El) {
        const initialCall1Name = initialCall1El.textContent.trim();
        if (isValidPatientName(initialCall1Name)) {
            lastCall1Text = initialCall1Name;
        }
    }

    const updateCallAges = () => {
        if (!callsList) return;
        callsList.querySelectorAll("[data-called-at]").forEach((item) => {
            const calledAt = Number(item.dataset.calledAt);
            const location = item.dataset.location;
            const timeStr = item.dataset.timeStr;
            const locEl = item.querySelector(".call-location");
            if (locEl) {
                locEl.textContent = `${location} • ${formatCallAge(calledAt, timeStr)}`;
            }
        });
    };

    const announceCall = (call) => {
        if (!call || typeof call !== "object") return;
        const name = (call.name || "").trim();
        const rawLoc = (call.location || "").trim();
        const rawTicket = (call.ticket || "").trim();

        if (!isValidPatientName(name)) {
            console.log(`[Painel RBS] Chamada ignorada (placeholder/inválido): "${name}"`);
            return;
        }

        const location = isValidLocation(rawLoc) ? rawLoc : "CONSULTÓRIO";
        const cleanTicket = isValidTicket(rawTicket) ? rawTicket.replace(/^senha\s*:?\s*/i, "").trim() : "";

        console.log(`[Painel RBS] Chamando: ${name} -> ${location} (${cleanTicket})`);

        if (callingName) callingName.textContent = name;
        if (callingLocation) callingLocation.textContent = location;
        if (callingTicket) {
            callingTicket.textContent = cleanTicket ? `Senha ${cleanTicket}` : "";
            callingTicket.hidden = !cleanTicket;
        }

        if (callPresentation) {
            callPresentation.setAttribute(
                "aria-label",
                `Chamando agora: ${name}. Dirija-se a ${location}.`
            );
        }

        if (mainContainer) {
            mainContainer.classList.add("is-calling");
        }

        if (callsList) {
            callsList.querySelectorAll(".current-call").forEach((el) => el.classList.remove("current-call"));
            callsList.querySelectorAll(".call-item.active").forEach((el) => el.classList.remove("active"));

            const historyItem = createHistoryItem(name, location, Date.now(), "", true);
            historyItem.classList.add("current-call");
            callsList.prepend(historyItem);

            while (callsList.children.length > MAX_CALL_HISTORY) {
                callsList.lastElementChild.remove();
            }
        }

        window.clearTimeout(callTimeout);
        callTimeout = window.setTimeout(() => {
            if (mainContainer) mainContainer.classList.remove("is-calling");
            if (callsList) {
                const cur = callsList.querySelector(".current-call");
                if (cur) cur.classList.remove("current-call");
            }
            if (typeof onCallEnd === "function") {
                onCallEnd();
            }
        }, CALL_PRESENTATION_DURATION);
    };

    const populateInitialCalls = () => {
        if (!callsList) return;

        const calls = [];
        RECENT_CALL_PAIRS.forEach((pair) => {
            const nameEl = document.getElementById(pair.nameId);
            const locEl = document.getElementById(pair.locId);
            const name = nameEl ? nameEl.textContent.trim() : "";
            const rawLoc = locEl ? locEl.textContent.trim() : "";

            if (isValidPatientName(name)) {
                const parsed = parseDestination(rawLoc);
                const location = isValidLocation(parsed.location) ? parsed.location : "CONSULTÓRIO";
                let calledAt = Date.now() - pair.minutesAgo * 60000;
                calls.push({
                    name,
                    location,
                    calledAt,
                    timeStr: parsed.timeStr
                });
            }
        });

        if (calls.length > 0) {
            callsList.innerHTML = "";
            calls.forEach((c, idx) => {
                const item = createHistoryItem(c.name, c.location, c.calledAt, c.timeStr, idx === 0);
                callsList.appendChild(item);
            });
        }
    };

    const syncWithIdsDom = () => {
        // A. Verifica se o painel UniGUI abriu a aba de chamada em destaque (#OF3_id)
        const callingTab = document.getElementById("OF3_id");
        const callingNameEl = document.getElementById("O113_id");
        const callingLocEl = document.getElementById("O137_id");
        const callingTicketEl = document.getElementById("O117_id");

        const isCallingTabVisible =
            callingTab &&
            !callingTab.classList.contains("x-hidden-offsets") &&
            callingTab.getAttribute("aria-hidden") !== "true" &&
            callingTab.style.display !== "none" &&
            callingTab.style.visibility !== "hidden";

        const currentName = callingNameEl ? callingNameEl.textContent.trim() : "";

        if (isValidPatientName(currentName)) {
            if ((isCallingTabVisible || currentName !== lastCalledName) && currentName !== lastCalledName) {
                lastCalledName = currentName;
                const rawLoc = callingLocEl ? callingLocEl.textContent.trim() : "";
                const parsed = parseDestination(rawLoc);
                const loc = isValidLocation(parsed.location) ? parsed.location : "CONSULTÓRIO";
                const ticket = callingTicketEl ? callingTicketEl.textContent.trim() : "";
                announceCall({ name: currentName, location: loc, ticket });
            }
        } else if (currentName) {
            // Guarda placeholder (ex: 'Inicializando..' ou 'Nome Usuário') para evitar falso disparo posterior
            lastCalledName = currentName;
        }

        if (!isCallingTabVisible && !callTimeout && mainContainer && mainContainer.classList.contains("is-calling")) {
            mainContainer.classList.remove("is-calling");
        }

        // B. Sincroniza a lista de últimas chamadas do rodapé do IDS Saúde
        const call1NameEl = document.getElementById("O249_id");
        const call1Name = call1NameEl ? call1NameEl.textContent.trim() : "";

        if (isValidPatientName(call1Name) && call1Name !== lastCall1Text) {
            lastCall1Text = call1Name;
            populateInitialCalls();
        }
    };

    // Preenche chamadas iniciais extraídas do IDS
    populateInitialCalls();

    const ageTimer = window.setInterval(updateCallAges, 15000);
    const syncTimer = window.setInterval(syncWithIdsDom, 1000);

    // Expõe announceCall globalmente para integrações externas
    window.announceCall = announceCall;
    window.addEventListener("patient-called", (event) => {
        if (event.detail) announceCall(event.detail);
    });

    return {
        announceCall,
        populateInitialCalls,
        syncWithIdsDom,
        updateCallAges,
        timers: [ageTimer, syncTimer]
    };
};
