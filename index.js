import express from "express";
import autenticar from "./seguranca/autenticar.js";


const porta = 3000;
const localhost = "0.0.0.0"; 

const app = express();

app.use(express.static('./publico'));



app.use(autenticar, express.static("./privado"));

app.listen(porta, localhost, () => {
    console.log(`Servidor rodando em http://${localhost}:${porta}`);
});