// ======================================================
// CONFIGURAÇÃO
// ======================================================

const SUPABASE_URL = "https://zkvqnvhagkwgheeprrvg.supabase.co";
const SUPABASE_KEY = "sb_publishable_aqZ68nmgiQ1ncyljak-fGg_YgTfHfqj";

// Cria conexão com o Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ======================================================
// CONFIGURAÇÃO DO GITHUB
// ======================================================

// Seu GitHub Pages
const GITHUB_USER = "demarkkkko";

// Se o site estiver no repositório demarkkkko.github.io
const GITHUB_REPO = "demarkkkko.github.io";

// Arquivo que contém os dados das cartas.
// TROQUE caso o seu arquivo tenha outro nome.
const GITHUB_ARQUIVO = "cartas.json";

// Branch principal
const GITHUB_BRANCH = "main";


// ======================================================
// LER CARTAS DO GITHUB
// ======================================================

async function carregarDoGitHub() {

    const url =
        `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_ARQUIVO}`;

    try {

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error(
                `GitHub respondeu com ${resposta.status}`
            );
        }

        const dados = await resposta.json();

        console.log("Cartas carregadas do GitHub:", dados);

        return dados;

    } catch (erro) {

        console.error("Erro ao carregar cartas do GitHub:", erro);

        return [];
    }
}


// ======================================================
// LER CARTAS DO SUPABASE
// ======================================================

async function carregarDoSupabase() {

    try {

        const { data, error } = await supabaseClient
            .from("cartas")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            throw error;
        }

        console.log("Cartas carregadas do Supabase:", data);

        return data || [];

    } catch (erro) {

        console.error(
            "Erro ao carregar cartas do Supabase:",
            erro
        );

        return [];
    }
}


// ======================================================
// CARREGAR DADOS
// ======================================================

async function carregarCartas() {

    // Primeiro tenta o Supabase
    const cartasSupabase = await carregarDoSupabase();

    if (cartasSupabase.length > 0) {

        console.log("Usando dados do Supabase.");

        return cartasSupabase;
    }


    // Se não tiver nada no Supabase,
    // usa o GitHub como banco inicial.

    console.log(
        "Supabase vazio. Carregando cartas do GitHub..."
    );

    return await carregarDoGitHub();
}


// ======================================================
// SALVAR UMA CARTA NO SUPABASE
// ======================================================

async function salvarCarta(carta) {

    try {

        const { data, error } = await supabaseClient
            .from("cartas")
            .upsert(
                carta,
                {
                    onConflict: "id"
                }
            )
            .select();

        if (error) {
            throw error;
        }

        console.log("Carta salva:", data);

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar carta:",
            erro
        );

        alert(
            "Não consegui salvar.\n\n" +
            erro.message
        );

        return false;
    }
}


// ======================================================
// EXEMPLO DE FUNÇÃO DO BOTÃO SALVAR
// ======================================================

async function salvarEditor() {

    // Pega o ID da carta
    const idElement =
        document.getElementById("editor-id");

    // Pega os campos do editor
    const palavrasElement =
        document.getElementById("editor-palavras");

    const significadoElement =
        document.getElementById("editor-significado");


    if (!idElement) {
        console.error(
            "Não encontrei #editor-id"
        );
        return;
    }

    if (!palavrasElement) {
        console.error(
            "Não encontrei #editor-palavras"
        );
        return;
    }

    if (!significadoElement) {
        console.error(
            "Não encontrei #editor-significado"
        );
        return;
    }


    const carta = {

        id: Number(idElement.value),

        palavras: palavrasElement.value,

        significado: significadoElement.value
    };


    console.log(
        "Tentando salvar:",
        carta
    );


    const sucesso =
        await salvarCarta(carta);


    if (sucesso) {

        alert("💾 Salvo com sucesso!");

    }
}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Sistema de Tarot iniciado."
        );

        const cartas =
            await carregarCartas();

        console.log(
            "Total de cartas:",
            cartas.length
        );

    }
);