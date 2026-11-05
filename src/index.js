class ListaTarefas {
  constructor() {
    this.tarefas = [];
    this.proximoId = 1;
  }

  criarTarefa(descricao) {
    if (typeof descricao !== "string" || descricao.trim() === "") {
      throw new Error("A descrição da tarefa é obrigatória.");
    }

    const novaTarefa = {
      id: this.proximoId++,
      descricao: descricao.trim(),
      concluida: false
    };

    this.tarefas.push(novaTarefa);
    return novaTarefa;
  }

  listarTarefas() {
    return this.tarefas;
  }

  buscarTarefa(id) {
    const tarefa = this.tarefas.find(tarefa => tarefa.id === id);

    if (!tarefa) {
      throw new Error("Tarefa não encontrada.");
    }

    return tarefa;
  }

  atualizarDescricao(id, novaDescricao) {
    if (typeof novaDescricao !== "string" || novaDescricao.trim() === "") {
      throw new Error("A descrição da tarefa é obrigatória.");
    }

    const tarefa = this.buscarTarefa(id);
    tarefa.descricao = novaDescricao.trim();

    return tarefa;
  }

  concluirTarefa(id) {
    const tarefa = this.buscarTarefa(id);
    tarefa.concluida = true;

    return tarefa;
  }

  reabrirTarefa(id) {
    const tarefa = this.buscarTarefa(id);
    tarefa.concluida = false;

    return tarefa;
  }

  excluirTarefa(id) {
    const tarefa = this.buscarTarefa(id);
    this.tarefas = this.tarefas.filter(t => t.id !== id);

    return tarefa;
  }
}

module.exports = ListaTarefas;