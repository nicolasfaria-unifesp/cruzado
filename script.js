const listaDePalavras = ["SAGAZ", "NEGRO", "TERMO", "MEXER", "NOBRE"];

const palavraSecreta = listaDePalavras[Math.floor(Math.random() * listaDePalavras.length)];

const maxTentativas = 6;
let tentativaAtual = "";
let linhaAtual = 0;

const tabuleiro = document.getElementById("tabuleiro");

function criarTabuleiro() {
    for (let i = 0; i < maxTentativas; i++) {
        const linha = document.createElement("div");
        linha.className = "linha";
        linha.id = `linha-${i}`;

        for (let j = 0; j < 5; j++) {
            const caixa = document.createElement("div");
            caixa.className = "letra";
            caixa.id = `caixa-${i}-${j}`;
            linha.appendChild(caixa);
        }
        tabuleiro.appendChild(linha);
    }
}
criarTabuleiro();

document.addEventListener("keydown", (evento) => {
    if (linhaAtual >= maxTentativas) return;

    const tecla = evento.key.toUpperCase();

    if (tecla === "ENTER") {
        if (tentativaAtual.length === 5) {
            verificarPalavra();
        } else {
            alert("A palavra precisa ter 5 letras!");
        }
        return;
    }

    if (tecla === "BACKSPACE") {
        tentativaAtual = tentativaAtual.slice(0, -1);
        atualizarLinhaNaTela();
        return;
    }

    if (/^[A-Z]$/.test(tecla)) {
        if (tentativaAtual.length < 5) {
            tentativaAtual += tecla;
            atualizarLinhaNaTela();
        }
    }
});

function atualizarLinhaNaTela() {
    for (let i = 0; i < 5; i++) {
        const caixa = document.getElementById(`caixa-${linhaAtual}-${i}`);
        caixa.innerText = tentativaAtual[i] || ""; 
    }
}

function verificarPalavra() {
    const letrasSecreta = palavraSecreta.split("");
    const letrasTentativa = tentativaAtual.split("");

    for (let i = 0; i < 5; i++) {
        const caixa = document.getElementById(`caixa-${linhaAtual}-${i}`);
        const letraDigitada = letrasTentativa[i];

        if (letraDigitada === letrasSecreta[i]) {
            caixa.classList.add("correta");
            letrasSecreta[i] = null; 
        } 
        else if (letrasSecreta.includes(letraDigitada)) {
            caixa.classList.add("lugar-errado");
            const index = letrasSecreta.indexOf(letraDigitada);
            letrasSecreta[index] = null;
        } 
        else {
            caixa.classList.add("errada");
        }
    }

    if (tentativaAtual === palavraSecreta) {
        setTimeout(() => alert("Você venceu!"), 100);
        linhaAtual = maxTentativas;
        return;
    }

    linhaAtual++;
    tentativaAtual = "";

    if (linhaAtual === maxTentativas) {
        setTimeout(() => alert(`Fim de jogo! A palavra era: ${palavraSecreta}`), 100);
    }
}