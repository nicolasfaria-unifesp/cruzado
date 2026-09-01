let listaDePalavrasOriginal = [];
let listaDePalavrasNormalizada = [];
let palavraH, palavraV, palavraHNorm, palavraVNorm, posH, posV;
let cruzamentoEncontrado = false;

const maxTentativas = 6;
let linhaAtual = 0;
let direcaoAtual = 1;
let cursorIndex = 0;
const gridsDOM = [];

// Função auxiliar para remover acentos
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

        iniciarJogo();
    } 
    catch (erro) {
        console.error("Erro ao carregar o dicionario:", erro);
        alert("Erro ao carregar o dicionário. Se estiver executando localmente, abra o HTML utilizando um servidor local (ex: Live Server).");
    }
}

function iniciarJogo() {
    cruzamentoEncontrado = false;
    while (!cruzamentoEncontrado) {
        const idxH = Math.floor(Math.random() * listaDePalavrasOriginal.length);
        const idxV = Math.floor(Math.random() * listaDePalavrasOriginal.length);

        if (idxH === idxV) continue;

        palavraH = listaDePalavrasOriginal[idxH];
        palavraV = listaDePalavrasOriginal[idxV];
        palavraHNorm = listaDePalavrasNormalizada[idxH];
        palavraVNorm = listaDePalavrasNormalizada[idxV];

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if (palavraHNorm[i] === palavraVNorm[j]) {
                    posH = i;
                    posV = j;
                    cruzamentoEncontrado = true;
                    break;
                }
            }
            if (cruzamentoEncontrado) break;
        }
    }

    const tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.innerHTML = "";

    const estiloGrid = document.createElement('style');
    estiloGrid.innerHTML = `
        #tabuleiro {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 10px;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            box-sizing: border-box;
        }

        .topo-acoes {
            display: flex;
            justify-content: flex-end;
            width: 100%;
            max-width: 500px;
            margin-bottom: 10px;
        }

        .btn-ajuda {
            background: #4a4a4a;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
        }

        .historico-tentativas {
            position: absolute;
            left: 20px;
            top: 20px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, auto);
            gap: 15px;
            width: fit-content;
        }

        #area-entrada {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
        }

        .tabuleiro-tentativa {
            display: grid;
            grid-template-columns: repeat(7, 40px);
            grid-template-rows: repeat(7, 40px);
            gap: 5px;
        }

        .tabuleiro-tentativa.mini {
            grid-template-columns: repeat(7, 18px);
            grid-template-rows: repeat(7, 18px);
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
            font-size: 22px;
            font-weight: bold;
            cursor: pointer;
            text-transform: uppercase;
            background: #676767;
            user-select: none;
            box-sizing: border-box;
        }

        .mini .letra {
            font-size: 10px;
            border-width: 1px;
        }

        .letra.escondida {
            border: none !important;
            background: transparent !important;
            cursor: default;
        }

        .letra.focada {
            border-color: #fff;
            border-bottom: 4px solid #fff;
        }

        .correta { background-color: #3aa394 !important; color: white; border-color: #3aa394; }
        .lugar-errado { background-color: #d3ad69 !important; color: white; border-color: #d3ad69; }
        .errada { background-color: #312a2c !important; color: white; border-color: #312a2c; }

        #teclado {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
            margin-top: 10px;
            user-select: none;
            width: 100%;
            max-width: 500px;
        }

        .linha-teclado {
            display: flex;
            gap: 6px;
            width: 100%;
            justify-content: center;
        }

        .tecla {
            height: 50px;
            min-width: 36px;
            flex: 1;
            padding: 0 4px;
            background-color: #4a4a4a;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.15s ease;
        }

        .tecla:hover { background-color: #616161; }
        .tecla:active { background-color: #333; }

        .tecla.especial {
            flex: 1.5;
            font-size: 12px;
            background-color: #5d5d5d;
        }

        /* Modais Customizados */
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

        .modal-btn:hover {
            background-color: #2e8377;
        }

        @media (max-width: 768px) {
            #tabuleiro {
                padding: 10px 5px;
            }

            .historico-tentativas {
                position: relative;
                left: 0;
                top: 0;
                display: flex;
                flex-direction: row;
                overflow-x: auto;
                width: 100%;
                justify-content: flex-start;
                padding-bottom: 10px;
                margin-bottom: 15px;
                gap: 10px;
            }

            .tabuleiro-tentativa.principal {
                grid-template-columns: repeat(7, 11vw);
                grid-template-rows: repeat(7, 11vw);
                max-width: 350px;
                max-height: 350px;
                gap: 3px;
            }

            .letra { font-size: 18px; }
            .linha-teclado { gap: 4px; }
            .tecla { height: 45px; font-size: 14px; padding: 0; }
            .tecla.especial { font-size: 11px; }
        }
    `;
    document.head.appendChild(estiloGrid);

    criarTabuleiro();
    exibirModalComoJogar();
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
        <p>Adivilhe as duas palavras cruzadas de 7 letras em 6 tentativas!</p>
        <ul>
            <li><strong>Verde:</strong> A letra está na posição correta.</li>
            <li><strong>Amarelo:</strong> A letra faz parte da palavra, mas está na posição errada.</li>
            <li><strong>Cinza:</strong> A letra não pertence à palavra.</li>
            <li>Você pode trocar a orientação do cursor (horizontal/vertical) clicando nas caixas.</li>
            <li><strong>Acentuação:</strong> Digite sem acento. Se a palavra correta possuir acento ou Ç, ela será exibida formatada ao confirmar!</li>
        </ul>
    `;
    exibirModal("Como Jogar", regras, "Entendi");
}

function processarEntrada(tecla) {
    if (linhaAtual >= maxTentativas || listaDePalavrasOriginal.length === 0) return;

    if (tecla === "ENTER") {
        verificarPalavras();
        return;
    }

    if (tecla === "BACKSPACE") {
        const celula = obterCelulaAtual();
        if (celula.innerText !== "") {
            celula.innerText = "";
        } else if (cursorIndex > 0) {
            cursorIndex--;
            obterCelulaAtual().innerText = "";
        }
        atualizarFoco();
        return;
    }

    if (tecla === "ARROWRIGHT") {
        direcaoAtual = 1;
        if (cursorIndex < 6) cursorIndex++;
        atualizarFoco();
        return;
    }

    if (tecla === "ARROWLEFT") {
        direcaoAtual = 1;
        if (cursorIndex > 0) cursorIndex--;
        atualizarFoco();
        return;
    }

    if (tecla === "ARROWDOWN") {
        direcaoAtual = 2;
        if (cursorIndex < 6) cursorIndex++;
        atualizarFoco();
        return;
    }

    if (tecla === "ARROWUP") {
        direcaoAtual = 2;
        if (cursorIndex > 0) cursorIndex--;
        atualizarFoco();
        return;
    }

    if (/^[A-Z]$/.test(tecla)) {
        const celula = obterCelulaAtual();
        if (celula) {
            celula.innerText = tecla;
            if (cursorIndex < 6) {
                cursorIndex++;
            }
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
    container.id = `tentativa-${tentativa}`;

    const celulas = [];

    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
            const caixa = document.createElement("div");
            
            const ehHorizontal = (row === posV);
            const ehVertical = (col === posH);

            if (ehHorizontal || ehVertical) {
                caixa.className = "letra";
                caixa.dataset.row = row;
                caixa.dataset.col = col;
                caixa.dataset.indexH = ehHorizontal ? col : -1;
                caixa.dataset.indexV = ehVertical ? row : -1;
                
                if (ehHorizontal && ehVertical) {
                    caixa.dataset.tipo = "intersecao";
                } else if (ehHorizontal) {
                    caixa.dataset.tipo = "horizontal";
                } else if (ehVertical) {
                    caixa.dataset.tipo = "vertical";
                }

                if (!ehMini) {
                    caixa.addEventListener("click", () => focarCelula(caixa));
                }
            } else {
                caixa.className = "letra escondida";
            }
            
            container.appendChild(caixa);
            if (ehHorizontal || ehVertical) celulas.push(caixa);
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
            
            botao.addEventListener("click", () => {
                processarEntrada(tecla);
            });

            linhaDiv.appendChild(botao);
        });

        tecladoContainer.appendChild(linhaDiv);
    });

    return tecladoContainer;
}

function atualizarStatusTeclado(letra, novoStatus) {
    const letraNorm = normalizarTexto(letra).toUpperCase();
    const botao = document.querySelector(`.tecla[data-key="${letraNorm}"]`);
    if (!botao) return;

    const prioridade = { "correta": 3, "lugar-errado": 2, "errada": 1 };
    const statusAtual = botao.dataset.status || "";

    if (!statusAtual || prioridade[novoStatus] > prioridade[statusAtual]) {
        botao.dataset.status = novoStatus;
        
        botao.classList.remove("correta", "lugar-errado", "errada");
        botao.classList.add(novoStatus);
    }
}

function criarTabuleiro() {
    const tabuleiro = document.getElementById("tabuleiro");
    
    const topo = document.createElement("div");
    topo.className = "topo-acoes";
    const btnAjuda = document.createElement("button");
    btnAjuda.className = "btn-ajuda";
    btnAjuda.innerText = "?";
    btnAjuda.onclick = exibirModalComoJogar;
    topo.appendChild(btnAjuda);
    tabuleiro.appendChild(topo);

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

function focarCelula(caixa) {
    if (linhaAtual >= maxTentativas) return;

    const tipo = caixa.dataset.tipo;
    if (tipo === "intersecao") {
        if (caixa.classList.contains("focada")) {
            direcaoAtual = direcaoAtual === 1 ? 2 : 1;
        }
        cursorIndex = direcaoAtual === 1 ? parseInt(caixa.dataset.indexH) : parseInt(caixa.dataset.indexV);
    } else if (tipo === "horizontal") {
        direcaoAtual = 1;
        cursorIndex = parseInt(caixa.dataset.indexH);
    } else if (tipo === "vertical") {
        direcaoAtual = 2;
        cursorIndex = parseInt(caixa.dataset.indexV);
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
    return gridsDOM[0].find(c => {
        if (direcaoAtual === 1) return parseInt(c.dataset.indexH) === cursorIndex;
        if (direcaoAtual === 2) return parseInt(c.dataset.indexV) === cursorIndex;
        return false;
    });
}

function verificarPalavras() {
    let tentativaHNorm = "";
    let tentativaVNorm = "";
    
    const celulasAtuais = gridsDOM[0];

    for(let i = 0; i < 7; i++) {
        const cH = celulasAtuais.find(c => parseInt(c.dataset.indexH) === i);
        const cV = celulasAtuais.find(c => parseInt(c.dataset.indexV) === i);
        
        if(!cH.innerText || !cV.innerText) {
            alert("Preencha todas as letras das duas palavras antes de confirmar!");
            return;
        }

        tentativaHNorm += cH.innerText;
        tentativaVNorm += cV.innerText;
    }

    tentativaHNorm = normalizarTexto(tentativaHNorm);
    tentativaVNorm = normalizarTexto(tentativaVNorm);

    const idxDictH = listaDePalavrasNormalizada.indexOf(tentativaHNorm);
    const idxDictV = listaDePalavrasNormalizada.indexOf(tentativaVNorm);

    if (idxDictH === -1 || idxDictV === -1) {
        alert("Uma ou mais palavras não existem no dicionário!");
        return;
    }

    const tentativaHExibicao = listaDePalavrasOriginal[idxDictH];
    const tentativaVExibicao = listaDePalavrasOriginal[idxDictV];

    const minicard = document.getElementById(`tentativa-${linhaAtual}`);

    const calcularStatus = (palavraDigitadaNorm, palavraCertaNorm) => {
        const secretArr = palavraCertaNorm.split("");
        const guessArr = palavraDigitadaNorm.split("");
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
        return status;
    };

    const statusH = calcularStatus(tentativaHNorm, palavraHNorm);
    const statusV = calcularStatus(tentativaVNorm, palavraVNorm);

    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            const ehH = (r === posV);
            const ehV = (c === posH);

            if (!ehH && !ehV) continue;

            const miniCell = minicard.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            
            if (ehH && ehV) {
                miniCell.innerText = tentativaHExibicao[c];
                const stH = statusH[c];
                const stV = statusV[r];

                let statusFinal = "errada";
                if (stH === "correta" || stV === "correta") {
                    statusFinal = "correta";
                } else if (stH === "lugar-errado" || stV === "lugar-errado") {
                    statusFinal = "lugar-errado";
                }

                miniCell.classList.add(statusFinal);
                atualizarStatusTeclado(tentativaHExibicao[c], statusFinal);
            } else if (ehH) {
                miniCell.innerText = tentativaHExibicao[c];
                miniCell.classList.add(statusH[c]);
                atualizarStatusTeclado(tentativaHExibicao[c], statusH[c]);
            } else if (ehV) {
                miniCell.innerText = tentativaVExibicao[r];
                miniCell.classList.add(statusV[r]);
                atualizarStatusTeclado(tentativaVExibicao[r], statusV[r]);
            }
        }
    }

    if (tentativaHNorm === palavraHNorm && tentativaVNorm === palavraVNorm) {
        linhaAtual = maxTentativas;
        setTimeout(() => {
            exibirModal("Você Venceu! 🎉", `
                <p>Parabéns! Você descobriu as duas palavras com sucesso.</p>
                <p><strong>Palavra Horizontal:</strong> ${palavraH}</p>
                <p><strong>Palavra Vertical:</strong> ${palavraV}</p>
            `, "Jogar Novamente", () => location.reload());
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
        cursorIndex = 0;
        direcaoAtual = 1;
        atualizarFoco();
    } else {
        setTimeout(() => {
            exibirModal("Fim de Jogo! ❌", `
                <p>Suas tentativas acabaram! Tente novamente.</p>
                <p><strong>Palavra Horizontal:</strong> ${palavraH}</p>
                <p><strong>Palavra Vertical:</strong> ${palavraV}</p>
            `, "Jogar Novamente", () => location.reload());
        }, 200);
    }
}

carregarDicionario();