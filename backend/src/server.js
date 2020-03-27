const app = require('./app');

app.listen(3333, (error) => {
  return console.log(error
    ? "[ERRO] Servidor não inicializado!"
    : "Servidor rodando na porta 3333 http://localhost:3333/"
  );
});