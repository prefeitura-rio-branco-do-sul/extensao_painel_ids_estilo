// =============================================================
// Configurações e Constantes Globais
// =============================================================

const getExtUrl = (file) => (typeof chrome !== "undefined" && chrome.runtime?.getURL ? chrome.runtime.getURL(file) : file);

export const LOGO_PREFEITURA = getExtUrl("assets/images/brasao-rio-branco.png");
export const LOGO_PREFEITURA_FALLBACK = getExtUrl("assets/images/brasao-rio-branco.png");
export const LOGO_IDS = getExtUrl("assets/images/logo-ids.png");
export const DEFAULT_IMG_FACHADA = getExtUrl("assets/images/fallback-1.jpeg");
export const DEFAULT_IMG_BEZERROS = getExtUrl("assets/images/fallback-2.jpeg");
export const CSS_URL = getExtUrl("assets/css/painel.css");
export const TEMPLATE_URL = getExtUrl("templates/panel.html");

export const RSS_URL = "https://api.rss2json.com/v1/api.json?rss_url=https://riobrancodosul.atende.net/cidadao/rss/noticias";

export const CALL_PRESENTATION_DURATION = 15000;
export const SLIDE_ROTATION_INTERVAL = 8000;
export const RSS_REFRESH_INTERVAL = 10 * 60 * 1000;
export const CALL_AGE_UPDATE_INTERVAL = 15000;
export const DOM_SYNC_INTERVAL = 1000;
export const MAX_CALL_HISTORY = 10;

export const INITIAL_SLIDES = [
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

export const FALLBACK_IMAGES = [DEFAULT_IMG_FACHADA, DEFAULT_IMG_BEZERROS];

export const RECENT_CALL_PAIRS = [
    { nameId: "O249_id", locId: "O251_id", minutesAgo: 2 },
    { nameId: "O265_id", locId: "O269_id", minutesAgo: 5 },
    { nameId: "O281_id", locId: "O285_id", minutesAgo: 8 }
];
