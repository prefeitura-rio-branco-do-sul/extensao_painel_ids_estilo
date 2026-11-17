// =============================================================
// Componente de Carrossel de Notícias
// =============================================================

import { SLIDE_ROTATION_INTERVAL } from "../config/constants.js";

export const adjustNewsLines = (newsTitle, newsSubtitle, mainContainer) => {
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

export const initCarousel = (elements, initialSlides = []) => {
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
