const express = require("express");
const server = express();

/// Configurações
server.use(express.json());

/// Valor Padrão
let countRequest = 0;
const lstProjects = [
  {
    id: "1",
    title: "Projeto CRUD",
    tasks: ["Criar", "Ler", "Atualizar", "Deletar"]
  },
  { id: "2", title: "Novo projeto", tasks: ["Nova atividade"] }
];

/// Middlewares

server.use((req, res, next) => {
  console.time("Request");
  countRequest++;
  console.log(`Quantidade de Request: ${countRequest}; `);

  next();

  console.timeEnd("Request");
});

function checkProjectInArray(req, res, next) {
  const projectIndex = lstProjects.findIndex(f => {
    return f.id === req.params.id;
  });

  if (projectIndex === -1) {
    return res.status(400).json({ error: "Não existe projeto com esse id." });
  }

  req.projectIndex = projectIndex;
  req.project = lstProjects[projectIndex];

  return next();
}

function checkIDNotInArray(req, res, next) {
  const projectIndex = lstProjects.findIndex(f => {
    return f.id === req.body.id;
  });

  if (projectIndex >= 0) {
    return res.status(400).json({ error: "Já existe esse id de projeto." });
  }

  return next();
}

/// Métodos REST

server.get("/projects", (req, res) => {
  return res.json(lstProjects);
});

server.get("/projects/:id", checkProjectInArray, (req, res) => {
  return res.json(req.project);
});

server.post("/projects", checkIDNotInArray, (req, res) => {
  const { id, title } = req.body;

  lstProjects.push(
    JSON.parse(`{ "id":"${id}", "title":"${title}", "tasks":[] }`)
  );

  return res.json(lstProjects);
});

server.post("/projects/:id/tasks", checkProjectInArray, (req, res) => {
  const { title } = req.body;

  lstProjects[req.projectIndex].tasks.push(title);

  return res.json(lstProjects);
});

server.put("/projects/:id", checkProjectInArray, (req, res) => {
  const { title } = req.body;

  lstProjects[req.projectIndex].title = title;

  return res.json(lstProjects);
});

server.delete("/projects/:id", checkProjectInArray, (req, res) => {
  lstProjects.splice(req.projectIndex, 1);

  return res.send();
});

server.delete("/projects/:id/tasks", checkProjectInArray, (req, res) => {
  lstProjects[req.projectIndex].tasks = [];

  return res.send();
});

server.listen(3000);
