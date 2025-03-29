import express from "express";
import session from "express-session";
import path from "path";
import autenticar from "./segurança/autenticar.js"; 

const porta = 3000;
const localhost = "0.0.0.0";

const app = express();

app.use(express.urlencoded({ extended: true })); 

app.use(
  session({
    secret: "m1Nh4Ch4v3S3cR3t4", // chave secreta para a sessão
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 15, // 15 minutos de sessão
    },
  })
);


app.get("/login", (requisicao, resposta) => {
  resposta.sendFile(path.join(__dirname, "publico", "login.html")); 
});


app.post("/login", (requisicao, resposta) => {
    const usuario = requisicao.body.usuario;
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;

    if (usuario === "admin" && email === "admin@email.com" && senha === "admin321") {
        requisicao.session.autenticado = true;
        resposta.redirect("/privado/detalhes.html");  
    } else {
        resposta.redirect("/login.html");
    }
});



app.get("/logout", (requisicao, resposta) => {
  requisicao.session.destroy();
  resposta.redirect("/login"); 
});


app.get("/sessao", (req, res) => {
  res.json({ autenticado: req.session.autenticado || false });
});


app.use(express.static("./publico")); 

app.use("/privado", autenticar); 
app.use("/privado", express.static("./privado")); 

// Rota para a página cadastro.html com autenticação
app.get("/cadastro", autenticar, (requisicao, resposta) => {
  resposta.sendFile(path.join(__dirname, "publico", "cadastro.html")); 
});


app.get("/testar-autenticacao", autenticar, (req, res) => {
  res.send("Você está autenticado!");
});

app.listen(porta, localhost, () => {
  console.log(`Servidor rodando em http://${localhost}:${porta}`);
});
