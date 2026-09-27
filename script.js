const SUPABASE_URL = "https://zkvqnvhagkwgheeprrvg.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_aqZ68nmgiQ1ncyljak-fGg_YgTfHfqj";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const cartas = [
    "Ás", "2", "3", "4", "5", "6", "7",
    "8", "9", "10", "Valete", "Cavaleiro",
    "Rainha", "Rei"
];

const naipes = {
    paus: { nome: "Paus", simbolo: "♣" },
    copas: { nome: "Copas", simbolo: "♥" },
    espadas: { nome: "Espadas", simbolo: "♠" },
    ouros: { nome: "Ouros", simbolo: "♦" }
};

function limparNome(nome) {
    return nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
}


/* ==============================
   ABRIR EDITOR
============================== */

async function abrirEditor(id, naipe, numero) {

    document.getElementById("editor").classList.add("aberto");

    document.getElementById("editor-titulo").textContent =
        `${numero} de ${naipes[naipe].nome}`;

    document.getElementById("editor-id").value = id;
    document.getElementById("editor-naipe").value = naipe;
    document.getElementById("editor-numero").value = numero;

    document.getElementById("editor-palavras").value = "";
    document.getElementById("editor-significado").value = "";

    const { data, error } = await supabaseClient
        .from("cartas")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error(error);
        return;
    }

    if (data) {
        document.getElementById("editor-palavras").value =
            data.palavras || "";

        document.getElementById("editor-significado").value =
            data.significado || "";
    }
}


/* ==============================
   FECHAR EDITOR
============================== */

function fecharEditor() {
    document.getElementById("editor").classList.remove("aberto");
}


/* ==============================
   SALVAR
============================== */

async function salvarEditor() {

    const id =
        document.getElementById("editor-id").value;

    const naipe =
        document.getElementById("editor-naipe").value;

    const numero =
        document.getElementById("editor-numero").value;

    const palavras =
        document.getElementById("editor-palavras").value;

    const significado =
        document.getElementById("editor-significado").value;

    const status =
        document.getElementById("editor-status");

    status.textContent = "salvando...";

    const { error } = await supabaseClient
        .from("cartas")
        .upsert({
            id: id,
            naipe: naipe,
            numero: numero,
            palavras: palavras,
            significado: significado
        });

    if (error) {

        console.error(error);

        status.textContent = "❌ erro ao salvar";

        return;
    }

    status.textContent = "♡ salvo!";

    setTimeout(() => {
        fecharEditor();
        atualizarCarta(id, palavras, significado);
    }, 700);
}


/* ==============================
   ATUALIZAR CARTA NA TELA
============================== */

function atualizarCarta(id, palavras, significado) {

    const card =
        document.querySelector(`[data-card-id="${id}"]`);

    if (!card) return;

    const resumo =
        card.querySelector(".card-resumo");

    if (significado || palavras) {

        resumo.innerHTML = `
            ${palavras
                ? `<strong>✧ ${palavras}</strong><br><br>`
                : ""}
            ${significado
                ? significado.replace(/\n/g, "<br>")
                : ""}
        `;

    } else {

        resumo.innerHTML =
            "✎ Clique em EDITAR para adicionar seu estudo.";

    }
}


/* ==============================
   CRIAR CARTAS
============================== */

function criarCartas(naipe) {

    const container =
        document.getElementById("cards-" + naipe);

    cartas.forEach((numero, index) => {

        const id =
            naipe + "_" + limparNome(numero);

        const carta =
            document.createElement("article");

        carta.className = "card";

        carta.dataset.cardId = id;

        carta.innerHTML = `

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
        onclick="abrirEditor(
            '${id}',
            '${naipe}',
            '${numero}'
        )"
    >
        ✎ Clique aqui para escrever seu estudo...
    </div>

`;
.card-resumo {
    min-height: 80px;

    padding: 12px;

    margin-top: 10px;

    border: 1px dashed #68314f;

    background: #0d070f;

    color: #ead7e3;

    cursor: text;

    white-space: normal;
}

.card-resumo:hover {
    border-color: #d85a91;
}