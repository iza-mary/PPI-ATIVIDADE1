export default function autenticar(requisicao, resposta, next) {
    if (requisicao.session && requisicao.session.autenticado) {
        return next(); // Usuário autenticado, pode acessar
    }
    resposta.redirect("/login"); // Redireciona se não estiver autenticado
}
