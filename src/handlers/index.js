const express = require("express");
const database = require("../database");
const autenticarJWT = require("../middlewares/autenticarJWT");
const { ValidationError } = require("../validations/validationError");

const autenticarRouting = require("./autenticar");

const tareasRouting = require("./tareas");
const usuariosRouting = require("./usuarios");
const apiRouting = express.Router();

apiRouting.use(
  "/api",
  autenticarRouting,
  autenticarJWT,
  tareasRouting,
  usuariosRouting
);

apiRouting.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({
      status: "error",
      error: err.formatErrors(),
    });
  }
});

module.exports = apiRouting;
