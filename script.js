// ===== CARREGAR DADOS DO LOCALSTORAGE =====
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;
let publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];


// ===== CADASTRO =====
function cadastrar() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value.trim();
    const tipo = document.getElementById("tipoPerfil") ? document.getElementById("tipoPerfil").value : "usuario";

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se o email já existe
    if (usuarios.some(u => u.email === email)) {
        alert("Este e-mail já está cadastrado!");
        return;
    }

    // Salva novo usuário
    usuarios.push({ nome, email, senha, tipo });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
}


// ===== LOGIN =====
function login() {
    const email = document.getElementById("emailLogin").value.trim().toLowerCase();
    const senha = document.getElementById("senhaLogin").value.trim();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const user = usuarios.find(u =>
        u.email.toLowerCase().trim() === email &&
        u.senha.trim() === senha
    );

    if (!user) {
        alert("Email ou senha incorretos!");
        return;
    }

    // Salva o usuário logado
    localStorage.setItem("usuarioLogado", JSON.stringify(user));
    window.location.href = "perfil.html";
}


// ===== PERFIL DO USUÁRIO =====
function carregarPerfil() {
    const user = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!user) {
        alert("Você precisa estar logado para acessar o perfil!");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("nomePerfil").textContent = user.nome;
    document.getElementById("emailPerfil").textContent = user.email;
    document.getElementById("tipoPerfil").textContent = user.tipo === "doador" ? "Doador" : "Usuário";

    if (document.getElementById("fotoPerfil"))
        document.getElementById("fotoPerfil").src = "perfil.png";
}


// ===== LISTA DE DOADORES =====
function carregarDoadores() {
    const lista = document.getElementById("listaDoadores");
    if (!lista) return;

    lista.innerHTML = "";

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const doadores = usuarios.filter(u => u.tipo === "doador");

    doadores.forEach(d => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${d.nome}</strong><br>
            <small>${d.email}</small>
        `;
        lista.appendChild(li);
    });
}


// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}


// ===== PUBLICAÇÕES =====
function publicar() {
    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();

    if (!titulo || !descricao) {
        alert("Preencha título e descrição.");
        return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const novaPublicacao = {
        titulo,
        descricao,
        autor: usuario ? usuario.nome : "Anônimo",
        data: new Date().toLocaleDateString("pt-BR")
    };

    publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
    publicacoes.push(novaPublicacao);

    localStorage.setItem("publicacoes", JSON.stringify(publicacoes));

    alert("Publicação salva!");
    window.location.reload();
}


function carregarPublicacoes() {
    const lista = document.getElementById("listaPublicacoes");
    if (!lista) return;

    publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];
    lista.innerHTML = "";

    publicacoes.forEach((pub, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${pub.titulo}</strong> <br>
            ${pub.descricao} <br>
            <small>🧍 Autor: ${pub.autor} — 📅 ${pub.data}</small>
            <br><button onclick="deletarPublicacao(${index})" style="margin-top:6px;">Excluir</button>
        `;
        lista.appendChild(li);
    });
}


function deletarPublicacao(index) {
    publicacoes = JSON.parse(localStorage.getItem("publicacoes")) || [];

    if (confirm("Deseja excluir esta publicação?")) {
        publicacoes.splice(index, 1);
        localStorage.setItem("publicacoes", JSON.stringify(publicacoes));
        carregarPublicacoes();
    }
}
