const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const database = require("../database");
const requestHandler = require("../middlewares/requestHandler");

const autenticarRouting = express.Router();

autenticarRouting.post(
  "/login",
  requestHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await database.buscarUsuarioPorUserPass(username, password);

    if (user) {
      // Usuario válido
      const accessToken = jwt.sign(
        {
          username,
          dni_usuario: user.dni_usuario,
        },
        JWT_SECRET,
        {
          expiresIn: "30m",
        }
      );
      res.json({
        accessToken,
        status: "Logged in",
        dni_usuario: user.dni_usuario,
      });
    } else {
      // Usuario inválido
      res.status(401).json({
        error: "Usuario o contraseña incorrecto",
        status: "error",
      });
    }
  })
);

module.exports = autenticarRouting;
