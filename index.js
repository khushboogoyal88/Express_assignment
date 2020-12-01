"use strict";

const http = require("http");
const path = require("path");

const express = require("express");
const app = express();

const { port, host, storage } = require("./serverConfig.json");

const { createDataStorage } = require(path.join(
  __dirname,
  storage.storageFolder,
  storage.dataLayer
));

const dataStorage = createDataStorage();

const server = http.createServer(app);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pageviews"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const menuPath = path.join(__dirname, "menu.html");

app.get("/", (req, res) => res.sendFile(menuPath));

app.get("/all", (req, res) =>
  dataStorage
    .getAll()
    .then((data) =>
      res.render("allGames", { result: data.map((game) => createGame(game)) })
    )
);

app.get("/getGame", (req, res) =>
  res.render("getGame", {
    title: "Get",
    header: "Get Game",
    action: "/getGame",
  })
);

app.post("/getGame", (req, res) => {
  if (!req.body) res.sendStatus(500);

  const number = req.body.number;
  dataStorage
    .get(number)
    .then((game) => res.render("gamePage", { result: createGame(game) }))
    .catch((error) => sendErrorPage(res, error));
});

app.get("/inputform", (req, res) =>
  res.render("form", {
    title: "Add game",
    header: "Add a new game",
    action: "/insert",
    number: { value: "", readonly: "" },
    name: { value: "", readonly: "" },
    year: { value: "", readonly: "" },
    quantity: { value: "", readonly: "" },
    genre: { value: "", readonly: "" },
  })
);

app.post("/insert", (req, res) => {
  if (!req.body) res.sendStatus(500);

  dataStorage
    .insert(createGame(req.body))
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});

app.get("/updateform", (req, res) =>
  res.render("form", {
    title: "Update game",
    header: "Update game data",
    action: "/updatedata",
    number: { value: "", readonly: "" },
    name: { value: "", readonly: "readonly" },
    year: { value: "", readonly: "readonly" },
    quantity: { value: "", readonly: "readonly" },
    genre: { value: "", readonly: "readonly" },
  })
);

app.post("/updatedata", (req, res) => {
  if (!req.body) res.sendStatus(500);
  dataStorage
    .get(req.body.number)
    .then((game) => createGame(game))
    .then((game) =>
      res.render("form", {
        title: "Update game",
        header: "Update game data",
        action: "/updategame",
        number: { value: game.number, readonly: "readonly" },
        name: { value: game.name, readonly: "" },
        year: { value: game.year, readonly: "" },
        quantity: { value: game.quantity, readonly: "" },
        genre: { value: game.genre, readonly: "" },
      })
    )
    .catch((error) => sendErrorPage(res, error));
});

app.post("/updategame", (req, res) => {
  if (!req.body) res.sendStatus(500);
  else
    dataStorage
      .update(createGame(req.body))
      .then((status) => sendStatusPage(res, status))
      .catch((error) => sendErrorPage(res, error));
});

app.get("/removegame", (req, res) =>
  res.render("getGame", {
    title: "Remove",
    header: "Remove a game",
    action: "/removegame",
  })
);

app.post("/removegame", (req, res) => {
  if (!req.body) res.sendStatus(500);
  const number = req.body.number;
  dataStorage
    .remove(number)
    .then((status) => sendStatusPage(res, status))
    .catch((error) => sendErrorPage(res, error));
});

server.listen(port, host, () => console.log(`Server ${host}:${port} running`));

function sendErrorPage(res, error, title = "Error", header = "Error") {
  sendStatusPage(res, error, title, header);
}

function sendStatusPage(res, status, title = "Status", header = "Status") {
  return res.render("statusPage", { title, header, status });
}

function createGame(game) {
  return {
    number: game.number,
    firstname: game.name,
    lastname: game.year,
    department: game.quantity,
    salary: game.genre,
  };
}
