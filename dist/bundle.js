// =============================================================
// Extensão Painel IDS Saúde - Rio Branco do Sul
// Bundle standalone gerado automaticamente a partir de src/
// =============================================================
(() => {

// --- Inlined templates/panel.html ---
window.__RBS_PANEL_TEMPLATE__ = "<!-- ============================================================= -->\n<!-- Template Estrutural do Painel RBS (Prefeitura de Rio Branco do Sul) -->\n<!-- ============================================================= -->\n\n<!-- Cabeçalho Superior -->\n<header class=\"top-bar\">\n    <div class=\"logo-prefeitura\">\n        <img id=\"rbs-logo-pref\" src=\"{{LOGO_PREFEITURA}}\" alt=\"Prefeitura de Rio Branco do Sul\">\n    </div>\n    \n    <h1 class=\"unit-title\" id=\"rbs-unit-title\"></h1>\n    \n    <div class=\"header-right\">\n        <div class=\"date-time\">\n            <div class=\"date-info\">\n                <span class=\"day-of-week\" id=\"rbs-day-of-week\"></span>\n                <span class=\"full-date\" id=\"rbs-full-date\"></span>\n            </div>\n            <div class=\"clock\" id=\"rbs-clock\" aria-label=\"Hora local\"></div>\n        </div>\n        <div class=\"logo-ids\">\n            <img id=\"rbs-logo-ids\" src=\"{{LOGO_IDS}}\" alt=\"IDS Logo\">\n        </div>\n    </div>\n</header>\n\n<!-- Conteúdo Principal -->\n<main class=\"main-container\" id=\"rbs-main-container\">\n    <!-- Apresentação de Chamada (Destaque quando chamado) -->\n    <section class=\"call-presentation\" id=\"rbs-call-presentation\" aria-live=\"assertive\" aria-atomic=\"true\">\n        <div class=\"calling-status\">CHAMANDO AGORA</div>\n        <h2 class=\"calling-name\" id=\"rbs-calling-name\"></h2>\n        <div class=\"calling-destination\">\n            <span class=\"destination-label\">DESTINO</span>\n            <span class=\"calling-location\" id=\"rbs-calling-location\"></span>\n            <span class=\"destination-arrow\" aria-hidden=\"true\">→</span>\n        </div>\n        <div class=\"calling-ticket\" id=\"rbs-calling-ticket\"></div>\n    </section>\n\n    <!-- Card de Notícias (Esquerda) -->\n    <section class=\"news-card\">\n        <div class=\"news-image-container\">\n            <img id=\"news-image\" class=\"news-bg-image\" src=\"\" alt=\"Notícia da Prefeitura\">\n            <div class=\"tag-noticias\">NOTÍCIAS DA PREFEITURA</div>\n            <div class=\"carousel-dots\" id=\"carousel-dots\" aria-label=\"Navegação de notícias\"></div>\n        </div>\n        <div class=\"news-content\">\n            <h2 id=\"news-title\">Carregando notícias da prefeitura...</h2>\n            <p id=\"news-subtitle\"></p>\n            <a class=\"news-link\">Saiba mais em riobrancodosul.pr.gov.br</a>\n        </div>\n        <div class=\"news-progress\">\n            <span class=\"news-progress-indicator\" id=\"rbs-progress-indicator\"></span>\n        </div>\n    </section>\n\n    <!-- Lista de Chamadas (Direita) -->\n    <section class=\"calls-card\">\n        <h2 class=\"calls-title\">ÚLTIMAS CHAMADAS</h2>\n        <ul class=\"calls-list\" id=\"rbs-calls-list\"></ul>\n    </section>\n</main>\n\n<footer class=\"bottom-bar\"></footer>\n";

// --- src/config/constants.js ---
// =============================================================
// Configurações e Constantes Globais
// =============================================================

const getExtUrl = (file) => (typeof chrome !== "undefined" && chrome.runtime?.getURL ? chrome.runtime.getURL(file) : file);

const LOGO_PREFEITURA = getExtUrl("assets/images/brasao-rio-branco.png");
const LOGO_PREFEITURA_FALLBACK = getExtUrl("assets/images/brasao-rio-branco.png");
const LOGO_IDS = getExtUrl("assets/images/logo-ids.png");
const DEFAULT_IMG_FACHADA = getExtUrl("assets/images/fallback-1.jpeg");
const DEFAULT_IMG_BEZERROS = getExtUrl("assets/images/fallback-2.jpeg");
const CSS_URL = getExtUrl("assets/css/painel.css");
const TEMPLATE_URL = getExtUrl("templates/panel.html");

const RSS_URL = "https://api.rss2json.com/v1/api.json?rss_url=https://riobrancodosul.atende.net/cidadao/rss/noticias";

const CALL_PRESENTATION_DURATION = 15000;
const SLIDE_ROTATION_INTERVAL = 8000;
const RSS_REFRESH_INTERVAL = 10 * 60 * 1000;
const CALL_AGE_UPDATE_INTERVAL = 15000;
const DOM_SYNC_INTERVAL = 1000;
const MAX_CALL_HISTORY = 10;

const INITIAL_SLIDES = [
    {
        image: DEFAULT_IMG_FACHADA,
        alt: "Fachada da Prefeitura de Rio Branco do Sul",
        title: "Aprovados no Concurso Público 001/2026: apresentação de documentos",
        subtitle: "Candidatos convocados devem comparecer com a documentação para posse conforme cronograma oficial."
    },
    {
        image: DEFAULT_IMG_BEZERROS,
        alt: "Bezerras em propriedade rural",
        title: "VACINAÇÃO CONTRA BRUCELOSE: AGENDAMENTO PRÉVIO",
        subtitle: "Imunização é obrigatória para bezerras bovinas e bubalinas de 3 a 8 meses de idade."
    }
];

const FALLBACK_IMAGES = [DEFAULT_IMG_FACHADA, DEFAULT_IMG_BEZERROS];

const RECENT_CALL_PAIRS = [
    { nameId: "O249_id", locId: "O251_id", minutesAgo: 2 },
    { nameId: "O265_id", locId: "O269_id", minutesAgo: 5 },
    { nameId: "O281_id", locId: "O285_id", minutesAgo: 8 }
];

// --- src/utils/formatters.js ---
// =============================================================
// Formatadores e Manipulação de Texto
// =============================================================

const cleanHtmlText = (raw) => {
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

const formatCallAge = (calledAt, fallbackTime = "") => {
    if (!calledAt || Number.isNaN(calledAt)) return fallbackTime;
    const elapsedMinutes = Math.max(0, Math.floor((Date.now() - calledAt) / 60000));
    if (elapsedMinutes < 1) return "agora";
    if (elapsedMinutes < 60) return `há ${elapsedMinutes} min`;
    if (fallbackTime) return fallbackTime;
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    return `há ${elapsedHours} h`;
};

const parseDestination = (raw) => {
    if (!raw) return { location: "CONSULTÓRIO", timeStr: "" };
    let clean = raw.replace(/^comparecer\s+[àa]\s*:\s*/i, "").trim();
    const match = clean.match(/^(.*?)\s*-\s*(\d{1,2}:\d{2})$/);
    if (match) {
        return { location: match[1].trim(), timeStr: match[2].trim() };
    }
    return { location: clean, timeStr: "" };
};

// --- src/utils/validation.js ---
// =============================================================
// Validações de Pacientes, Locais e Senhas
// =============================================================

const isValidPatientName = (name) => {
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

const isValidLocation = (loc) => {
    if (!loc || typeof loc !== "string") return false;
    const clean = loc.trim();
    if (clean.length < 2) return false;
    const lower = clean.toLowerCase();
    if (lower.includes("inicializ") || lower.includes("carreg") || lower.includes("aguard")) return false;
    if (lower.includes("local atend") || lower.includes("local de atend")) return false;
    if (lower === "undefined" || lower === "null" || lower === "-") return false;
    return true;
};

const isValidTicket = (ticket) => {
    if (!ticket || typeof ticket !== "string") return false;
    const clean = ticket.trim().toLowerCase();
    if (!clean || clean === "atendimento" || clean === "senha" || clean === "0" || clean === "-" || clean === "null" || clean === "undefined") return false;
    return true;
};

// --- src/utils/dom.js ---
// =============================================================
// Construtores de DOM e Injeção de Estilos
// =============================================================


let panelTemplateCache = typeof window !== "undefined" && window.__RBS_PANEL_TEMPLATE__ ? window.__RBS_PANEL_TEMPLATE__ : null;

const setPanelTemplate = (html) => {
    panelTemplateCache = html;
};

const fetchPanelTemplate = async (templateUrl) => {
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

const injectStyles = (cssUrl) => {
    if (document.getElementById("rbs-painel-estilo-oficial")) return;
    const link = document.createElement("link");
    link.id = "rbs-painel-estilo-oficial";
    link.rel = "stylesheet";
    link.href = cssUrl;
    (document.head || document.documentElement).appendChild(link);
};

const createPanelDOM = async (logoPrefeitura, logoIds, templateUrl) => {
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

const createHistoryItem = (name, location, calledAt, timeStr = "", active = false) => {
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

// --- src/services/rssService.js ---
// =============================================================
// Serviço de Notícias RSS
// =============================================================


const fetchRssNews = async (rssUrl, fallbackImages) => {
    try {
        console.log("[Painel RBS] Buscando notícias atualizadas via RSS...");
        const response = await fetch(rssUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (data.status === "ok" && Array.isArray(data.items) && data.items.length > 0) {
            return data.items.map((item, idx) => {
                let img = "";
                if (item.enclosure && item.enclosure.link) {
                    const url = decodeURIComponent(item.enclosure.link);
                    const match = url.match(/"codigo":"([A-Z0-9]+)"/);
                    if (match) {
                        img = `https://riobrancodosul.atende.net/cidadao/load-image/id/${match[1]}`;
                    }
                } else if (item.thumbnail) {
                    img = item.thumbnail.replace(/&amp;/g, "&");
                }
                if (!img) {
                    img = fallbackImages[idx % fallbackImages.length];
                }

                const desc = cleanHtmlText(item.description || item.content || "");
                const title = cleanHtmlText(item.title || "Notícia da Prefeitura");

                return {
                    image: img,
                    alt: title,
                    title: title,
                    subtitle: desc
                };
            });
        }
        return null;
    } catch (err) {
        console.warn("[Painel RBS] Não foi possível carregar notícias do RSS:", err);
        return null;
    }
};

// --- src/components/clock.js ---
// =============================================================
// Componente de Relógio e Data em Tempo Real
// =============================================================

const initClock = (clockEl, dayOfWeekEl, fullDateEl) => {
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

// --- src/components/carousel.js ---
// =============================================================
// Componente de Carrossel de Notícias
// =============================================================


const adjustNewsLines = (newsTitle, newsSubtitle, mainContainer) => {
    if (!newsTitle || !newsSubtitle) return;

    // Se estiver em modo de chamada ativo, o subtítulo já fica oculto
    if (mainContainer && mainContainer.classList.contains("is-calling")) return;

    const subtitleText = (newsSubtitle.textContent || "").trim();

    // 1. Remove temporariamente o clamp do título para medir a altura natural real
    newsTitle.style.webkitLineClamp = "unset";
    newsTitle.style.display = "block";
    newsTitle.style.overflow = "visible";

    // 2. Obtém a altura da linha (line-height) renderizada
    const titleComputed = window.getComputedStyle(newsTitle);
    let titleLineHeight = parseFloat(titleComputed.lineHeight);
    if (!titleLineHeight || isNaN(titleLineHeight)) {
        titleLineHeight = parseFloat(titleComputed.fontSize) * 1.2;
    }

    const titleHeight = newsTitle.offsetHeight || newsTitle.getBoundingClientRect().height;
    const titleLines = Math.max(1, Math.round(titleHeight / titleLineHeight));

    // 3. Cálculo para que Título + Descrição somem no máximo 5 linhas:
    let titleClamp;
    let descClamp;

    if (!subtitleText) {
        titleClamp = Math.min(titleLines, 5);
        descClamp = 0;
    } else {
        // Título usa até 4 linhas; descrição recebe o restante para totalizar no máximo 5 linhas
        titleClamp = Math.min(titleLines, 4);
        descClamp = Math.max(1, 5 - titleClamp);
    }

    // 4. Aplica clamp e reticências (ellipsis) no título
    newsTitle.style.display = "-webkit-box";
    newsTitle.style.webkitBoxOrient = "vertical";
    newsTitle.style.webkitLineClamp = String(titleClamp);
    newsTitle.style.overflow = "hidden";
    newsTitle.style.textOverflow = "ellipsis";

    // 5. Aplica clamp e reticências (ellipsis) na descrição
    if (descClamp > 0 && subtitleText) {
        newsSubtitle.style.display = "-webkit-box";
        newsSubtitle.style.webkitBoxOrient = "vertical";
        newsSubtitle.style.webkitLineClamp = String(descClamp);
        newsSubtitle.style.overflow = "hidden";
        newsSubtitle.style.textOverflow = "ellipsis";
    } else {
        newsSubtitle.style.display = "none";
    }
};

const initCarousel = (elements, initialSlides = []) => {
    const { newsImage, newsTitle, newsSubtitle, progressIndicator, dotsContainer, mainContainer } = elements;

    let slides = [...initialSlides];
    let currentSlide = 0;
    let slideTimer = null;

    const showSlide = (index) => {
        if (!slides || slides.length === 0) return;
        currentSlide = (index + slides.length) % slides.length;
        const slide = slides[currentSlide];

        if (newsImage) {
            newsImage.src = slide.image;
            newsImage.alt = slide.alt || slide.title || "Notícia da Prefeitura";
        }
        if (newsTitle) newsTitle.textContent = slide.title;
        if (newsSubtitle) newsSubtitle.textContent = slide.subtitle;

        adjustNewsLines(newsTitle, newsSubtitle, mainContainer);

        if (progressIndicator) {
            progressIndicator.style.width = `${100 / slides.length}%`;
            progressIndicator.style.left = `${(currentSlide * 100) / slides.length}%`;
        }

        if (dotsContainer) {
            const buttons = dotsContainer.querySelectorAll(".dot");
            buttons.forEach((btn, idx) => {
                const isActive = idx === currentSlide;
                btn.classList.toggle("active", isActive);
                btn.setAttribute("aria-pressed", String(isActive));
            });
        }
    };

    const renderDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = "";
        slides.forEach((_, idx) => {
            const btn = document.createElement("button");
            btn.className = `dot${idx === currentSlide ? " active" : ""}`;
            btn.type = "button";
            btn.setAttribute("aria-label", `Mostrar notícia ${idx + 1}`);
            btn.setAttribute("aria-pressed", String(idx === currentSlide));
            btn.addEventListener("click", () => {
                showSlide(idx);
                restartSlideTimer();
            });
            dotsContainer.appendChild(btn);
        });
    };

    const restartSlideTimer = () => {
        window.clearInterval(slideTimer);
        slideTimer = window.setInterval(() => {
            showSlide(currentSlide + 1);
        }, SLIDE_ROTATION_INTERVAL);
    };

    const setSlides = (newSlides) => {
        if (!Array.isArray(newSlides) || newSlides.length === 0) return;
        slides = newSlides;
        renderDots();
        showSlide(0);
        restartSlideTimer();
    };

    renderDots();
    showSlide(0);
    restartSlideTimer();

    window.addEventListener("resize", () => {
        adjustNewsLines(newsTitle, newsSubtitle, mainContainer);
    });

    return {
        showSlide,
        renderDots,
        restartSlideTimer,
        setSlides,
        adjustLines: () => adjustNewsLines(newsTitle, newsSubtitle, mainContainer),
        getSlides: () => slides
    };
};

// --- src/components/calls.js ---
// =============================================================
// Componente de Chamadas e Sincronização IDS Saúde (UniGUI)
// =============================================================


const initCalls = (elements, options = {}) => {
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

// --- src/core/panel.js ---
// =============================================================
// Núcleo do Painel Institucional (Ativação e Orquestração)
// =============================================================



let painelInitialized = false;

const activatePainelMode = async () => {
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

// --- src/core/stateObserver.js ---
// =============================================================
// Monitoramento do Ciclo de Vida (Login -> Painel)
// =============================================================

const initLoginCapture = () => {
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

const initLoginObserver = (onPanelReady) => {
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

// --- src/main.js ---
// =============================================================
// Main - Orquestrador Principal da Extensão (Projeto RBS)
// =============================================================


console.log("[Painel RBS] Módulos da extensão carregados com sucesso.");

// 1. Inicia a captura passiva da unidade selecionada na tela de login
initLoginCapture();

// 2. Monitora o estado de autenticação para ativar o painel assim que o login for concluído
initLoginObserver(activatePainelMode);

})();
