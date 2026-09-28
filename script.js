/* =========================================
   CONFIGURAÇÃO DO SUPABASE
========================================= */

const SUPABASE_URL = "https://zkvqnvhagkwgheeprrvg.supabase.co/rest/v1/";

const SUPABASE_KEY = "sb_publishable_aqZ68nmgiQ1ncyljak-fGg_YgTfHfqj";


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



/* =========================================
   CARTAS
========================================= */

const cartas = [
    "Ás",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Valete",
    "Cavaleiro",
    "Rainha",
    "Rei"
];


const naipes = {

    paus: {
        nome: "Paus",
        simbolo: "♣"
    },

    copas: {
        nome: "Copas",
        simbolo: "♥"
    },

    espadas: {
        nome: "Espadas",
        simbolo: "♠"
    },

    ouros: {
        nome: "Ouros",
        simbolo: "♦"
    }

};



/* =========================================
   GERAR ID NUMÉRICO
========================================= */

function gerarId(naipe, index) {

    const ordem = {

        paus: 1,

        copas: 2,

        espadas: 3,

        ouros: 4

    };

    return (
        (ordem[naipe] - 1) * 14
        + index
        + 1
    );

}



/* =========================================
   ABRIR EDITOR
========================================= */

async function abrirEditor(
    id,
    naipe,
    numero
) {

    const editor =
        document.getElementById("editor");


    const titulo =
        document.getElementById("editor-titulo");


    const palavras =
        document.getElementById("editor-palavras");


    const significado =
        document.getElementById("editor-significado");


    const idInput =
        document.getElementById("editor-id");


    const naipeInput =
        document.getElementById("editor-naipe");


    const numeroInput =
        document.getElementById("editor-numero");


    const status =
        document.getElementById("editor-status");


    editor.classList.add("aberto");


    titulo.textContent =
        `${numero} de ${naipes[naipe].nome}`;


    idInput.value = id;

    naipeInput.value = naipe;

    numeroInput.value = numero;


    palavras.value = "";

    significado.value = "";

    status.textContent = "carregando...";


    const resultado =
        await supabaseClient
            .from("cartas")
            .select("*")
            .eq("id", id)
            .maybeSingle();


    if (resultado.error) {

        console.error(
            "Erro ao carregar:",
            resultado.error
        );

        status.textContent =
            "erro ao carregar";

        return;
    }


    if (resultado.data) {

        palavras.value =
            resultado.data.palavras || "";


        significado.value =
            resultado.data.significado || "";

    }


    status.textContent = "";



    /* Foca no campo automaticamente */

    setTimeout(() => {

        palavras.focus();

    }, 150);

}



/* =========================================
   FECHAR EDITOR
========================================= */

function fecharEditor() {

    document
        .getElementById("editor")
        .classList
        .remove("aberto");

}



/* =========================================
   SALVAR CARTA
========================================= */

async function salvarEditor() {

    const id =
        Number(
            document.getElementById(
                "editor-id"
            ).value
        );


    const naipe =
        document.getElementById(
            "editor-naipe"
        ).value;


    const numero =
        document.getElementById(
            "editor-numero"
        ).value;


    const palavras =
        document.getElementById(
            "editor-palavras"
        ).value;


    const significado =
        document.getElementById(
            "editor-significado"
        ).value;


    const status =
        document.getElementById(
            "editor-status"
        );


    status.textContent =
        "salvando...";


    const resultado =
        await supabaseClient
            .from("cartas")
            .upsert({

                id: id,

                naipe: naipe,

                numero: numero,

                palavras: palavras,

                significado: significado

            });


    if (resultado.error) {

        console.error(
            "ERRO DO SUPABASE:",
            resultado.error
        );


        status.textContent =
            "❌ erro ao salvar";


        alert(
            "Não consegui salvar.\n\n" +
            resultado.error.message
        );


        return;
    }


    status.textContent =
        "♡ salvo online!";


    atualizarCarta(
        id,
        palavras,
        significado
    );


    setTimeout(() => {

        fecharEditor();

    }, 700);

}



/* =========================================
   ATUALIZAR CARTA NA TELA
========================================= */

function atualizarCarta(
    id,
    palavras,
    significado
) {

    const card =
        document.querySelector(
            `[data-card-id="${id}"]`
        );


    if (!card) {
        return;
    }


    const resumo =
        card.querySelector(
            ".card-resumo"
        );


    resumo.textContent = "";


    if (palavras) {

        const palavra =
            document.createElement("strong");


        palavra.textContent =
            "✧ " + palavras;


        resumo.appendChild(
            palavra
        );


        resumo.appendChild(
            document.createElement("br")
        );


        resumo.appendChild(
            document.createElement("br")
        );

    }


    if (significado) {

        const texto =
            document.createElement("span");


        texto.textContent =
            significado;


        resumo.appendChild(
            texto
        );

    }


    if (
        !palavras &&
        !significado
    ) {

        resumo.textContent =
            "✎ Clique aqui para escrever seu estudo...";

    }

}



/* =========================================
   CARREGAR DADOS DA CARTA
========================================= */

async function carregarCarta(
    id,
    card
) {

    const resultado =
        await supabaseClient
            .from("cartas")
            .select("*")
            .eq("id", id)
            .maybeSingle();


    if (resultado.error) {

        console.error(
            "Erro ao carregar carta:",
            resultado.error
        );

        return;
    }


    if (!resultado.data) {

        return;
    }


    atualizarCarta(

        id,

        resultado.data.palavras || "",

        resultado.data.significado || ""

    );

}



/* =========================================
   CRIAR CARTAS
========================================= */

function criarCartas(naipe) {

    const container =
        document.getElementById(
            "cards-" + naipe
        );


    if (!container) {

        console.error(
            "Container não encontrado:",
            naipe
        );

        return;
    }


    cartas.forEach(
        (numero, index) => {

            const id =
                gerarId(
                    naipe,
                    index
                );


            const carta =
                document.createElement(
                    "article"
                );


            carta.className =
                "card";


            carta.dataset.cardId =
                id;


            carta.innerHTML = `

                <div class="card-number">
                    ${index + 1}/14
                </div>

                <div class="card-symbol">
                    ${naipes[naipe].simbolo}
                </div>

                <h3>
                    ${numero} de ${naipes[naipe].nome}
                </h3>

                <div
                    class="card-resumo"
                    role="button"
                    tabindex="0"
                    title="Clique para editar"
                >
                    ✎ Clique aqui para escrever seu estudo...
                </div>

            `;


            const resumo =
                carta.querySelector(
                    ".card-resumo"
                );


            /* Clique no texto */

            resumo.addEventListener(
                "click",
                () => {

                    abrirEditor(
                        id,
                        naipe,
                        numero
                    );

                }
            );


            /* Teclado */

            resumo.addEventListener(
                "keydown",
                (evento) => {

                    if (
                        evento.key === "Enter" ||
                        evento.key === " "
                    ) {

                        evento.preventDefault();


                        abrirEditor(
                            id,
                            naipe,
                            numero
                        );

                    }

                }
            );


            container.appendChild(
                carta
            );


            carregarCarta(
                id,
                carta
            );

        }
    );

}



/* =========================================
   BOTÕES DO EDITOR
========================================= */

document
    .getElementById("fechar-editor")
    .addEventListener(
        "click",
        fecharEditor
    );


document
    .getElementById("salvar-editor")
    .addEventListener(
        "click",
        salvarEditor
    );



/* =========================================
   FECHAR CLICANDO FORA
========================================= */

document
    .getElementById("editor")
    .addEventListener(
        "click",
        (evento) => {

            if (
                evento.target.id === "editor"
            ) {

                fecharEditor();

            }

        }
    );



/* =========================================
   CRIAR OS 56 ARC. MENORES
========================================= */

criarCartas("paus");

criarCartas("copas");

criarCartas("espadas");

criarCartas("ouros");