// =============================================================
// Serviço de Notícias RSS
// =============================================================

import { cleanHtmlText } from "../utils/formatters.js";

export const fetchRssNews = async (rssUrl, fallbackImages) => {
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
