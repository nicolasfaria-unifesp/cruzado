const listaDePalavras = [
  "abacate", "abalado", "abraçar", "acampar", "acertar", "acordar", "afastar",
  "agachar", "agrupar", "ajeitar", "alagado", "alterar", "amarelo", "amassar",
  "ameaçar", "amostra", "ancorar", "andaime", "angular", "animais", "ansioso",
  "apagado", "apertar", "apoiado", "aquecer", "arranjo", "arrumar", "assador",
  "assinar", "atacado", "atender", "atrasar", "avançar", "azulejo", "bagagem",
  "balanço", "bandeja", "barulho", "batalha", "bebedor", "besouro", "bilhete",
  "boliche", "bondade", "bonecas", "brincar", "buzinar", "caderno", "caixote",
  "caminho", "campeão", "cansado", "capitão", "carinho", "carroça", "castelo",
  "cebolas", "cenoura", "cerveja", "chamado", "chegada", "chinelo", "cidadão",
  "cigarro", "cimento", "clareza", "coelhos", "colchão", "colegas", "comando",
  "comprar", "confuso", "coragem", "corrida", "costela", "costume", "criança",
  "cristal", "cuidado", "cultura", "curioso", "decidir", "decisão", "deitado",
  "deixado", "delícia", "demorar", "depende", "desafio", "desejar", "desenho",
  "destino", "deveria", "direito", "disputa", "domingo", "dormido", "dourado",
  "duvidar", "educado", "embaixo", "emitido", "empatia", "emprego", "encaixe",
  "energia", "enfeite", "engenho", "ensaiar", "ensinar", "entrada", "equipar",
  "esbelto", "escolha", "escrito", "esforço", "esperar", "espinho", "estação",
  "estilos", "estreia", "estudar", "estágio", "exagero", "exemplo", "exibido",
  "existir", "fachada", "falante", "família", "farinha", "fazenda", "feriado",
  "fervura", "firmeza", "formiga", "fortuna", "freguês", "futebol", "fábrica",
  "galinha", "garagem", "garrafa", "geladas", "gigante", "ginásio", "girafas",
  "goleiro", "gostoso", "governo", "gramado", "gravata", "guardar", "gêneros",
  "habitat", "herança", "heroína", "hesitar", "honesto", "horário", "ignorar",
  "imagens", "imortal", "impacto", "impedir", "imposto", "indicar", "infante",
  "injusto", "inteiro", "interno", "inverno", "iogurte", "janeiro", "jardins",
  "joelhos", "jogador", "jornada", "justiça", "ketchup", "lagarto", "lamento",
  "lanchar", "lataria", "legenda", "leitura", "lembrar", "liberal", "ligação",
  "limpeza", "listado", "lixeira", "loucura", "machado", "madeira", "maduros",
  "maiores", "malhado", "mandado", "marchar", "marinho", "mascote", "medalha",
  "mediana", "meninas", "mercado", "mestres", "milagre", "moderno", "moldura",
  "montado", "morango", "morcego", "musical", "namorar", "narrado", "natural",
  "nervoso", "ninguém", "notícia", "novelas", "nublado", "números", "obrigar",
  "obscuro", "oceanos", "oitenta", "olhares", "ordenar", "orgulho", "ouvinte",
  "padeiro", "palavra", "panelas", "pantera", "parcela", "parente", "passado",
  "pedaços", "pequeno", "pesados", "pescado", "piscina", "planeta", "poderes",
  "polegar", "popular", "posição", "prender", "preparo", "projeto", "prédios",
  "público", "quadras", "quantas", "quantia", "quartos", "quebrar", "queijos",
  "química", "receber", "recheio", "recital", "recorde", "redondo", "regiões",
  "relaxar", "relógio", "reparar", "resenha", "resumir", "retirar", "retrato",
  "revisão", "roubado", "rápidos", "sabores", "sagrado", "salgado", "saltado",
  "segundo", "semanas", "sentado", "serviço", "simples", "sistema", "sobrado",
  "soldado", "sonhado", "sorriso", "sublime", "sucesso", "sujeito", "surgido",
  "tabelas", "talento", "tamanho", "tapetes", "teatral", "tempero", "tesouro",
  "testado", "toalhas", "tornado", "torneio", "tranças", "trilhas", "triunfo",
  "turismo", "unidade", "urgente", "usuário", "vaidade", "valente", "varanda",
  "vendido", "ventura", "verdade", "vestido", "veículo", "viagens", "viciado",
  "vinhedo", "violino", "virtude", "vitrine", "voltado", "xerocar",
  "xingado", "zangada", "zangado", "zumbido"
];

let palavraH, palavraV, posH, posV;
let cruzamentoEncontrado = false;

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

const maxTentativas = 6;
let linhaAtual = 0;
let direcaoAtual = 1;
let cursorIndex = 0;
const tabuleiro = document.getElementById("tabuleiro");
tabuleiro.innerHTML = "";

const estiloGrid = document.createElement('style');
estiloGrid.innerHTML = `
    .tabuleiro-tentativa {
        display: grid;
        grid-template-columns: repeat(7, 40px);
        grid-template-rows: repeat(7, 40px);
        gap: 5px;
        margin-bottom: 30px;
        justify-content: center;
    }
    .letra {
        width: 100%;
        height: 100%;
        border: 2px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        font-weight: bold;
        cursor: pointer;
        text-transform: uppercase;
        background: #fff;
    }
    .letra.escondida {
        border: none;
        background: transparent;
        cursor: default;
    }
    .letra.focada {
        border-color: #333;
        border-bottom: 4px solid #333;
    }
    .correta { background-color: #3aa394 !important; color: white; border-color: #3aa394; }
    .lugar-errado { background-color: #d3ad69 !important; color: white; border-color: #d3ad69; }
    .errada { background-color: #312a2c !important; color: white; border-color: #312a2c; }
`;
document.head.appendChild(estiloGrid);

const gridsDOM = [];

function criarTabuleiro() {
    for (let t = 0; t < maxTentativas; t++) {
        const container = document.createElement("div");
        container.className = "tabuleiro-tentativa";
        container.id = `tentativa-${t}`;
        
        if (t > 0) container.style.opacity = "0.3"; 

        const celulas = [];

        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                const caixa = document.createElement("div");
                
                const ehHorizontal = (row === posV);
                const ehVertical = (col === posH);

                if (ehHorizontal || ehVertical) {
                    caixa.className = "letra";
                    caixa.dataset.indexH = ehHorizontal ? col : -1;
                    caixa.dataset.indexV = ehVertical ? row : -1;
                    
                    if (ehHorizontal && ehVertical) {
                        caixa.dataset.tipo = "intersecao";
                    } else if (ehHorizontal) {
                        caixa.dataset.tipo = "horizontal";
                    } else if (ehVertical) {
                        caixa.dataset.tipo = "vertical";
                    }

                    caixa.addEventListener("click", () => focarCelula(t, caixa));
                } else {
                    caixa.className = "letra escondida";
                }
                
                container.appendChild(caixa);
                if (ehHorizontal || ehVertical) celulas.push(caixa);
            }
        }
        tabuleiro.appendChild(container);
        gridsDOM.push(celulas);
    }
    atualizarFoco();
}
criarTabuleiro();

function focarCelula(tentativa, caixa) {
    if (tentativa !== linhaAtual) return;

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

    gridsDOM[linhaAtual].forEach(c => c.classList.remove("focada"));

    const celulaAtual = obterCelulaAtual();
    if (celulaAtual) celulaAtual.classList.add("focada");
}

function obterCelulaAtual() {
    return gridsDOM[linhaAtual].find(c => {
        if (direcaoAtual === 1) return parseInt(c.dataset.indexH) === cursorIndex;
        if (direcaoAtual === 2) return parseInt(c.dataset.indexV) === cursorIndex;
        return false;
    });
}

document.addEventListener("keydown", (evento) => {
    if (linhaAtual >= maxTentativas) return;

    const tecla = evento.key.toUpperCase();

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
});

function verificarPalavras() {
    let tentativaH = "";
    let tentativaV = "";
    
    const celulas = gridsDOM[linhaAtual];
    const blocosH = [];
    const blocosV = [];

    for(let i = 0; i < 7; i++) {
        const cH = celulas.find(c => parseInt(c.dataset.indexH) === i);
        const cV = celulas.find(c => parseInt(c.dataset.indexV) === i);
        
        if(!cH.innerText || !cV.innerText) {
            alert("Preencha todas as letras das duas palavras antes de confirmar!");
            return;
        }

        tentativaH += cH.innerText;
        tentativaV += cV.innerText;
        blocosH.push(cH);
        blocosV.push(cV);
    }

    const aplicarCores = (palavraDigitada, palavraCerta, elementos) => {
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

        for (let i = 0; i < 7; i++) {
            elementos[i].classList.remove("focada");
            
            if (elementos[i].dataset.tipo === "intersecao") {
                const isCorreta = elementos[i].classList.contains("correta");
                if (status[i] === "correta") {
                    elementos[i].classList.remove("lugar-errado", "errada");
                    elementos[i].classList.add("correta");
                } else if (status[i] === "lugar-errado" && !isCorreta) {
                    elementos[i].classList.remove("errada");
                    elementos[i].classList.add("lugar-errado");
                } else if (!elementos[i].classList.contains("lugar-errado") && !isCorreta) {
                    elementos[i].classList.add(status[i]);
                }
            } else {
                elementos[i].classList.add(status[i]);
            }
        }
    };

    aplicarCores(tentativaH, palavraH, blocosH);
    aplicarCores(tentativaV, palavraV, blocosV);

    if (tentativaH === palavraH && tentativaV === palavraV) {
        setTimeout(() => alert("Parabéns, você venceu!"), 150);
        linhaAtual = maxTentativas;
        return;
    }

    linhaAtual++;
    
    if (linhaAtual < maxTentativas) {
        document.getElementById(`tentativa-${linhaAtual}`).style.opacity = "1";
        cursorIndex = 0;
        direcaoAtual = 1;
        atualizarFoco();
    } else {
        setTimeout(() => alert(`Fim de jogo! As palavras eram: ${palavraH} e ${palavraV}`), 200);
    }
}