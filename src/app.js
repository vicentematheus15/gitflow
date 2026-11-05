const express = require("express");
const tarefaRoutes = require("./routes/tarefaRoutes");
const tratarErros = require("./middlewares/tratarErros");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "API de tarefas funcionando." });
});

app.use("/tarefas", tarefaRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.use(tratarErros);

module.exports = app;
