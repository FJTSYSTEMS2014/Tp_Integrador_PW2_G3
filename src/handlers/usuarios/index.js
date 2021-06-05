// Falta agregar middlewares de validadores

const express = require("express");

const database = require("../../database");
const requestHandler = require("../../middlewares/requestHandler");

const usuariosRouting = express.Router();

usuariosRouting.get(
  "/usuarios/:dni_usuario",
  requestHandler(async (req, res) => {
    const { dni_usuario } = req.params;
    const usuario = await database.obtenerUsuarioporDNI(dni_usuario);

    res.json(usuario);
  })
);

module.exports = usuariosRouting;
