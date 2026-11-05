class ErroValidacao extends Error {
  constructor(message) {
    super(message);
    this.name = "ErroValidacao";
  }
}

class ErroNaoEncontrado extends Error {
  constructor(message = "Tarefa não encontrada.") {
    super(message);
    this.name = "ErroNaoEncontrado";
  }
}

module.exports = { ErroValidacao, ErroNaoEncontrado };
