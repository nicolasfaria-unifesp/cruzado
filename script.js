let listaDePalavrasOriginal = [];
let listaDePalavrasNormalizada = [];

// Estado da Partida
// 2: Cruzado, 3: Triades, 4: Quadras, 5: Cegueta, 6: Corrida, 7: Memória, 8: Inferno
// 9: Permuta, 10: Mutante, 11: Dungeon
let modoAtual = 2; 
let numPalavrasAlvo = 2;
let palavrasAtivas = [];
let cruzamentos = [];
let maxTentativas = 8;
let linhaAtual = 0;
let direcaoAtual = 'H';
let focoRow = 0;
let focoCol = 0;
const gridsDOM = [];

let historicoTentativas = []; // Guarda o histórico de jogadas

let tempoCorrida = 180; // Padrão 3 min (em segundos)
let timerInterval = null;
let tempoRestante = 0;

let statusTecladoPorPalavra = {};

// --- Variáveis dos Novos Modos ---
let mutacaoAtual = null;
let jogadorHp = 100;
let moedas = 0;
let ondaAtual = 1;
let modoDungeonIniciado = false;

function normalizarTexto(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ç/g, "c");
}

async function carregarDicionario() {
    try {
        const url = 'br-utf8.txt';
        const resposta = await fetch(url);
        
        if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);

        const texto = await resposta.text();
        const palavrasFiltradas = texto
            .split(/\r?\n/)
            .map(p => p.trim())
            .filter(p => p.length === 7);

        listaDePalavrasOriginal = palavrasFiltradas.map(p => p.toUpperCase());
        listaDePalavrasNormalizada = palavrasFiltradas.map(p => normalizarTexto(p));

        iniciarJogo(2);
    } 
    catch (erro) {
        console.error("Erro ao carregar o dicionário:", erro);
        alert("Erro ao carregar o dicionário. Verifique o servidor local.");
    }
}

function gerarCruzamentoValido(qtd) {
    palavrasAtivas = [];
    cruzamentos = [];

    if (qtd === 2) {
        while (true) {
            const idx1 = Math.floor(Math.random() * listaDePalavrasOriginal.length);
            const r1 = Math.floor(Math.random() * 5) + 1;
            const h1Norm = listaDePalavrasNormalizada[idx1];

            const colunasValidas = [];
            for (let c = 0; c < 7; c++) {
                const char = h1Norm[c];
                const candV = [];
                for (let i = 0; i < listaDePalavrasNormalizada.length; i++) {
                    if (i !== idx1 && listaDePalavrasNormalizada[i][r1] === char) {
                        candV.push(i);
                    }
                }
                if (candV.length > 0) colunasValidas.push({ col: c, candidatos: candV });
            }

            if (colunasValidas.length > 0) {
                const escolhaCol = colunasValidas[Math.floor(Math.random() * colunasValidas.length)];
                const idx2 = escolhaCol.candidatos[Math.floor(Math.random() * escolhaCol.candidatos.length)];
                const c1 = escolhaCol.col;

                palavrasAtivas.push({ id: 0, orien: 'H', fixedPos: r1, orig: listaDePalavrasOriginal[idx1], norm: h1Norm, derrotado: false });
                palavrasAtivas.push({ id: 1, orien: 'V', fixedPos: c1, orig: listaDePalavrasOriginal[idx2], norm: listaDePalavrasNormalizada[idx2], derrotado: false });
                cruzamentos.push({ row: r1, col: c1, palHIdx: 0, posH: c1, palVIdx: 1, posV: r1 });
                return;
            }
        }
    }

    if (qtd === 3) {
        for (let t = 0; t < 500; t++) {
            const r1 = Math.floor(Math.random() * 3) + 1;
            const r2 = Math.floor(Math.random() * 3) + 4;
            const c1 = Math.floor(Math.random() * 5) + 1;

            const idxH1 = Math.floor(Math.random() * listaDePalavrasOriginal.length);
            const h1Norm = listaDePalavrasNormalizada[idxH1];

            const candV1 = [];
            for (let i = 0; i < listaDePalavrasNormalizada.length; i++) {
                if (i !== idxH1 && listaDePalavrasNormalizada[i][r1] === h1Norm[c1]) candV1.push(i);
            }
            if (candV1.length === 0) continue;
            const idxV1 = candV1[Math.floor(Math.random() * candV1.length)];
            const v1Norm = listaDePalavrasNormalizada[idxV1];

            const candH2 = [];
            for (let i = 0; i < listaDePalavrasNormalizada.length; i++) {
                if (i !== idxH1 && i !== idxV1 && listaDePalavrasNormalizada[i][c1] === v1Norm[r2]) candH2.push(i);
            }
            if (candH2.length === 0) continue;
            const idxH2 = candH2[Math.floor(Math.random() * candH2.length)];
            const h2Norm = listaDePalavrasNormalizada[idxH2];

            palavrasAtivas.push({ id: 0, orien: 'H', fixedPos: r1, orig: listaDePalavrasOriginal[idxH1], norm: h1Norm, derrotado: false });
            palavrasAtivas.push({ id: 1, orien: 'V', fixedPos: c1, orig: listaDePalavrasOriginal[idxV1], norm: v1Norm, derrotado: false });
            palavrasAtivas.push({ id: 2, orien: 'H', fixedPos: r2, orig: listaDePalavrasOriginal[idxH2], norm: h2Norm, derrotado: false });
            return;
        }
    }

    if (qtd === 4) {
        for (let t = 0; t < 1000; t++) {
            const r1 = Math.floor(Math.random() * 2) + 1;
            const r2 = Math.floor(Math.random() * 2) + 4;
            const c1 = Math.floor(Math.random() * 2) + 1;
            const c2 = Math.floor(Math.random() * 2) + 4;

            const idxH1 = Math.floor(Math.random() * listaDePalavrasOriginal.length);
            const h1Norm = listaDePalavrasNormalizada[idxH1];

            const candV1 = [];
            for (let i = 0; i < listaDePalavrasNormalizada.length; i++) {
                if (i !== idxH1 && listaDePalavrasNormalizada[i][r1] === h1Norm[c1]) candV1.push(i);
            }
            if (candV1.length === 0) continue;
            const idxV1 = candV1[Math.floor(Math.random() * candV1.length)];
            const v1Norm = listaDePalavrasNormalizada[idxV1];

            const candH2 = [];
            for (let i = 0; i < listaDePalavrasNormalizada.length; i++) {
                if (i !== idxH1 && i !== idxV1 && listaDePalavrasNormalizada[i][c1] === v1Norm[r2]) candH2.push(i);
            }
            if (candH2.length === 0) continue;
            const idxH2 = candH2[Math.floor(Math.random() * candH2.length)];
            const h2Norm = listaDePalavrasNormalizada[idxH2];

            const candV2 = [];
            for (let i = 0; i < listaDePalavrasNormalizada.length; i++) {
                if (i !== idxH1 && i !== idxV1 && i !== idxH2 && 
                    listaDePalavrasNormalizada[i][r1] === h1Norm[c2] && 
                    listaDePalavrasNormalizada[i][r2] === h2Norm[c2]) {
                    candV2.push(i);
                }
            }
            if (candV2.length === 0) continue;
            const idxV2 = candV2[Math.floor(Math.random() * candV2.length)];
            const v2Norm = listaDePalavrasNormalizada[idxV2];

            palavrasAtivas.push({ id: 0, orien: 'H', fixedPos: r1, orig: listaDePalavrasOriginal[idxH1], norm: h1Norm, derrotado: false });
            palavrasAtivas.push({ id: 1, orien: 'V', fixedPos: c1, orig: listaDePalavrasOriginal[idxV1], norm: v1Norm, derrotado: false });
            palavrasAtivas.push({ id: 2, orien: 'H', fixedPos: r2, orig: listaDePalavrasOriginal[idxH2], norm: h2Norm, derrotado: false });
            palavrasAtivas.push({ id: 3, orien: 'V', fixedPos: c2, orig: listaDePalavrasOriginal[idxV2], norm: v2Norm, derrotado: false });
            return;
        }
        gerarCruzamentoValido(3);
    }
}

function iniciarTimer(segundos) {
    if (timerInterval) clearInterval(timerInterval);
    tempoRestante = segundos;
    atualizarDisplayTimer();

    timerInterval = setInterval(() => {
        tempoRestante--;
        atualizarDisplayTimer();
        if (tempoRestante <= 0) {
            clearInterval(timerInterval);
            tempoEsgotado();
        }
    }, 1000);
}

function atualizarDisplayTimer() {
    const timerEl = document.getElementById("timer-display");
    if (!timerEl) return;
    const min = Math.floor(tempoRestante / 60);
    const seg = tempoRestante % 60;
    timerEl.innerText = `⏱️ ${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

function tempoEsgotado() {
    linhaAtual = maxTentativas;
    let resumoPalavras = palavrasAtivas.map(p => `<p><strong>${p.orien === 'H' ? 'Horizontal' : 'Vertical'}:</strong> ${p.orig}</p>`).join("");
    exibirModal("Tempo Esgotado! ⏱️", `<p>O tempo acabou! As palavras eram:</p>${resumoPalavras}`, "Tentar Novamente", () => iniciarJogo(modoAtual));
}

function iniciarJogo(modo) {
    if (timerInterval) clearInterval(timerInterval);

    if (modo !== 11) modoDungeonIniciado = false;
    
    modoAtual = modo;
    numPalavrasAlvo = (modo === 3 || modo === 11) ? 3 : (modo === 4 ? 4 : 2);
    historicoTentativas = []; // Reset do histórico
    
    if (modo === 2 || modo === 9 || modo === 10) maxTentativas = 8;
    else if (modo === 3) maxTentativas = 10;
    else if (modo === 4) maxTentativas = 12;
    else if (modo === 5 || modo === 11) maxTentativas = Infinity;
    else if (modo === 6 || modo === 7 || modo === 8) maxTentativas = 10;

    const coresFundo = { 2: "#555", 3: "#555", 4: "#555", 5: "#181818", 6: "#1e3a5f", 7: "#3b1e4c", 8: "#451212", 9: "#355e3b", 10: "#5c4033", 11: "#202020" };
    document.body.style.backgroundColor = coresFundo[modo] || "#555555";

    linhaAtual = 0;
    direcaoAtual = 'H';
    statusTecladoPorPalavra = {};
    mutacaoAtual = null;

    if (modo === 11) {
        if (!modoDungeonIniciado) {
            jogadorHp = 100;
            moedas = 0;
            ondaAtual = 1;
            modoDungeonIniciado = true;
        }
        numPalavrasAlvo = ondaAtual <= 2 ? 2 : 3;
    }

    gerarCruzamentoValido(numPalavrasAlvo);

    if (modo === 10) gerarMutacao();

    const p1 = palavrasAtivas.find(p => p.orien === 'H') || palavrasAtivas[0];
    focoRow = p1.orien === 'H' ? p1.fixedPos : 0;
    focoCol = p1.orien === 'H' ? 0 : p1.fixedPos;

    renderizarUI();

    if (modo === 6) iniciarTimer(tempoCorrida);
    else if (modo === 8) iniciarTimer(180);
}

function gerarMutacao() {
    const mutacoes = [
        { id: 1, desc: "Proibido usar a letra A", check: (tent) => !tent.includes("a") },
        { id: 2, desc: "A palavra deve ter pelo menos 3 vogais", check: (tent) => (tent.match(/[aeiou]/g) || []).length >= 3 },
        { id: 3, desc: "Não pode terminar com S", check: (tent) => !tent.endsWith("s") }
    ];
    mutacaoAtual = mutacoes[Math.floor(Math.random() * mutacoes.length)];
}

function obterNomeModo(modo) {
    const nomes = { 2: "Cruzado", 3: "Tríades", 4: "Quadras", 5: "Cegueta", 6: "Corrida", 7: "Memória", 8: "Inferno", 9: "Permuta", 10: "Mutante", 11: "Dungeon" };
    return nomes[modo] || "";
}

function exibirModal(titulo, htmlConteudo, textoBotao = "Fechar", callback = null) {
    const modalExistente = document.getElementById("modal-customizado");
    if (modalExistente) modalExistente.remove();

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "modal-customizado";

    const conteudo = document.createElement("div");
    conteudo.className = "modal-conteudo";
    conteudo.innerHTML = `<h2>${titulo}</h2><div>${htmlConteudo}</div><button class="modal-btn" id="btn-fechar-modal">${textoBotao}</button>`;
    
    overlay.appendChild(conteudo);
    document.body.appendChild(overlay);

    document.getElementById("btn-fechar-modal").addEventListener("click", () => {
        overlay.remove();
        if (callback) callback();
    });
}

function celulaExiste(r, c) {
    if (r < 0 || r >= 7 || c < 0 || c >= 7) return false;
    return palavrasAtivas.some(p => ((p.orien === 'H' && p.fixedPos === r) || (p.orien === 'V' && p.fixedPos === c)) && !p.derrotado);
}

function avancarNaDirecao() {
    if (direcaoAtual === 'H') { if (celulaExiste(focoRow, focoCol + 1)) focoCol++; } 
    else { if (celulaExiste(focoRow + 1, focoCol)) focoRow++; }
}

function recuarNaDirecao() {
    if (direcaoAtual === 'H') { if (celulaExiste(focoRow, focoCol - 1)) focoCol--; } 
    else { if (celulaExiste(focoRow - 1, focoCol)) focoRow--; }
}

function processarEntrada(tecla) {
    if (linhaAtual >= maxTentativas || listaDePalavrasOriginal.length === 0) return;

    if (tecla === "ENTER") { verificarPalavras(); return; }

    if (tecla === "BACKSPACE") {
        const celula = obterCelulaAtual();
        if (celula && celula.innerText !== "") { celula.innerText = ""; } 
        else {
            recuarNaDirecao();
            const celulaAnterior = obterCelulaAtual();
            if (celulaAnterior) celulaAnterior.innerText = "";
        }
        atualizarFoco();
        return;
    }

    if (tecla === "ARROWRIGHT") { if (celulaExiste(focoRow, focoCol + 1)) { focoCol++; direcaoAtual = 'H'; atualizarFoco(); } return; }
    if (tecla === "ARROWLEFT") { if (celulaExiste(focoRow, focoCol - 1)) { focoCol--; direcaoAtual = 'H'; atualizarFoco(); } return; }
    if (tecla === "ARROWDOWN") { if (celulaExiste(focoRow + 1, focoCol)) { focoRow++; direcaoAtual = 'V'; atualizarFoco(); } return; }
    if (tecla === "ARROWUP") { if (celulaExiste(focoRow - 1, focoCol)) { focoRow--; direcaoAtual = 'V'; atualizarFoco(); } return; }

    if (/^[A-Z]$/.test(tecla)) {
        const celula = obterCelulaAtual();
        if (celula) {
            celula.innerText = tecla;
            avancarNaDirecao();
            atualizarFoco();
        }
    }
}

document.addEventListener("keydown", (evento) => processarEntrada(evento.key.toUpperCase()));

function criarGridBase(tentativa, ehMini, dadosHistorico = null) {
    const container = document.createElement("div");
    container.className = `tabuleiro-tentativa ${ehMini ? 'mini' : 'principal'}`;
    container.id = ehMini ? `tentativa-${tentativa}` : 'grid-principal';

    const celulas = [];
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            const caixa = document.createElement("div");
            const palsH = palavrasAtivas.filter(p => p.orien === 'H' && p.fixedPos === r && !p.derrotado);
            const palsV = palavrasAtivas.filter(p => p.orien === 'V' && p.fixedPos === c && !p.derrotado);
            
            if (palsH.length > 0 || palsV.length > 0) {
                caixa.className = "letra";
                caixa.dataset.row = r;
                caixa.dataset.col = c;
                
                if (ehMini && dadosHistorico) {
                    const celHist = dadosHistorico.find(d => d.r === r && d.c === c);
                    if (celHist) {
                        caixa.innerText = celHist.char;
                        caixa.classList.add(celHist.status);
                    }
                } else if (!ehMini) {
                    caixa.addEventListener("click", () => focarCelulaPorPos(r, c));
                }
                celulas.push(caixa);
            } else {
                caixa.className = "letra escondida";
            }
            container.appendChild(caixa);
        }
    }
    return { container, celulas };
}

function renderizarUI() {
    const tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.innerHTML = "";
    
    if (!document.getElementById("estilo-jogo")) {
        const estiloGrid = document.createElement('style');
        estiloGrid.id = "estilo-jogo";
        estiloGrid.innerHTML = `
            body, html { margin: 0; padding: 0; overflow-x: hidden; width: 100%; min-height: 100vh; transition: background-color 0.3s ease; }
            #tabuleiro { position: relative; display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding: 15px; width: 100%; min-height: 100vh; box-sizing: border-box; }
            .bar-menu { display: flex; justify-content: space-between; width: 100%; max-width: 800px; margin-bottom: 5px; }
            .modos-container { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
            .btn-modo { background: rgba(0,0,0,0.3); color: #aaa; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 6px 10px; cursor: pointer; font-size: 13px; }
            .btn-modo.ativo { background: #3aa394; color: #fff; border-color: #3aa394; }
            .painel-subsecao { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 4px; color: #fff; font-family: sans-serif; }
            #area-entrada { display: flex; flex-direction: column; align-items: center; justify-content: center; flex-grow: 1; padding: 10px 0; gap: 15px; }
            
            .tabuleiro-tentativa.principal { display: grid; grid-template-columns: repeat(7, min(6.5vh, 52px)); grid-template-rows: repeat(7, min(6.5vh, 52px)); gap: 6px; }
            .letra { width: 100%; height: 100%; color: #ccc; border: 2px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; cursor: pointer; text-transform: uppercase; border-radius: 6px; }
            .letra.escondida { border: none !important; background: transparent !important; cursor: default; }
            .letra.focada { border-color: #fff !important; border-bottom: 5px solid #3aa394 !important; background: rgba(255,255,255,0.25); }
            
            /* Status das Letras */
            .letra.correto { background-color: #3aa394 !important; color: #fff !important; border-color: #3aa394 !important; }
            .letra.presente { background-color: #d3ad69 !important; color: #fff !important; border-color: #d3ad69 !important; }
            .letra.ausente { background-color: #3a3a3c !important; color: #aaa !important; border-color: #3a3a3c !important; }

            /* Painel do Histórico */
            #historico-container { display: flex; gap: 10px; overflow-x: auto; max-width: 90vw; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px; }
            .tabuleiro-tentativa.mini { display: grid; grid-template-columns: repeat(7, 20px); grid-template-rows: repeat(7, 20px); gap: 2px; }
            .tabuleiro-tentativa.mini .letra { font-size: 11px; border-width: 1px; border-radius: 3px; cursor: default; }

            .dungeon-status { background: #222; border: 2px solid #8B0000; padding: 10px; border-radius: 8px; font-weight: bold; }
            .rack-permuta { background: #d3ad69; color: #000; padding: 10px 20px; font-size: 20px; font-weight: bold; border-radius: 8px; letter-spacing: 3px;}
            
            #teclado { display: flex; flex-direction: column; gap: 6px; align-items: center; margin-bottom: 10px; width: 100%; max-width: 680px; }
            .linha-teclado { display: flex; gap: 6px; width: 100%; justify-content: center; }
            .tecla { height: min(7vh, 50px); min-width: 35px; flex: 1; background-color: rgba(0,0,0,0.35); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            .tecla.correto { background-color: #3aa394 !important; }
            .tecla.presente { background-color: #d3ad69 !important; }
            .tecla.ausente { background-color: #222 !important; color: #666 !important; }
            
            .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 1000;}
            .modal-conteudo { background: #222; color: #fff; padding: 25px; border-radius: 8px; max-width: 500px; text-align: center; }
            .modal-btn { margin-top: 15px; padding: 10px 20px; background-color: #3aa394; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; }
        `;
        document.head.appendChild(estiloGrid);
    }

    const topContainer = document.createElement("div");
    topContainer.style.display = "flex"; topContainer.style.flexDirection = "column"; topContainer.style.alignItems = "center"; topContainer.style.width = "100%";
    
    // Bar Menu - TODOS OS MODOS INCLUÍDOS
    const barMenu = document.createElement("div"); barMenu.className = "bar-menu";
    const modosContainer = document.createElement("div"); modosContainer.className = "modos-container";
    const modosInfo = [
        {key: 2, label:"Cruz"}, {key: 3, label:"Tria"}, {key: 4, label:"Quad"},
        {key: 5, label:"Cegu"}, {key: 6, label:"Corr"}, {key: 7, label:"Memó"},
        {key: 8, label:"Infe"}, {key: 9, label:"Perm"}, {key: 10, label:"Muta"}, {key: 11, label:"Dung"}
    ];
    modosInfo.forEach(m => {
        const btn = document.createElement("button"); btn.className = `btn-modo ${modoAtual === m.key ? 'ativo' : ''}`;
        btn.innerText = m.label; btn.onclick = () => iniciarJogo(m.key);
        modosContainer.appendChild(btn);
    });
    barMenu.appendChild(modosContainer);
    topContainer.appendChild(barMenu);

    // Painel Subseção
    const painelSubsecao = document.createElement("div"); painelSubsecao.className = "painel-subsecao";
    const tituloModo = document.createElement("div");
    tituloModo.style.fontSize = "22px"; tituloModo.style.fontWeight = "bold";
    tituloModo.innerText = modoAtual === 10 ? `Mutante: ${mutacaoAtual.desc}` : obterNomeModo(modoAtual);
    painelSubsecao.appendChild(tituloModo);

    if (modoAtual === 6 || modoAtual === 8) {
        const timerDisp = document.createElement("div");
        timerDisp.id = "timer-display"; timerDisp.style.fontSize = "20px";
        painelSubsecao.appendChild(timerDisp);
    }

    if (modoAtual === 9) {
        let todasAsLetras = [];
        palavrasAtivas.forEach(p => todasAsLetras.push(...p.norm.toUpperCase().split("")));
        todasAsLetras.sort(() => Math.random() - 0.5);
        const rack = document.createElement("div"); rack.className = "rack-permuta";
        rack.innerText = `🔀 Anagrama: ${todasAsLetras.join(" - ")}`;
        painelSubsecao.appendChild(rack);
    }
    if (modoAtual === 11) {
        const hud = document.createElement("div"); hud.className = "dungeon-status";
        hud.id = "hud-dungeon";
        hud.innerHTML = `🛡️ HP: ${jogadorHp} | 💰 Ouro: ${moedas} | 🌊 Onda: ${ondaAtual}`;
        painelSubsecao.appendChild(hud);
    }

    topContainer.appendChild(painelSubsecao);
    tabuleiro.appendChild(topContainer);

    const areaEntrada = document.createElement("div"); areaEntrada.id = "area-entrada";
    
    // Tabuleiro Principal
    const gridPrincipal = criarGridBase(0, false);
    areaEntrada.appendChild(gridPrincipal.container);
    gridsDOM.length = 0; gridsDOM.push(gridPrincipal.celulas);

    // Histórico de Tentativas (Mini Tabuleiros)
    if (historicoTentativas.length > 0) {
        const historicoContainer = document.createElement("div");
        historicoContainer.id = "historico-container";
        historicoTentativas.forEach((hist, index) => {
            const miniGrid = criarGridBase(index + 1, true, hist);
            historicoContainer.appendChild(miniGrid.container);
        });
        areaEntrada.appendChild(historicoContainer);
    }

    tabuleiro.appendChild(areaEntrada);
    
    // Teclado
    const teclado = document.createElement("div"); teclado.id = "teclado";
    const layout = [ ["Q","W","E","R","T","Y","U","I","O","P"], ["A","S","D","F","G","H","J","K","L"], ["ENTER","Z","X","C","V","B","N","M","BACKSPACE"] ];
    layout.forEach(linha => {
        const linhaDiv = document.createElement("div"); linhaDiv.className = "linha-teclado";
        linha.forEach(tecla => {
            const b = document.createElement("button"); b.className = "tecla"; b.innerText = tecla === "BACKSPACE" ? "⌫" : (tecla === "ENTER" ? "ENT" : tecla);
            b.onclick = () => processarEntrada(tecla); linhaDiv.appendChild(b);
        });
        teclado.appendChild(linhaDiv);
    });
    tabuleiro.appendChild(teclado);

    atualizarFoco();
}

function focarCelulaPorPos(r, c) {
    if (linhaAtual >= maxTentativas) return;
    focoRow = r; focoCol = c;
    const temH = palavrasAtivas.some(p => p.orien === 'H' && p.fixedPos === r && !p.derrotado);
    const temV = palavrasAtivas.some(p => p.orien === 'V' && p.fixedPos === c && !p.derrotado);
    if (temH && !temV) direcaoAtual = 'H';
    else if (temV && !temH) direcaoAtual = 'V';
    atualizarFoco();
}

function atualizarFoco() {
    if (linhaAtual >= maxTentativas) return;
    gridsDOM[0].forEach(c => c.classList.remove("focada"));
    const celulaAtual = obterCelulaAtual();
    if (celulaAtual) celulaAtual.classList.add("focada");
}

function obterCelulaAtual() {
    return gridsDOM[0].find(c => parseInt(c.dataset.row) === focoRow && parseInt(c.dataset.col) === focoCol);
}

function verificarPalavras() {
    const celulasAtuais = gridsDOM[0];
    const tentativasPorPalavra = [];

    for (let p of palavrasAtivas.filter(p => !p.derrotado)) {
        let tentNorm = "";
        for (let i = 0; i < 7; i++) {
            let c = p.orien === 'H' 
                ? celulasAtuais.find(cel => parseInt(cel.dataset.row) === p.fixedPos && parseInt(cel.dataset.col) === i)
                : celulasAtuais.find(cel => parseInt(cel.dataset.col) === p.fixedPos && parseInt(cel.dataset.row) === i);

            if (!c || !c.innerText) { alert("Preencha as letras!"); return; }
            tentNorm += c.innerText;
        }

        tentNorm = normalizarTexto(tentNorm);
        
        if (modoAtual === 10 && mutacaoAtual && !mutacaoAtual.check(tentNorm)) {
            alert(`Violação: ${mutacaoAtual.desc}`);
            return;
        }

        if (listaDePalavrasNormalizada.indexOf(tentNorm) === -1) {
            alert(`A palavra "${tentNorm.toUpperCase()}" não existe no dicionário!`);
            return;
        }
        tentativasPorPalavra.push({ palavraObj: p, tentNorm: tentNorm });
    }

    // Gerar Feedback Visual (Cores Verde, Amarelo e Cinza)
    const estadoGridAtual = [];
    celulasAtuais.forEach(cel => {
        const r = parseInt(cel.dataset.row);
        const c = parseInt(cel.dataset.col);
        const char = cel.innerText;
        if (!char) return;

        let status = 'ausente';
        const normChar = normalizarTexto(char);

        for (let p of palavrasAtivas.filter(p => !p.derrotado)) {
            if (p.orien === 'H' && p.fixedPos === r) {
                if (p.norm[c] === normChar) status = 'correto';
                else if (status !== 'correto' && p.norm.includes(normChar)) status = 'presente';
            } else if (p.orien === 'V' && p.fixedPos === c) {
                if (p.norm[r] === normChar) status = 'correto';
                else if (status !== 'correto' && p.norm.includes(normChar)) status = 'presente';
            }
        }

        estadoGridAtual.push({ r, c, char, status });

        // Atualizar Teclado Virtual
        const btnsTecla = Array.from(document.querySelectorAll('.tecla')).filter(b => b.innerText === char);
        btnsTecla.forEach(btn => {
            if (status === 'correto') {
                btn.classList.remove('presente', 'ausente');
                btn.classList.add('correto');
            } else if (status === 'presente' && !btn.classList.contains('correto')) {
                btn.classList.remove('ausente');
                btn.classList.add('presente');
            } else if (status === 'ausente' && !btn.classList.contains('correto') && !btn.classList.contains('presente')) {
                btn.classList.add('ausente');
            }
        });
    });

    historicoTentativas.push(estadoGridAtual);

    const todosCertos = tentativasPorPalavra.every(r => r.tentNorm === r.palavraObj.norm);
    
    if (modoAtual === 11) {
        let inimigosVivos = 0;
        
        tentativasPorPalavra.forEach(res => {
            if (res.tentNorm === res.palavraObj.norm) {
                res.palavraObj.derrotado = true;
            } else {
                inimigosVivos++;
            }
        });

        if (inimigosVivos > 0) {
            const dano = inimigosVivos * 10;
            jogadorHp -= dano;
            document.getElementById("hud-dungeon").innerHTML = `🛡️ HP: ${jogadorHp} | 💰 Ouro: ${moedas} | 🌊 Onda: ${ondaAtual}`;
            
            if (jogadorHp <= 0) {
                exibirModal("Game Over 💀", "<p>Sua vida chegou a zero.</p>", "Reiniciar RPG", () => iniciarJogo(11));
                return;
            } else {
                alert(`Errado! Você tomou ${dano} de dano dos monstros.`);
            }
        } 
        
        const ondaCompleta = palavrasAtivas.every(p => p.derrotado);
        if (ondaCompleta) {
            moedas += (ondaAtual * 20);
            abrirLojaDungeon();
            return;
        }

        renderizarUI();
        linhaAtual++;
        return; 
    }
    
    if (todosCertos) {
        exibirModal("Você Venceu! 🎉", "<p>Parabéns!</p>", "Jogar Novamente", () => iniciarJogo(modoAtual));
    } else {
        linhaAtual++;
        if (linhaAtual >= maxTentativas) {
            exibirModal("Fim de Jogo ❌", "<p>Tentativas esgotadas.</p>", "Tentar Novamente", () => iniciarJogo(modoAtual));
        } else {
            renderizarUI();
        }
    }
}

function abrirLojaDungeon() {
    exibirModal("Loja do Mercador 🛒", `
        <p>Você completou a onda ${ondaAtual}!</p>
        <p><strong>Ouro Atual: $${moedas}</strong> | <strong>HP Atual: ${jogadorHp}</strong></p>
        <br>
        <button class="modal-btn" onclick="comprarItem(20, 30)" style="margin: 5px;">Poção Padrão (+30 HP) : $20</button>
        <button class="modal-btn" onclick="comprarItem(40, 70)" style="margin: 5px;">Poção Grande (+70 HP) : $40</button>
    `, "Próxima Onda ⚔️", () => {
        ondaAtual++;
        iniciarJogo(11);
    });
}

window.comprarItem = function(custo, cura) {
    if (moedas >= custo) {
        moedas -= custo;
        jogadorHp = Math.min(100, jogadorHp + cura);
        alert(`Comprado! Seu HP agora é ${jogadorHp}. Ouro restante: $${moedas}`);
        document.getElementById("modal-customizado").remove();
        abrirLojaDungeon();
    } else {
        alert("Ouro insuficiente!");
    }
}

carregarDicionario();