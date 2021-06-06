const validarTitulo = require("../../validations/tarea/validarTitulo");
const validateErrors = require("../../validations/validateErrors");

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
  "/tareas/add/:dni_usuario",
  validarTitulo,
  validateErrors,
  requestHandler(async (req, res) => {
    const dni_usuario = req.params.dni_usuario;
    const tarea = {
      dni_usuario,
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
    };

    const resul = await database.insertarTarea(tarea);

    res.json(resul);
  })
);

tareasRouting.delete(
  "/tareas/:id",
  requestHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    await database.remove(id);

    res.json({
      message: "Tarea eliminada",
    });
  })
);

tareasRouting.put(
  "/tareas/done/:id",
  requestHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    await database.complete(id);

    res.json({
      message: "Tarea completada",
    });
  })
);

module.exports = tareasRouting;
