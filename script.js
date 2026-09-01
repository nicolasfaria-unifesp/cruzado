let listaDePalavrasOriginal = [];
let listaDePalavrasNormalizada = [];

// Estado da Partida
let numPalavrasAlvo = 2;
let palavrasAtivas = [];
let cruzamentos = [];
let maxTentativas = 8;
let linhaAtual = 0;
let direcaoAtual = 'H'; // 'H' ou 'V'
let focoRow = 0;
let focoCol = 0;
const gridsDOM = [];

let statusTecladoPorPalavra = {};

function normalizarTexto(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ç/g, "c");
}

async function carregarDicionario() {
    try {
        const url = 'br-utf8.txt';
        const resposta = await fetch(url);
        
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

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
        alert("Erro ao carregar o dicionário. Se estiver executando localmente, abra o HTML utilizando um servidor local (ex: Live Server).");
    }
}

function gerarCruzamentoValido(qtd) {
    let sucesso = false;
    let tentativasGerais = 0;

    while (!sucesso && tentativasGerais < 1000) {
        tentativasGerais++;
        palavrasAtivas = [];
        cruzamentos = [];

        const idx1 = Math.floor(Math.random() * listaDePalavrasOriginal.length);
        const row1 = Math.floor(Math.random() * 5) + 1;
        palavrasAtivas.push({
            id: 0,
            orien: 'H',
            fixedPos: row1,
            orig: listaDePalavrasOriginal[idx1],
            norm: listaDePalavrasNormalizada[idx1]
        });

        let p2Valida = false;
        for (let t = 0; t < 100; t++) {
            const idx2 = Math.floor(Math.random() * listaDePalavrasOriginal.length);
            if (idx2 === idx1) continue;

            const cand2Norm = listaDePalavrasNormalizada[idx2];
            const colsPossiveis = [];

            for (let c = 0; c < 7; c++) {
                if (palavrasAtivas[0].norm[c] === cand2Norm[row1]) {
                    colsPossiveis.push(c);
                }
            }

            if (colsPossiveis.length > 0) {
                const colEscolhida = colsPossiveis[Math.floor(Math.random() * colsPossiveis.length)];
                palavrasAtivas.push({
                    id: 1,
                    orien: 'V',
                    fixedPos: colEscolhida,
                    orig: listaDePalavrasOriginal[idx2],
                    norm: cand2Norm
                });

                cruzamentos.push({
                    row: row1,
                    col: colEscolhida,
                    palHIdx: 0,
                    posH: colEscolhida,
                    palVIdx: 1,
                    posV: row1
                });

                p2Valida = true;
                break;
            }
        }

        if (!p2Valida) continue;
        if (qtd === 2) { sucesso = true; break; }

        let palavrasEncaixadas = 2;

        for (let pExtra = 2; pExtra < qtd; pExtra++) {
            let encaixou = false;
            const tentarOrien = (pExtra % 2 === 0) ? 'H' : 'V';

            for (let t = 0; t < 200; t++) {
                const idxN = Math.floor(Math.random() * listaDePalavrasOriginal.length);
                if (palavrasAtivas.some(p => p.orig === listaDePalavrasOriginal[idxN])) continue;

                const candNorm = listaDePalavrasNormalizada[idxN];

                if (tentarOrien === 'H') {
                    const vWords = palavrasAtivas.filter(p => p.orien === 'V');
                    const rowsPossiveis = [];

                    for (let r = 0; r < 7; r++) {
                        if (palavrasAtivas.some(p => p.orien === 'H' && p.fixedPos === r)) continue;

                        let compativel = true;
                        let cruzouComPeloMenosUm = false;

                        for (let v of vWords) {
                            if (candNorm[v.fixedPos] === v.norm[r]) {
                                cruzouComPeloMenosUm = true;
                            } else {
                                compativel = false;
                                break;
                            }
                        }

                        if (compativel && cruzouComPeloMenosUm) {
                            rowsPossiveis.push(r);
                        }
                    }

                    if (rowsPossiveis.length > 0) {
                        const rEscolhida = rowsPossiveis[Math.floor(Math.random() * rowsPossiveis.length)];
                        palavrasAtivas.push({
                            id: pExtra,
                            orien: 'H',
                            fixedPos: rEscolhida,
                            orig: listaDePalavrasOriginal[idxN],
                            norm: candNorm
                        });

                        vWords.forEach(v => {
                            cruzamentos.push({
                                row: rEscolhida,
                                col: v.fixedPos,
                                palHIdx: pExtra,
                                posH: v.fixedPos,
                                palVIdx: v.id,
                                posV: rEscolhida
                            });
                        });

                        encaixou = true;
                        palavrasEncaixadas++;
                        break;
                    }
                } else {
                    const hWords = palavrasAtivas.filter(p => p.orien === 'H');
                    const colsPossiveis = [];

                    for (let c = 0; c < 7; c++) {
                        if (palavrasAtivas.some(p => p.orien === 'V' && p.fixedPos === c)) continue;

                        let compativel = true;
                        let cruzouComPeloMenosUm = false;

                        for (let h of hWords) {
                            if (candNorm[h.fixedPos] === h.norm[c]) {
                                cruzouComPeloMenosUm = true;
                            } else {
                                compativel = false;
                                break;
                            }
                        }

                        if (compativel && cruzouComPeloMenosUm) {
                            colsPossiveis.push(c);
                        }
                    }

                    if (colsPossiveis.length > 0) {
                        const cEscolhida = colsPossiveis[Math.floor(Math.random() * colsPossiveis.length)];
                        palavrasAtivas.push({
                            id: pExtra,
                            orien: 'V',
                            fixedPos: cEscolhida,
                            orig: listaDePalavrasOriginal[idxN],
                            norm: candNorm
                        });

                        hWords.forEach(h => {
                            cruzamentos.push({
                                row: h.fixedPos,
                                col: cEscolhida,
                                palHIdx: h.id,
                                posH: cEscolhida,
                                palVIdx: pExtra,
                                posV: h.fixedPos
                            });
                        });

                        encaixou = true;
                        palavrasEncaixadas++;
                        break;
                    }
                }
            }
            if (encaixou) break;
        }

        if (palavrasEncaixadas === qtd) {
            sucesso = true;
        }
    }

    if (!sucesso) {
        gerarCruzamentoValido(qtd);
    }
}

function iniciarJogo(modo) {
    numPalavrasAlvo = modo;
    
    if (modo === 2) maxTentativas = 8;
    else if (modo === 3) maxTentativas = 10;
    else if (modo === 4) maxTentativas = 12;

    linhaAtual = 0;
    direcaoAtual = 'H';
    statusTecladoPorPalavra = {};

    gerarCruzamentoValido(numPalavrasAlvo);

    const p1 = palavrasAtivas.find(p => p.orien === 'H') || palavrasAtivas[0];
    if (p1.orien === 'H') {
        focoRow = p1.fixedPos;
        focoCol = 0;
    } else {
        focoRow = 0;
        focoCol = p1.fixedPos;
    }

    const tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.innerHTML = "";

    const estiloGrid = document.createElement('style');
    estiloGrid.id = "estilo-jogo";
    
    const antigoEstilo = document.getElementById("estilo-jogo");
    if (antigoEstilo) antigoEstilo.remove();

    estiloGrid.innerHTML = `
        body, html {
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
        }

        #tabuleiro {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            width: 100%;
            height: 100vh;
            max-width: 1400px;
            margin: 0 auto;
            box-sizing: border-box;
            overflow: hidden;
        }

        .bar-menu {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            max-width: 450px;
            margin-bottom: 2px;
            flex-shrink: 0;
        }

        .titulo-modo {
            color: #fff;
            font-size: 22px;
            font-weight: bold;
            margin: 2px 0;
            text-align: center;
            font-family: sans-serif;
            flex-shrink: 0;
        }

        .modos-container {
            display: flex;
            gap: 8px;
        }

        .btn-modo {
            background: #333;
            color: #aaa;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 5px 12px;
            font-weight: bold;
            font-size: 13px;
            cursor: pointer;
        }

        .btn-modo.ativo {
            background: #3aa394;
            color: #fff;
            border-color: #3aa394;
        }

        .btn-ajuda {
            background: #4a4a4a;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
        }

        .historico-tentativas {
            position: absolute;
            left: 5px;
            top: 50%;
            transform: translateY(-50%);
            display: grid;
            grid-template-columns: repeat(2, auto);
            gap: 4px 8px;
            max-height: 90vh;
            overflow: hidden;
            width: fit-content;
        }

        .historico-tentativas::-webkit-scrollbar {
            display: none;
        }
        
        .historico-tentativas {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        #area-entrada {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            min-height: 0;
            padding: 5px 0;
        }

        .tabuleiro-tentativa {
            display: grid;
            grid-template-columns: repeat(7, min(5vh, 42px));
            grid-template-rows: repeat(7, min(5vh, 42px));
            gap: 4px;
        }

        .tabuleiro-tentativa.mini {
            grid-template-columns: repeat(7, 12px);
            grid-template-rows: repeat(7, 12px);
            gap: 2px;
            width: fit-content;
        }

        .letra {
            width: 100%;
            height: 100%;
            color: #ccc;
            border: 2px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: min(3vh, 20px);
            font-weight: bold;
            cursor: pointer;
            text-transform: uppercase;
            background: #676767;
            user-select: none;
            box-sizing: border-box;
            border-radius: 4px;
        }

        .mini .letra {
            font-size: 7px;
            border-width: 1px;
            border-radius: 1px;
        }

        .letra.escondida {
            border: none !important;
            background: transparent !important;
            cursor: default;
        }

        .letra.focada {
            border-color: #fff !important;
            border-bottom: 4px solid #3aa394 !important;
            background: #7a7a7a;
        }

        .correta { background-color: #3aa394 !important; color: white; border-color: #3aa394; }
        .lugar-errado { background-color: #d3ad69 !important; color: white; border-color: #d3ad69; }
        .errada { background-color: #312a2c !important; color: white; border-color: #312a2c; }
        .cruzamento-duplo { background-color: #9c27b0 !important; color: white; border-color: #9c27b0; }

        #teclado {
            display: flex;
            flex-direction: column;
            gap: 4px;
            align-items: center;
            margin-bottom: 2px;
            user-select: none;
            width: 100%;
            max-width: 480px;
            flex-shrink: 0;
        }

        .linha-teclado {
            display: flex;
            gap: 4px;
            width: 100%;
            justify-content: center;
        }

        .tecla {
            height: min(6vh, 42px);
            min-width: 28px;
            flex: 1;
            padding: 0 2px;
            background-color: #4a4a4a;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s ease;
        }

        .tecla:hover { opacity: 0.9; }
        .tecla:active { transform: scale(0.96); }

        .tecla.especial {
            flex: 1.5;
            font-size: 11px;
            background-color: #5d5d5d;
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-conteudo {
            background: #222;
            color: #fff;
            padding: 25px;
            border-radius: 8px;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            font-family: sans-serif;
            text-align: center;
        }

        .modal-conteudo h2 {
            margin-top: 0;
            color: #3aa394;
        }

        .modal-conteudo p, .modal-conteudo ul {
            text-align: left;
            font-size: 14px;
            line-height: 1.5;
            color: #ddd;
        }

        .modal-conteudo ul {
            padding-left: 20px;
        }

        .modal-btn {
            margin-top: 15px;
            padding: 10px 20px;
            background-color: #3aa394;
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            font-size: 15px;
        }

        @media (max-width: 850px) {
            #tabuleiro { padding: 5px; height: auto; overflow: visible; }

            .historico-tentativas {
                position: relative;
                left: 0;
                top: 0;
                transform: none;
                display: flex;
                flex-direction: row;
                overflow-x: auto;
                width: 100%;
                justify-content: flex-start;
                padding-bottom: 8px;
                margin-bottom: 10px;
                max-height: none;
            }

            .historico-tentativas::-webkit-scrollbar {
                display: block;
                height: 4px;
            }

            .tabuleiro-tentativa.principal {
                grid-template-columns: repeat(7, 10vw);
                grid-template-rows: repeat(7, 10vw);
                max-width: 360px;
                max-height: 360px;
                gap: 4px;
            }

            .letra { font-size: 18px; }
            .linha-teclado { gap: 4px; }
            .tecla { height: 44px; font-size: 13px; }
        }
    `;
    document.head.appendChild(estiloGrid);

    criarTabuleiro();
}

function obterNomeModo(modo) {
    if (modo === 2) return "Cruzado";
    if (modo === 3) return "Trisais";
    if (modo === 4) return "Quadras";
    return "";
}

function exibirModal(titulo, htmlConteudo, textoBotao = "Fechar", callback = null) {
    const modalExistente = document.getElementById("modal-customizado");
    if (modalExistente) modalExistente.remove();

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "modal-customizado";

    const conteudo = document.createElement("div");
    conteudo.className = "modal-conteudo";

    conteudo.innerHTML = `
        <h2>${titulo}</h2>
        <div>${htmlConteudo}</div>
        <button class="modal-btn" id="btn-fechar-modal">${textoBotao}</button>
    `;

    overlay.appendChild(conteudo);
    document.body.appendChild(overlay);

    document.getElementById("btn-fechar-modal").addEventListener("click", () => {
        overlay.remove();
        if (callback) callback();
    });
}

function exibirModalComoJogar() {
    const regras = `
        <p>Descubra as palavras cruzadas antes que suas tentativas acabem!</p>
        <ul>
            <li><strong>Cruzado (2 palavras):</strong> 8 tentativas</li>
            <li><strong>Trisais (3 palavras):</strong> 10 tentativas</li>
            <li><strong>Quadras (4 palavras):</strong> 12 tentativas</li>
        </ul>
        <hr style="border-color: #444; margin: 10px 0;">
        <ul>
            <li><strong>Verde:</strong> Letra na posição correta.</li>
            <li><strong>Amarelo:</strong> Letra pertence à palavra, mas em outra posição.</li>
            <li><strong>Roxo:</strong> Em cruzamentos! Indica que a letra pertence às <u>duas palavras</u>, mas fora do lugar em ambas.</li>
            <li><strong>Cinza:</strong> Letra não pertence à palavra.</li>
            <li><strong>Teclado Fatiado:</strong> O fundo das teclas se divide proporcionalmente de acordo com a quantidade de palavras ativas.</li>
        </ul>
    `;
    exibirModal("Como Jogar", regras, "Entendi");
}

function celulaExiste(r, c) {
    if (r < 0 || r >= 7 || c < 0 || c >= 7) return false;
    const ehH = palavrasAtivas.some(p => p.orien === 'H' && p.fixedPos === r);
    const ehV = palavrasAtivas.some(p => p.orien === 'V' && p.fixedPos === c);
    return ehH || ehV;
}

function avancarNaDirecao() {
    if (direcaoAtual === 'H') {
        if (celulaExiste(focoRow, focoCol + 1)) {
            focoCol++;
        }
    } else {
        if (celulaExiste(focoRow + 1, focoCol)) {
            focoRow++;
        }
    }
}

function recuarNaDirecao() {
    if (direcaoAtual === 'H') {
        if (celulaExiste(focoRow, focoCol - 1)) {
            focoCol--;
        }
    } else {
        if (celulaExiste(focoRow - 1, focoCol)) {
            focoRow--;
        }
    }
}

function processarEntrada(tecla) {
    if (linhaAtual >= maxTentativas || listaDePalavrasOriginal.length === 0) return;

    if (tecla === "ENTER") {
        verificarPalavras();
        return;
    }

    if (tecla === "BACKSPACE") {
        const celula = obterCelulaAtual();
        if (celula && celula.innerText !== "") {
            celula.innerText = "";
        } else {
            recuarNaDirecao();
            const celulaAnterior = obterCelulaAtual();
            if (celulaAnterior) celulaAnterior.innerText = "";
        }
        atualizarFoco();
        return;
    }

    if (tecla === "ARROWRIGHT") {
        if (celulaExiste(focoRow, focoCol + 1)) {
            focoCol++;
            direcaoAtual = 'H';
            atualizarFoco();
        }
        return;
    }

    if (tecla === "ARROWLEFT") {
        if (celulaExiste(focoRow, focoCol - 1)) {
            focoCol--;
            direcaoAtual = 'H';
            atualizarFoco();
        }
        return;
    }

    if (tecla === "ARROWDOWN") {
        if (celulaExiste(focoRow + 1, focoCol)) {
            focoRow++;
            direcaoAtual = 'V';
            atualizarFoco();
        }
        return;
    }

    if (tecla === "ARROWUP") {
        if (celulaExiste(focoRow - 1, focoCol)) {
            focoRow--;
            direcaoAtual = 'V';
            atualizarFoco();
        }
        return;
    }

    if (/^[A-Z]$/.test(tecla)) {
        const celula = obterCelulaAtual();
        if (celula) {
            celula.innerText = tecla;
            avancarNaDirecao();
            atualizarFoco();
        }
    }
}

document.addEventListener("keydown", (evento) => {
    processarEntrada(evento.key.toUpperCase());
});

function criarGridBase(tentativa, ehMini) {
    const container = document.createElement("div");
    container.className = `tabuleiro-tentativa ${ehMini ? 'mini' : 'principal'}`;
    container.id = ehMini ? `tentativa-${tentativa}` : 'grid-principal';

    const celulas = [];

    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            const caixa = document.createElement("div");
            
            const palsH = palavrasAtivas.filter(p => p.orien === 'H' && p.fixedPos === r);
            const palsV = palavrasAtivas.filter(p => p.orien === 'V' && p.fixedPos === c);

            const ehH = palsH.length > 0;
            const ehV = palsV.length > 0;

            if (ehH || ehV) {
                caixa.className = "letra";
                caixa.dataset.row = r;
                caixa.dataset.col = c;

                if (ehH && ehV) {
                    caixa.dataset.tipo = "intersecao";
                } else if (ehH) {
                    caixa.dataset.tipo = "horizontal";
                } else {
                    caixa.dataset.tipo = "vertical";
                }

                if (!ehMini) {
                    caixa.addEventListener("click", () => focarCelulaPorPos(r, c));
                }
            } else {
                caixa.className = "letra escondida";
            }
            
            container.appendChild(caixa);
            if (ehH || ehV) celulas.push(caixa);
        }
    }

    return { container, celulas };
}

function criarTecladoVirtual() {
    const tecladoContainer = document.createElement("div");
    tecladoContainer.id = "teclado";

    const layout = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"]
    ];

    layout.forEach(linha => {
        const linhaDiv = document.createElement("div");
        linhaDiv.className = "linha-teclado";

        linha.forEach(tecla => {
            const botao = document.createElement("button");
            botao.className = "tecla";
            
            if (tecla === "ENTER") {
                botao.innerText = "ENTER";
                botao.classList.add("especial");
            } else if (tecla === "BACKSPACE") {
                botao.innerText = "⌫";
                botao.classList.add("especial");
            } else {
                botao.innerText = tecla;
            }

            botao.dataset.key = tecla;
            botao.addEventListener("mousedown", (e) => e.preventDefault());
            botao.addEventListener("click", () => processarEntrada(tecla));

            linhaDiv.appendChild(botao);
        });

        tecladoContainer.appendChild(linhaDiv);
    });

    return tecladoContainer;
}

function atualizarStatusTecladoGradiente(letra, idxPalavra, novoStatus) {
    const letraNorm = normalizarTexto(letra).toUpperCase();
    const botao = document.querySelector(`.tecla[data-key="${letraNorm}"]`);
    if (!botao) return;

    if (!statusTecladoPorPalavra[letraNorm]) {
        statusTecladoPorPalavra[letraNorm] = Array(numPalavrasAlvo).fill("pendente");
    }

    const prioridades = { "correta": 4, "lugar-errado": 3, "errada": 2, "pendente": 1 };
    const statusAtual = statusTecladoPorPalavra[letraNorm][idxPalavra];

    if (prioridades[novoStatus] > prioridades[statusAtual]) {
        statusTecladoPorPalavra[letraNorm][idxPalavra] = novoStatus;
    }

    const paletaCores = {
        "correta": "#3aa394",
        "lugar-errado": "#d3ad69",
        "errada": "#312a2c",
        "pendente": "#4a4a4a"
    };

    const statusArray = statusTecladoPorPalavra[letraNorm];
    const pctStep = 100 / numPalavrasAlvo;
    const gradientStops = [];

    for (let i = 0; i < numPalavrasAlvo; i++) {
        const cor = paletaCores[statusArray[i]] || "#4a4a4a";
        const start = i * pctStep;
        const end = (i + 1) * pctStep;
        gradientStops.push(`${cor} ${start}% ${end}%`);
    }

    botao.style.background = `linear-gradient(to right, ${gradientStops.join(", ")})`;
}

function criarTabuleiro() {
    const tabuleiro = document.getElementById("tabuleiro");
    
    const topContainer = document.createElement("div");
    topContainer.style.display = "flex";
    topContainer.style.flexDirection = "column";
    topContainer.style.alignItems = "center";
    topContainer.style.width = "100%";

    const barMenu = document.createElement("div");
    barMenu.className = "bar-menu";

    const modosContainer = document.createElement("div");
    modosContainer.className = "modos-container";

    const modsoInfo = [
        { key: 2, label: "Cruzado" },
        { key: 3, label: "Trisais" },
        { key: 4, label: "Quadras" }
    ];

    modsoInfo.forEach(m => {
        const btn = document.createElement("button");
        btn.className = `btn-modo ${numPalavrasAlvo === m.key ? 'ativo' : ''}`;
        btn.innerText = m.label;
        btn.onclick = () => iniciarJogo(m.key);
        modosContainer.appendChild(btn);
    });

    const btnAjuda = document.createElement("button");
    btnAjuda.className = "btn-ajuda";
    btnAjuda.innerText = "?";
    btnAjuda.onclick = exibirModalComoJogar;

    barMenu.appendChild(modosContainer);
    barMenu.appendChild(btnAjuda);

    const tituloModo = document.createElement("div");
    tituloModo.className = "titulo-modo";
    tituloModo.innerText = obterNomeModo(numPalavrasAlvo);

    topContainer.appendChild(barMenu);
    topContainer.appendChild(tituloModo);
    tabuleiro.appendChild(topContainer);

    const areaEntrada = document.createElement("div");
    areaEntrada.id = "area-entrada";
    
    const historico = document.createElement("div");
    historico.className = "historico-tentativas";
    historico.id = "historico";

    const gridPrincipal = criarGridBase(0, false);
    areaEntrada.appendChild(gridPrincipal.container);
    gridsDOM.length = 0;
    gridsDOM.push(gridPrincipal.celulas);

    for (let t = 0; t < maxTentativas; t++) {
        const gridMini = criarGridBase(t, true);
        gridMini.container.style.opacity = t === 0 ? "1" : "0.3";
        historico.appendChild(gridMini.container);
    }

    tabuleiro.appendChild(historico);
    tabuleiro.appendChild(areaEntrada);
    
    const teclado = criarTecladoVirtual();
    tabuleiro.appendChild(teclado);

    atualizarFoco();
}

function focarCelulaPorPos(r, c) {
    if (linhaAtual >= maxTentativas) return;

    if (focoRow === r && focoCol === c) {
        const temH = palavrasAtivas.some(p => p.orien === 'H' && p.fixedPos === r);
        const temV = palavrasAtivas.some(p => p.orien === 'V' && p.fixedPos === c);
        if (temH && temV) {
            direcaoAtual = direcaoAtual === 'H' ? 'V' : 'H';
        }
    } else {
        focoRow = r;
        focoCol = c;
        const temH = palavrasAtivas.some(p => p.orien === 'H' && p.fixedPos === r);
        const temV = palavrasAtivas.some(p => p.orien === 'V' && p.fixedPos === c);
        
        if (temH && !temV) direcaoAtual = 'H';
        else if (temV && !temH) direcaoAtual = 'V';
    }

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

    for (let p of palavrasAtivas) {
        let tentNorm = "";
        for (let i = 0; i < 7; i++) {
            let c;
            if (p.orien === 'H') {
                c = celulasAtuais.find(cel => parseInt(cel.dataset.row) === p.fixedPos && parseInt(cel.dataset.col) === i);
            } else {
                c = celulasAtuais.find(cel => parseInt(cel.dataset.col) === p.fixedPos && parseInt(cel.dataset.row) === i);
            }

            if (!c || !c.innerText) {
                alert("Preencha todas as letras antes de confirmar!");
                return;
            }
            tentNorm += c.innerText;
        }

        tentNorm = normalizarTexto(tentNorm);
        const idxDict = listaDePalavrasNormalizada.indexOf(tentNorm);

        if (idxDict === -1) {
            alert(`A palavra "${tentNorm.toUpperCase()}" não existe no dicionário!`);
            return;
        }

        tentativasPorPalavra.push({
            palavraObj: p,
            tentNorm: tentNorm,
            exibicao: listaDePalavrasOriginal[idxDict]
        });
    }

    const resultados = tentativasPorPalavra.map(item => {
        const secretArr = item.palavraObj.norm.split("");
        const guessArr = item.tentNorm.split("");
        const status = Array(7).fill("errada");

        for (let i = 0; i < 7; i++) {
            if (guessArr[i] === secretArr[i]) {
                status[i] = "correta";
                secretArr[i] = null;
                guessArr[i] = null;
            }
        }

        for (let i = 0; i < 7; i++) {
            if (guessArr[i] !== null) {
                const idx = secretArr.indexOf(guessArr[i]);
                if (idx !== -1) {
                    status[i] = "lugar-errado";
                    secretArr[idx] = null;
                }
            }
        }

        return { ...item, status };
    });

    const minicard = document.getElementById(`tentativa-${linhaAtual}`);

    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            const miniCell = minicard.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            if (!miniCell) continue;

            const resH = resultados.find(res => res.palavraObj.orien === 'H' && res.palavraObj.fixedPos === r);
            const resV = resultados.find(res => res.palavraObj.orien === 'V' && res.palavraObj.fixedPos === c);

            if (resH && resV) {
                miniCell.innerText = resH.exibicao[c];
                const stH = resH.status[c];
                const stV = resV.status[r];

                let statusFinal = "errada";
                if (stH === "correta" || stV === "correta") {
                    statusFinal = "correta";
                } 
                else if (stH === "lugar-errado" && stV === "lugar-errado") {
                    statusFinal = "cruzamento-duplo";
                } 
                else if (stH === "lugar-errado" || stV === "lugar-errado") {
                    statusFinal = "lugar-errado";
                }

                miniCell.classList.add(statusFinal);

                atualizarStatusTecladoGradiente(resH.exibicao[c], resH.palavraObj.id, stH);
                atualizarStatusTecladoGradiente(resV.exibicao[r], resV.palavraObj.id, stV);
            } 
            else if (resH) {
                miniCell.innerText = resH.exibicao[c];
                miniCell.classList.add(resH.status[c]);
                atualizarStatusTecladoGradiente(resH.exibicao[c], resH.palavraObj.id, resH.status[c]);
            } 
            else if (resV) {
                miniCell.innerText = resV.exibicao[r];
                miniCell.classList.add(resV.status[r]);
                atualizarStatusTecladoGradiente(resV.exibicao[r], resV.palavraObj.id, resV.status[r]);
            }
        }
    }

    const todasCorretas = resultados.every(r => r.tentNorm === r.palavraObj.norm);

    if (todasCorretas) {
        linhaAtual = maxTentativas;
        setTimeout(() => {
            let resumoPalavras = palavrasAtivas.map(p => `<p><strong>${p.orien === 'H' ? 'Horizontal' : 'Vertical'}:</strong> ${p.orig}</p>`).join("");
            exibirModal("Você Venceu! 🎉", `
                <p>Parabéns! Você descobriu todas as ${numPalavrasAlvo} palavras!</p>
                ${resumoPalavras}
            `, "Jogar Novamente", () => iniciarJogo(numPalavrasAlvo));
        }, 150);
        return;
    }

    linhaAtual++;
    
    if (linhaAtual < maxTentativas) {
        celulasAtuais.forEach(c => {
            c.innerText = "";
            c.classList.remove("focada");
        });
        
        document.getElementById(`tentativa-${linhaAtual}`).style.opacity = "1";
        
        const p1 = palavrasAtivas.find(p => p.orien === 'H') || palavrasAtivas[0];
        if (p1.orien === 'H') {
            focoRow = p1.fixedPos;
            focoCol = 0;
            direcaoAtual = 'H';
        } else {
            focoRow = 0;
            focoCol = p1.fixedPos;
            direcaoAtual = 'V';
        }

        atualizarFoco();
    } else {
        setTimeout(() => {
            let resumoPalavras = palavrasAtivas.map(p => `<p><strong>${p.orien === 'H' ? 'Horizontal' : 'Vertical'}:</strong> ${p.orig}</p>`).join("");
            exibirModal("Fim de Jogo ❌", `
                <p>Suas tentativas acabaram! As palavras eram:</p>
                ${resumoPalavras}
            `, "Tentar Novamente", () => iniciarJogo(numPalavrasAlvo));
        }, 200);
    }
}

carregarDicionario();
