let listaTarefas = [];

function criarTarefa(descricao) {
    const novaTarefa = {
    id: listaTarefas.length + 1,
    descricao: descricao,
    concluida: false 
};

listaTarefas.push(novaTarefa);
};


function listarTarefas() {
    console.log(listaTarefas);
}

function concluirTarefa(id) {
    const tarefa = listaTarefas.find(tarefa => tarefa.id === id);

    if (tarefa) {
        tarefa.concluida = true;
    } else {
        console.log("Tarefa não encontrada.");
    }
}

function excluirTarefa(id) {
    listaTarefas = listaTarefas.filter(tarefa => tarefa.id !== id);
}

function atualizarDescricao(id, novaDescricao) {
    const tarefa = listaTarefas.find(tarefa => tarefa.id === id);

    if (tarefa) {
        tarefa.descricao = novaDescricao;
    } else {
        console.log("Tarefa não encontrada.");
    }
}


function reabrirTarefa(id) {
    const tarefa = listaTarefas.find(tarefa => tarefa.id === id);

    if (tarefa) {
        tarefa.concluida = true;
    } else {
        console.log("Tarefa não encontrada.");
    }
}


function buscarTarefa(id) {
    const tarefa = listaTarefas.find(tarefa => tarefa.id === id);

    if (tarefa) {
        console.log(tarefa.descricao);
    } else {
        console.log("Tarefa não encontrada.");
    }
}