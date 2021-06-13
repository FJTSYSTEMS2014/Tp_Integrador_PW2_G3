const validarTitulo = require("../../validations/tarea/validarTitulo");
const validateErrors = require("../../validations/validateErrors");

const express = require("express");

const database = require("../../database");
const requestHandler = require("../../middlewares/requestHandler");

const tareasRouting = express.Router();

// obtener tarea por DNI de usuario
tareasRouting.get(
  "/tareas/",
  requestHandler(async (req, res) => {
    const dni_usuario = req.session.dni_usuario;
    const tareas = await database.obtenerTareaporDNI(dni_usuario);

    res.json(tareas);
  })
);

// obtener tarea por id
tareasRouting.get(
  "/tareas/obtener/:tarea_id",
  requestHandler(async (req, res) => {
    const { tarea_id } = req.params;
    const tarea = await database.obtenerTareaporId(tarea_id);

    res.json(tarea);
  })
);

// // agregar tareas
// //--  insert  en tabla tareas
tareasRouting.post(
  "/tareas/add/",
  validarTitulo,
  validateErrors,
  requestHandler(async (req, res) => {
    const dni_usuario = req.session.dni_usuario;
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

tareasRouting.put(
  "/tareas/edit/:id",
  validarTitulo,
  validateErrors,
  requestHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const task = {
      id,
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
    };

    const affectedRows = await database.update(task);

    res.json({
      message: "Tarea editada",
      filas_afectadas: affectedRows,
    });
  })
);

module.exports = tareasRouting;
