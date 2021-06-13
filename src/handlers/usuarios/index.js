// Falta agregar middlewares de validadores

const express = require("express");

const database = require("../../database");
const requestHandler = require("../../middlewares/requestHandler");

const usuariosRouting = express.Router();

usuariosRouting.get(
  "/usuarios/",
  requestHandler(async (req, res) => {
    const dni_usuario = req.session.dni_usuario;
    const usuario = await database.obtenerUsuarioporDNI(dni_usuario);

    res.json(usuario);
  })
);

module.exports = usuariosRouting;
