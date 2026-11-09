
// Lista de frutas (6 pares)

const frutas = [
    "🍎",
    "🍌",
    "🍇",
    "🍓",
    "🍍",
    "🍉"
];

// Elementos HTML

const tabuleiro = document.getElementById("tabuleiro");
const contadorJogadas = document.getElementById("jogadas");
const contadorTempo = document.getElementById("tempo");
const contadorPares = document.getElementById("pares");

const mensagemFinal = document.getElementById("mensagemFinal");

const resultadoJogadas = document.getElementById("resultadoJogadas");
const resultadoTempo = document.getElementById("resultadoTempo");

// Variáveis do jogo

let cartasViradas = [];
let paresEncontrados = 0;
let jogadas = 0;

let bloqueio = false;
let jogoFinalizado = false;

let segundos = 0;
let cronometro = null;
let cronometroIniciado = false;


// Embaralhar as frutas

function embaralhar(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}


// Criar o tabuleiro

function criarTabuleiro() {

    tabuleiro.innerHTML = "";

    // Duplicar as frutas para formar os pares

    let cartas = [...frutas, ...frutas];

    // Embaralhar as cartas

    embaralhar(cartas);

    // Criar cada carta

    cartas.forEach((fruta) => {

        const carta = document.createElement("div");

        carta.classList.add("carta");

        carta.dataset.fruta = fruta;

        carta.innerHTML = `
            <div class="frente">
                ?
            </div>

            <div class="verso">
                ${fruta}
            </div>
        `;

        carta.addEventListener("click", () => virarCarta(carta));

        tabuleiro.appendChild(carta);

    });
}


// Iniciar cronômetro

function iniciarCronometro() {

    if (cronometroIniciado) return;

    cronometroIniciado = true;

    cronometro = setInterval(() => {

        segundos++;

        atualizarTempo();

    }, 1000);
}


// Atualizar tempo na tela

function atualizarTempo() {

    const minutos = Math.floor(segundos / 60);

    const segundosRestantes = segundos % 60;

    contadorTempo.textContent =
        String(minutos).padStart(2, "0") + ":" +
        String(segundosRestantes).padStart(2, "0");

}


// Virar carta

function virarCarta(carta) {

    // Impedir cliques inválidos

    if (bloqueio) return;

    if (jogoFinalizado) return;

    if (carta.classList.contains("virada")) return;

    if (carta.classList.contains("encontrada")) return;

    // Iniciar cronômetro no primeiro clique

    iniciarCronometro();

    // Virar carta

    carta.classList.add("virada");

    cartasViradas.push(carta);

    // Verificar se duas cartas foram abertas

    if (cartasViradas.length === 2) {

        jogadas++;

        contadorJogadas.textContent = jogadas;

        verificarPar();

    }

}


// Comparar as cartas

function verificarPar() {

    const primeira = cartasViradas[0];

    const segunda = cartasViradas[1];

    // Se forem iguais

    if (primeira.dataset.fruta === segunda.dataset.fruta) {

        primeira.classList.add("encontrada");

        segunda.classList.add("encontrada");

        paresEncontrados++;

        contadorPares.textContent = `${paresEncontrados} / 6`;

        cartasViradas = [];

        // Verificar vitória

        if (paresEncontrados === 6) {

            finalizarJogo();

        }

    }

    // Se forem diferentes

    else {

        bloqueio = true;

        setTimeout(() => {

            primeira.classList.remove("virada");

            segunda.classList.remove("virada");

            cartasViradas = [];

            bloqueio = false;

        }, 1000);

    }

}


// Finalizar jogo

function finalizarJogo() {

    jogoFinalizado = true;

    clearInterval(cronometro);

    resultadoJogadas.textContent = jogadas;

    resultadoTempo.textContent = contadorTempo.textContent;

    mensagemFinal.classList.add("ativa");

}


// Reiniciar jogo

function reiniciarJogo() {

    // Parar cronômetro anterior

    clearInterval(cronometro);

    // Zerar variáveis

    cartasViradas = [];

    paresEncontrados = 0;

    jogadas = 0;

    segundos = 0;

    bloqueio = false;

    jogoFinalizado = false;

    cronometroIniciado = false;

    // Atualizar informações

    contadorJogadas.textContent = "0";

    contadorPares.textContent = "0 / 6";

    contadorTempo.textContent = "00:00";

    // Esconder mensagem final

    mensagemFinal.classList.remove("ativa");

    // Criar novo tabuleiro embaralhado

    criarTabuleiro();

}


// Iniciar o jogo ao carregar a página

reiniciarJogo();
