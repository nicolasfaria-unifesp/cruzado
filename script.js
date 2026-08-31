let listaDePalavras = [];
let palavraH, palavraV, posH, posV;
let cruzamentoEncontrado = false;

const maxTentativas = 6;
let linhaAtual = 0;
let direcaoAtual = 1;
let cursorIndex = 0;
const gridsDOM = [];

async function carregarDicionario() {
    try {
        const url = 'br-utf8.txt';
        const resposta = await fetch(url);
        
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const texto = await resposta.text();
        
        listaDePalavras = texto
            .split(/\r?\n/)
            .map(p => p.trim())
            .filter(p => p.length === 7)
            .map(p => p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

        iniciarJogo();
    } 
    catch (erro) {
        console.error("Erro ao carregar o dicionario:", erro);
        alert("Erro ao carregar o dicionário. Se estiver executando localmente, abra o HTML utilizando um servidor local (ex: Live Server).");
    }
}

function iniciarJogo() {
    while (!cruzamentoEncontrado) {
        palavraH = listaDePalavras[Math.floor(Math.random() * listaDePalavras.length)].toUpperCase();
        palavraV = listaDePalavras[Math.floor(Math.random() * listaDePalavras.length)].toUpperCase();

        if (palavraH === palavraV) continue;

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if (palavraH[i] === palavraV[j]) {
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
            justify-content: center;
            align-items: flex-start;
            padding-top: 20px;
            min-height: 80vh;
            width: 100%;
            box-sizing: border-box;
        }

        .historico-tentativas {
            position: absolute;
            left: 30px;
            top: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .tabuleiro-tentativa {
            display: grid;
            grid-template-columns: repeat(7, 40px);
            grid-template-rows: repeat(7, 40px);
            gap: 5px;
        }

        .tabuleiro-tentativa.mini {
            transform: scale(0.42);
            transform-origin: top left;
            width: 130px;
            height: 130px;
            margin-bottom: 0px;
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

        .letra.escondida {
            border: none;
            background: transparent;
            cursor: default;
        }

        .letra.focada {
            border-color: #fff;
            border-bottom: 4px solid #fff;
        }

        .correta { background-color: #3aa394 !important; color: white; border-color: #3aa394; }
        .lugar-errado { background-color: #d3ad69 !important; color: white; border-color: #d3ad69; }
        .errada { background-color: #312a2c !important; color: white; border-color: #312a2c; }
    `;
    document.head.appendChild(estiloGrid);

    criarTabuleiro();
}

document.addEventListener("keydown", (evento) => {
    if (linhaAtual >= maxTentativas || listaDePalavras.length === 0) return;

    const tecla = evento.key;

    if (tecla === "Enter") {
        verificarPalavras();
        return;
    }

    if (tecla === "Backspace") {
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

    if (tecla === "ArrowRight") {
        direcaoAtual = 1;
        if (cursorIndex < 6) cursorIndex++;
        atualizarFoco();
        return;
    }

    if (tecla === "ArrowLeft") {
        direcaoAtual = 1;
        if (cursorIndex > 0) cursorIndex--;
        atualizarFoco();
        return;
    }

    if (tecla === "ArrowDown") {
        direcaoAtual = 2;
        if (cursorIndex < 6) cursorIndex++;
        atualizarFoco();
        return;
    }

    if (tecla === "ArrowUp") {
        direcaoAtual = 2;
        if (cursorIndex > 0) cursorIndex--;
        atualizarFoco();
        return;
    }

    if (/^[a-zA-Z]$/.test(tecla)) {
        const celula = obterCelulaAtual();
        if (celula) {
            celula.innerText = tecla.toUpperCase();
            if (cursorIndex < 6) {
                cursorIndex++;
            }
            atualizarFoco();
        }
    }
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

function criarTabuleiro() {
    const tabuleiro = document.getElementById("tabuleiro");
    
    const areaEntrada = document.createElement("div");
    areaEntrada.id = "area-entrada";
    
    const historico = document.createElement("div");
    historico.className = "historico-tentativas";
    historico.id = "historico";

    const gridPrincipal = criarGridBase(0, false);
    areaEntrada.appendChild(gridPrincipal.container);
    gridsDOM.push(gridPrincipal.celulas);

    for (let t = 0; t < maxTentativas; t++) {
        const gridMini = criarGridBase(t, true);
        gridMini.container.style.opacity = t === 0 ? "1" : "0.3";
        historico.appendChild(gridMini.container);
    }

    tabuleiro.appendChild(historico);
    tabuleiro.appendChild(areaEntrada);

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
    let tentativaH = "";
    let tentativaV = "";
    
    const celulasAtuais = gridsDOM[0];
    const blocosH = [];
    const blocosV = [];

    for(let i = 0; i < 7; i++) {
        const cH = celulasAtuais.find(c => parseInt(c.dataset.indexH) === i);
        const cV = celulasAtuais.find(c => parseInt(c.dataset.indexV) === i);
        
        if(!cH.innerText || !cV.innerText) {
            alert("Preencha todas as letras das duas palavras antes de confirmar!");
            return;
        }

        if (i === 0) {
            tentativaH = "";
            tentativaV = "";
        }
        
        tentativaH += cH.innerText;
        tentativaV += cV.innerText;
        blocosH.push(cH);
        blocosV.push(cV);
    }

    if (!listaDePalavras.includes(tentativaH.toLowerCase()) || !listaDePalavras.includes(tentativaV.toLowerCase())) {
        alert("Uma ou mais palavras não existem no dicionário!");
        return;
    }

    const minicard = document.getElementById(`tentativa-${linhaAtual}`);

    const calcularStatus = (palavraDigitada, palavraCerta) => {
        const secretArr = palavraCerta.split("");
        const guessArr = palavraDigitada.split("");
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

    const statusH = calcularStatus(tentativaH, palavraH);
    const statusV = calcularStatus(tentativaV, palavraV);

    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
            const ehH = (r === posV);
            const ehV = (c === posH);

            if (!ehH && !ehV) continue;

            const miniCell = minicard.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            
            if (ehH && ehV) {
                miniCell.innerText = tentativaH[c];
                const stH = statusH[c];
                const stV = statusV[r];

                if (stH === "correta" || stV === "correta") {
                    miniCell.classList.add("correta");
                } else if (stH === "lugar-errado" || stV === "lugar-errado") {
                    miniCell.classList.add("lugar-errado");
                } else {
                    miniCell.classList.add("errada");
                }
            } else if (ehH) {
                miniCell.innerText = tentativaH[c];
                miniCell.classList.add(statusH[c]);
            } else if (ehV) {
                miniCell.innerText = tentativaV[r];
                miniCell.classList.add(statusV[r]);
            }
        }
    }

    if (tentativaH === palavraH && tentativaV === palavraV) {
        setTimeout(() => alert("Parabéns, você venceu!"), 150);
        linhaAtual = maxTentativas;
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
        setTimeout(() => alert(`Fim de jogo! As palavras eram: ${palavraH} e ${palavraV}`), 200);
    }
}

carregarDicionario();