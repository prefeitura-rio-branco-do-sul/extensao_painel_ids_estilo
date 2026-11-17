// =============================================================
// Núcleo do Painel Institucional (Ativação e Orquestração)
// =============================================================

import {
    LOGO_PREFEITURA,
    LOGO_PREFEITURA_FALLBACK,
    LOGO_IDS,
    DEFAULT_IMG_FACHADA,
    CSS_URL,
    TEMPLATE_URL,
    RSS_URL,
    INITIAL_SLIDES,
    FALLBACK_IMAGES,
    RSS_REFRESH_INTERVAL
} from "../config/constants.js";

import { injectStyles, createPanelDOM } from "../utils/dom.js";
import { initClock } from "../components/clock.js";
import { initCarousel } from "../components/carousel.js";
import { initCalls } from "../components/calls.js";
import { fetchRssNews } from "../services/rssService.js";

let painelInitialized = false;

export const activatePainelMode = async () => {
    if (painelInitialized) return;
    painelInitialized = true;

    console.log("[Painel RBS] Painel #O95_id detectado! Ativando interface institucional do Projeto RBS...");

    // Remove máscaras pendentes do UniGUI (ex: 'Validando login')
    try {
        document.querySelectorAll(".x-mask, .x-mask-msg").forEach((mask) => {
            mask.style.display = "none";
        });
    } catch (e) {}

    // Injeta CSS institucional desacoplado
    injectStyles(CSS_URL);

    // Marca o body para modo painel ativo
    document.body.classList.add("rbs-active");

    // Monta a interface do Projeto RBS a partir do template desacoplado
    const rbsApp = await createPanelDOM(LOGO_PREFEITURA, LOGO_IDS, TEMPLATE_URL);
    if (!document.getElementById("rbs-painel-app")) {
        document.body.appendChild(rbsApp);
    }

    // Elementos do Cabeçalho
    const clockEl = document.getElementById("rbs-clock");
    const dayOfWeekEl = document.getElementById("rbs-day-of-week");
    const fullDateEl = document.getElementById("rbs-full-date");

    // Define o nome da Unidade no Título
    const savedUnit = sessionStorage.getItem("rbs_selected_unit");
    const urlUnit = new URLSearchParams(window.location.search).get("unidade");
    const activeUnit = savedUnit || urlUnit;

    const titleEl = document.getElementById("rbs-unit-title");
    if (titleEl) {
        if (activeUnit) {
            const formatted = activeUnit.toUpperCase().split(" - ")[1] || activeUnit.toUpperCase();
            titleEl.textContent = formatted;
        } else {
            titleEl.textContent = "UNIDADE BÁSICA DE SAÚDE";
        }
    }

    // Elementos de Chamada
    const mainContainer = document.getElementById("rbs-main-container");
    const callPresentation = document.getElementById("rbs-call-presentation");
    const callingName = document.getElementById("rbs-calling-name");
    const callingTicket = document.getElementById("rbs-calling-ticket");
    const callingLocation = document.getElementById("rbs-calling-location");
    const callsList = document.getElementById("rbs-calls-list");

    // Elementos do Carrossel de Notícias
    const newsImage = document.getElementById("news-image");
    const newsTitle = document.getElementById("news-title");
    const newsSubtitle = document.getElementById("news-subtitle");
    const progressIndicator = document.getElementById("rbs-progress-indicator");
    const dotsContainer = document.getElementById("rbs-carousel-dots") || document.getElementById("carousel-dots");

    // Fallbacks de imagens
    const logoPrefImg = document.getElementById("rbs-logo-pref");
    if (logoPrefImg) {
        logoPrefImg.onerror = () => {
            logoPrefImg.src = LOGO_PREFEITURA_FALLBACK;
        };
    }

    if (newsImage) {
        newsImage.onerror = () => {
            newsImage.src = DEFAULT_IMG_FACHADA;
        };
    }

    // 1. Inicializa o Relógio
    initClock(clockEl, dayOfWeekEl, fullDateEl);

    // 2. Inicializa o Carrossel de Notícias
    const carousel = initCarousel(
        { newsImage, newsTitle, newsSubtitle, progressIndicator, dotsContainer, mainContainer },
        INITIAL_SLIDES
    );

    // 3. Inicializa as Chamadas e Sincronização UniGUI
    const calls = initCalls(
        { mainContainer, callPresentation, callingName, callingTicket, callingLocation, callsList },
        { onCallEnd: () => carousel.adjustLines() }
    );

    // 4. Integração com Feed RSS
    const loadRss = async () => {
        const items = await fetchRssNews(RSS_URL, FALLBACK_IMAGES);
        if (items && items.length > 0) {
            carousel.setSlides(items);
            console.log(`[Painel RBS] ${items.length} notícias atualizadas via RSS.`);
        } else {
            // Fallback para título que já estiver na tela do IDS se houver
            const idsNewsTitle = document.getElementById("O200_id");
            if (idsNewsTitle && idsNewsTitle.textContent.trim()) {
                const currentSlides = carousel.getSlides();
                if (currentSlides && currentSlides.length > 0) {
                    currentSlides[0].title = idsNewsTitle.textContent.trim();
                    carousel.setSlides(currentSlides);
                }
            }
        }
    };

    loadRss();
    window.setInterval(loadRss, RSS_REFRESH_INTERVAL);

    // 5. Observa atualizações de chamadas do IDS Saúde via MutationObserver
    const panelObserver = new MutationObserver(() => {
        calls.syncWithIdsDom();
    });

    panelObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["class", "style", "aria-hidden", "aria-expanded"]
    });
};
