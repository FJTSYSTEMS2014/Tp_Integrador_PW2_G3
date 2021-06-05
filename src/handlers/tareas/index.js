// Falta incorporar validadores como middlewares

const express = require("express");

const database = require("../../database");
const requestHandler = require("../../middlewares/requestHandler");

const tareasRouting = express.Router();

// obtener tarea por DNI de usuario
tareasRouting.get(
  "/tareas/:dni_usuario",
  requestHandler(async (req, res) => {
    const { dni_usuario } = req.params;
    const tareas = await database.obtenerTareaporDNI(dni_usuario);

    res.json(tareas);
  })
);

// // agregar tareas
// //--  insert  en tabla tareas
tareasRouting.post(
  "/tareas/add",
  requestHandler(async (req, res) => {
    const tarea = req.body.tarea;
    const resul = await database.insertarTarea(tarea);

    res.json(resul);
  })
);

module.exports = tareasRouting;
