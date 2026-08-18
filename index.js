let listaTarefas = [];

function criarTarefa(descricao) {
    const novaTarefa = {
    id: listaTarefas.length + 1,
    descricao: descricao,
    concluida: false 
};

listaTarefas.push(novaTarefa);
};
