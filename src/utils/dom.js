// =============================================================
// Construtores de DOM e Injeção de Estilos
// =============================================================

import { formatCallAge } from "./formatters.js";

let panelTemplateCache = typeof window !== "undefined" && window.__RBS_PANEL_TEMPLATE__ ? window.__RBS_PANEL_TEMPLATE__ : null;

export const setPanelTemplate = (html) => {
    panelTemplateCache = html;
};

export const fetchPanelTemplate = async (templateUrl) => {
    if (panelTemplateCache) return panelTemplateCache;
    if (templateUrl) {
        try {
            const res = await fetch(templateUrl);
            if (res.ok) {
                panelTemplateCache = await res.text();
                return panelTemplateCache;
            }
        } catch (e) {
            console.warn("[Painel RBS] Fetch do template panel.html via rede falhou:", e);
        }
    }
    return panelTemplateCache || "";
};

export const injectStyles = (cssUrl) => {
    if (document.getElementById("rbs-painel-estilo-oficial")) return;
    const link = document.createElement("link");
    link.id = "rbs-painel-estilo-oficial";
    link.rel = "stylesheet";
    link.href = cssUrl;
    (document.head || document.documentElement).appendChild(link);
};

export const createPanelDOM = async (logoPrefeitura, logoIds, templateUrl) => {
    let root = document.getElementById("rbs-painel-app");
    if (root) return root;

    root = document.createElement("div");
    root.id = "rbs-painel-app";

    let template = await fetchPanelTemplate(templateUrl);
    if (!template && typeof window !== "undefined" && window.__RBS_PANEL_TEMPLATE__) {
        template = window.__RBS_PANEL_TEMPLATE__;
    }

    if (template) {
        root.innerHTML = template
            .replace(/\{\{LOGO_PREFEITURA\}\}/g, logoPrefeitura)
            .replace(/\{\{LOGO_IDS\}\}/g, logoIds);
    } else {
        console.error("[Painel RBS] Nenhum template HTML encontrado para inicializar o painel.");
    }

    return root;
};

export const createHistoryItem = (name, location, calledAt, timeStr = "", active = false) => {
    const item = document.createElement("li");
    item.className = `call-item${active ? " active" : ""}`;
    item.dataset.calledAt = String(calledAt);
    item.dataset.location = location;
    item.dataset.timeStr = timeStr;

    const patient = document.createElement("span");
    patient.className = "patient-name";
    patient.textContent = name;

    const destination = document.createElement("span");
    destination.className = "call-location";
    const ageLabel = timeStr || formatCallAge(calledAt, timeStr);
    destination.textContent = `${location} • ${ageLabel}`;

    item.append(patient, destination);
    return item;
};
