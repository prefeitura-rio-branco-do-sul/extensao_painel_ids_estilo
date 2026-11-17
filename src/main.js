// =============================================================
// Main - Orquestrador Principal da Extensão (Projeto RBS)
// =============================================================

import { initLoginCapture, initLoginObserver } from "./core/stateObserver.js";
import { activatePainelMode } from "./core/panel.js";

console.log("[Painel RBS] Módulos da extensão carregados com sucesso.");

// 1. Inicia a captura passiva da unidade selecionada na tela de login
initLoginCapture();

// 2. Monitora o estado de autenticação para ativar o painel assim que o login for concluído
initLoginObserver(activatePainelMode);
