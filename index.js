import express from "express";
import autenticar from "./segurança/autenticar.js";
import session from "express-session";

const porta = 3000;
const localhost = "0.0.0.0"; 

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "m1Nh4Ch4v353cR3t4",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 15
    }
}));

app.get("/login", (requisicao, resposta) => {
    resposta.redirect('/login.html');
});

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect('/login.html');
});

app.get("/sessao", (req, res) => {
    res.json({ autenticado: req.session.autenticado || false });
});

app.post("/login", (requisicao, resposta) => {
    const usuario = requisicao.body.usuario;
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;

    if (usuario === "admin" && email === "admin@email.com" && senha === "admin123") {
        requisicao.session.autenticado = true;
        console.log("Usuário autenticado:", requisicao.session); // Verifica a sessão
        resposta.redirect('/detalhes.html');
    } else {
        console.log("Falha na autenticação:", requisicao.body); //  Verifica os dados recebidos
        resposta.redirect('/login.html');
    }
});

app.use(express.static('./publico'));

// Middleware de autenticação para as páginas protegidas
app.use((requisicao, resposta, next) => {
    if (!requisicao.session.autenticado) {
        resposta.redirect('/login.html');
    } else {
        next();
    }
});

// Direcionando as páginas protegidas para o diretório privado
app.use("/privado", express.static("./privado"));

// Para permitir o acesso às páginas privadas
app.get("/privado/detalhes.html", (requisicao, resposta) => {
    resposta.sendFile(__dirname + "/privado/detalhes.html");
});

app.get("/privado/cadastro.html", (requisicao, resposta) => {
    resposta.sendFile(__dirname + "/privado/cadastro.html");
});

app.listen(porta, localhost, () => {
    console.log(`Servidor rodando em http://${localhost}:${porta}`);
});
