const listaDePalavras = [
  "abacate",
  "abalado",
  "abraçar",
  "acampar",
  "acertar",
  "acordar",
  "afastar",
  "agachar",
  "agrupar",
  "ajeitar",
  "alagado",
  "alterar",
  "amarelo",
  "amassar",
  "ameaçar",
  "amostra",
  "ancorar",
  "andaime",
  "angular",
  "animais",
  "ansioso",
  "apagado",
  "apertar",
  "apoiado",
  "aquecer",
  "arranjo",
  "arrumar",
  "assador",
  "assinar",
  "atacado",
  "atender",
  "atrasar",
  "avançar",
  "azulejo",
  "bagagem",
  "balanço",
  "bandeja",
  "barulho",
  "batalha",
  "bebedor",
  "besouro",
  "bilhete",
  "boliche",
  "bondade",
  "bonecas",
  "brincar",
  "buzinar",
  "caderno",
  "caixote",
  "caminho",
  "campeão",
  "cansado",
  "capitão",
  "carinho",
  "carroça",
  "castelo",
  "cebolas",
  "cenoura",
  "cerveja",
  "chamado",
  "chegada",
  "chinelo",
  "cidadão",
  "cigarro",
  "cimento",
  "clareza",
  "coelhos",
  "colchão",
  "colegas",
  "comando",
  "comprar",
  "confuso",
  "coragem",
  "corrida",
  "costela",
  "costume",
  "criança",
  "cristal",
  "cuidado",
  "cultura",
  "curioso",
  "decidir",
  "decisão",
  "deitado",
  "deixado",
  "delícia",
  "demorar",
  "depende",
  "desafio",
  "desejar",
  "desenho",
  "destino",
  "deveria",
  "direito",
  "disputa",
  "domingo",
  "dormido",
  "dourado",
  "duvidar",
  "educado",
  "embaixo",
  "emitido",
  "empatia",
  "emprego",
  "encaixe",
  "energia",
  "enfeite",
  "engenho",
  "ensaiar",
  "ensinar",
  "entrada",
  "equipar",
  "esbelto",
  "escolha",
  "escrito",
  "esforço",
  "esperar",
  "espinho",
  "estação",
  "estilos",
  "estreia",
  "estudar",
  "estágio",
  "exagero",
  "exemplo",
  "exibido",
  "existir",
  "fachada",
  "falante",
  "família",
  "farinha",
  "fazenda",
  "feriado",
  "fervura",
  "firmeza",
  "formiga",
  "fortuna",
  "freguês",
  "futebol",
  "fábrica",
  "galinha",
  "garagem",
  "garrafa",
  "geladas",
  "gigante",
  "ginásio",
  "girafas",
  "goleiro",
  "gostoso",
  "governo",
  "gramado",
  "gravata",
  "guardar",
  "gêneros",
  "habitat",
  "herança",
  "heroína",
  "hesitar",
  "honesto",
  "horário",
  "ignorar",
  "imagens",
  "imortal",
  "impacto",
  "impedir",
  "imposto",
  "indicar",
  "infante",
  "injusto",
  "inteiro",
  "interno",
  "inverno",
  "iogurte",
  "janeiro",
  "jardins",
  "joelhos",
  "jogador",
  "jornada",
  "justiça",
  "ketchup",
  "lagarto",
  "lamento",
  "lanchar",
  "lataria",
  "legenda",
  "leitura",
  "lembrar",
  "liberal",
  "ligação",
  "limpeza",
  "listado",
  "lixeira",
  "loucura",
  "machado",
  "madeira",
  "maduros",
  "maiores",
  "malhado",
  "mandado",
  "marchar",
  "marinho",
  "mascote",
  "medalha",
  "mediana",
  "meninas",
  "mercado",
  "mestres",
  "milagre",
  "moderno",
  "moldura",
  "montado",
  "morango",
  "morcego",
  "musical",
  "namorar",
  "narrado",
  "natural",
  "nervoso",
  "ninguém",
  "notícia",
  "novelas",
  "nublado",
  "números",
  "obrigar",
  "obscuro",
  "oceanos",
  "oitenta",
  "olhares",
  "ordenar",
  "orgulho",
  "ouvinte",
  "padeiro",
  "palavra",
  "panelas",
  "pantera",
  "parcela",
  "parente",
  "passado",
  "pedaços",
  "pequeno",
  "pesados",
  "pescado",
  "piscina",
  "planeta",
  "poderes",
  "polegar",
  "popular",
  "posição",
  "prender",
  "preparo",
  "projeto",
  "prédios",
  "público",
  "quadras",
  "quantas",
  "quantia",
  "quartos",
  "quebrar",
  "queijos",
  "química",
  "receber",
  "recheio",
  "recital",
  "recorde",
  "redondo",
  "regiões",
  "relaxar",
  "relógio",
  "reparar",
  "resenha",
  "resumir",
  "retirar",
  "retrato",
  "revisão",
  "roubado",
  "rápidos",
  "sabores",
  "sagrado",
  "salgado",
  "saltado",
  "segundo",
  "semanas",
  "sentado",
  "serviço",
  "simples",
  "sistema",
  "sobrado",
  "soldado",
  "sonhado",
  "sorriso",
  "sublime",
  "sucesso",
  "sujeito",
  "surgido",
  "tabelas",
  "talento",
  "tamanho",
  "tapetes",
  "teatral",
  "tempero",
  "tesouro",
  "testado",
  "toalhas",
  "tornado",
  "torneio",
  "tranças",
  "trilhas",
  "triunfo",
  "turismo",
  "unidade",
  "urgente",
  "usuário",
  "vaidade",
  "valente",
  "varanda",
  "vendido",
  "ventura",
  "verdade",
  "vestido",
  "veículo",
  "viagens",
  "viciado",
  "vinhedo",
  "violino",
  "virtude",
  "vitrine",
  "voltado",
  "walkman",
  "xerocar",
  "xingado",
  "zangada",
  "zangado",
  "zumbido"
];

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

        for (let j = 0; j < 7; j++) {
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
        if (tentativaAtual.length === 7) {
            verificarPalavra();
        } else {
            alert("A palavra precisa ter 7 letras!");
        }
        return;
    }

    if (tecla === "BACKSPACE") {
        tentativaAtual = tentativaAtual.slice(0, -1);
        atualizarLinhaNaTela();
        return;
    }

    if (/^[A-Z]$/.test(tecla)) {
        if (tentativaAtual.length < 7) {
            tentativaAtual += tecla;
            atualizarLinhaNaTela();
        }
    }
});

function atualizarLinhaNaTela() {
    for (let i = 0; i < 7; i++) {
        const caixa = document.getElementById(`caixa-${linhaAtual}-${i}`);
        caixa.innerText = tentativaAtual[i] || ""; 
    }
}

function verificarPalavra() {
    const letrasSecreta = palavraSecreta.split("");
    const letrasTentativa = tentativaAtual.split("");

    for (let i = 0; i < 7; i++) {
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
