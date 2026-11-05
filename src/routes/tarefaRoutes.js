const express = require("express");
const service = require("../services/tarefaService");

const router = express.Router();

// Repassa erros de funções async para o middleware de erros (Express 4 não faz isso sozinho).
const comTratamento = handler => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const lerId = req => Number(req.params.id);

router.get(
  "/",
  comTratamento(async (req, res) => {
    res.status(200).json(await service.listarTarefas());
  })
);

router.get(
  "/:id",
  comTratamento(async (req, res) => {
    res.status(200).json(await service.buscarTarefa(lerId(req)));
  })
);

router.post(
  "/",
  comTratamento(async (req, res) => {
    const tarefa = await service.criarTarefa(req.body?.descricao);
    res.status(201).json(tarefa);
  })
);

router.put(
  "/:id",
  comTratamento(async (req, res) => {
    const tarefa = await service.atualizarDescricao(
      lerId(req),
      req.body?.descricao
    );
    res.status(200).json(tarefa);
  })
);

router.patch(
  "/:id/concluir",
  comTratamento(async (req, res) => {
    res.status(200).json(await service.concluirTarefa(lerId(req)));
  })
);

router.patch(
  "/:id/reabrir",
  comTratamento(async (req, res) => {
    res.status(200).json(await service.reabrirTarefa(lerId(req)));
  })
);

router.delete(
  "/:id",
  comTratamento(async (req, res) => {
    res.status(200).json(await service.excluirTarefa(lerId(req)));
  })
);

module.exports = router;
