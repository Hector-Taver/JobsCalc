const express = require("express");
const path = require("path");
const routes = require("./routes.js");

const server = express();

// Usando template engine
server.set("view engine", "ejs");

// Mudar a localização da pasta views
server.set("views", path.join(__dirname, "views"));

// Habilitar arquivos statics
server.use(express.static("public"));

// Usar o request.body
server.use(express.urlencoded({ extended: true }));

// Rotas
server.use(routes);

server.listen(3000, () => console.log("Server is running in localhost:3000"));
