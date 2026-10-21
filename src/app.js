const express = require("express");
const ListaTarefas = require("./index");

const app = express();

app.use(express.json());

app.locals.listaTarefas = new ListaTarefas();

app.get("/", (req, res) => {
  res.status(200).json({ message: "API de tarefas funcionando." });
});

app.get("/tarefas", (req, res) => {
  res.status(200).json(req.app.locals.listaTarefas.listarTarefas());
});

app.get("/tarefas/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const tarefa = req.app.locals.listaTarefas.buscarTarefa(id);

    res.status(200).json(tarefa);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post("/tarefas", (req, res) => {
  try {
    const { descricao } = req.body;
    const tarefa = req.app.locals.listaTarefas.criarTarefa(descricao);

    res.status(201).json(tarefa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/tarefas/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const { descricao } = req.body;
    const tarefa = req.app.locals.listaTarefas.atualizarDescricao(id, descricao);

    res.status(200).json(tarefa);
  } catch (error) {
    if (error.message === "Tarefa não encontrada.") {
      return res.status(404).json({ error: error.message });
    }

    res.status(400).json({ error: error.message });
  }
});

app.patch("/tarefas/:id/concluir", (req, res) => {
  try {
    const id = Number(req.params.id);
    const tarefa = req.app.locals.listaTarefas.concluirTarefa(id);

    res.status(200).json(tarefa);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.patch("/tarefas/:id/reabrir", (req, res) => {
  try {
    const id = Number(req.params.id);
    const tarefa = req.app.locals.listaTarefas.reabrirTarefa(id);

    res.status(200).json(tarefa);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.delete("/tarefas/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const tarefa = req.app.locals.listaTarefas.excluirTarefa(id);

    res.status(200).json(tarefa);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

module.exports = app;
