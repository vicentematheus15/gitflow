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
        tarefa.concluida = false;
    } else {
        console.log("Tarefa não encontrada.");
    }
}


function buscarTarefa(id) {
    const tarefa = listaTarefas.find(tarefa => tarefa.id === id);

    if (tarefa) {
        console.log(tarefa);
    } else {
        console.log("Tarefa não encontrada.");
    }
}

// Utilitário exclusivo para os testes: reseta o estado do módulo entre os casos,
// já que `listaTarefas` é um estado compartilhado em memória (sem persistência).
function _resetListaTarefas() {
    listaTarefas = [];
}

export {
    criarTarefa,
    listarTarefas,
    concluirTarefa,
    excluirTarefa,
    atualizarDescricao,
    reabrirTarefa,
    buscarTarefa,
    listaTarefas,
    _resetListaTarefas
};
