const mysql = require("mysql2/promise");
const { DB_CONFIG } = require("./config");

// mysql en base a la documentacion:
//https://www.npmjs.com/package/mysql
// const connection = mysql.createConnection(DB_CONFIG);

// inicializo variable para darle valor en la función initConnection
let connection;

function obtenerFecha() {
  const fecha_actual = new Date();

  const dia = fecha_actual.getDate();
  const mes = fecha_actual.getMonth() + 1;
  const anio = fecha_actual.getFullYear();
  const fecha_completa = anio + "-" + mes + "-" + dia;

  return fecha_completa;
}

module.exports = {
  // conexión a la base de datos, con la configuración guardada en config.js
  async initConnection() {
    connection = await mysql.createConnection(DB_CONFIG);
  },
  // recibe un dni de usuario y devuelve todas las tareas asociadas que no tengan baja lógica
  async obtenerTareaporDNI(dni_usuario) {
    let tareas = [];
    [tareas] = await connection.execute(
      "SELECT * FROM tareas WHERE dni_usuario = ? AND estado <> 'eliminada'",
      [dni_usuario]
    );

    return tareas;
  },
  // recibe un id de tarea y devuelve su información
  async obtenerTareaporId(id) {
    let tarea = [];
    [tarea] = await connection.execute("SELECT * FROM tareas WHERE id = ?", [
      id,
    ]);

    if (tarea.length) {
      return tarea[0];
    } else {
      return undefined;
    }
  },

  // recibe dni de usuario e inserta una nueva tarea en la base de datos,
  // capturando la información que viene en el body
  async insertarTarea(tarea) {
    fecha = obtenerFecha();

    const result = await connection.execute(
      "INSERT INTO tareas (dni_usuario, titulo, descripcion, estado, created, updated, eliminated) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        tarea.dni_usuario,
        tarea.titulo,
        tarea.descripcion,
        "pendiente",
        fecha,
        fecha,
        null,
      ]
    );

    return await this.obtenerTareaporId(result[0].insertId);
  },

  async update(task) {
    const { id, titulo, descripcion } = task;

    const tarea = await this.obtenerTareaporId(id);

    if (!tarea) {
      throw new Error(`No existe una tarea con id "${id}`);
    }

    const fecha = obtenerFecha();

    const result = await connection.execute(
      "UPDATE tareas SET titulo = ?, descripcion = ?, updated = ? WHERE id = ?",
      [titulo, descripcion, fecha, id]
    );

    return result[0].affectedRows;
  },

  // recibe user y password y devuelve un usuario, o undefined en caso contrario
  async buscarUsuarioPorUserPass(username, password) {
    const [usuario] = await connection.execute(
      "SELECT * FROM usuarios WHERE username = ? AND pass = ?",
      [username, password]
    );
    if (usuario.length) {
      return usuario[0];
    } else {
      return undefined;
    }
  },
  // recibe dni de un usuario y devuelve su información, o undefined en caso contrario
  async obtenerUsuarioporDNI(dni_usuario) {
    const [usuario] = await connection.execute(
      "SELECT * FROM usuarios WHERE dni_usuario = ?",
      [dni_usuario]
    );
    if (usuario.length) {
      return usuario[0];
    } else {
      return undefined;
    }
  },
  // Elimina una tarea - Recibe el id a eliminar
  async remove(id) {
    const tarea = await this.obtenerTareaporId(id);

    if (!tarea) {
      throw new Error(`No existe una tarea con id "${id}`);
    }

    const fecha = obtenerFecha();
    await connection.execute(
      "UPDATE tareas SET estado = 'eliminada', eliminated = ? WHERE id = ?",
      [fecha, id]
    );
  },
  // Cambia estado de una tarea a completada
  async complete(id) {
    const tarea = await this.obtenerTareaporId(id);

    if (!tarea) {
      throw new Error(`No existe una tarea con id "${id}`);
    }

    const fecha = obtenerFecha();

    await connection.execute(
      "UPDATE tareas SET estado = 'completada', updated = ? WHERE id = ?",
      [fecha, id]
    );
  },
};

// // leer un usuario por DNI sin contraseña y pass
// app.get("/usuarios_pass/:dni", (req, res) => {
//   const { dni } = req.params;
//   const sql = `SELECT username,pass FROM usuarios WHERE dni_usuario= ${dni}`;
//   connection.query(sql, (err, resultado) => {
//     if (!err) {
//       res.status(200).send({
//         Observaciones: `El Usuario y Password que corresponde al DNI: ${dni} es:`,
//         resultado,
//       });
//     } else {
//       console.log(err);
//       res.status(404).send({
//         Observaciones: `Se encontraron los siguientes errores: `,
//         err,
//       });
//     }
//   });
// });

// // agregar usuarios
// //--  insert  en tabla usuarios
// app.post("/add_usuarios", (req, res) => {
//   // const sql_id = 'SELECT MAX(id) FROM usuarios';
//   // id:sql_id+1,

//   const sql = "INSERT INTO usuarios SET ?";
//   const info = {
//     dni_usuario: req.body.dni_usuario,
//     nombre_apellido: req.body.nombre_apellido,
//     fecha_nacimiento: req.body.fecha_nacimiento,
//     domicilio: req.body.domicilio,
//     localidad: req.body.localidad,
//     telefono: req.body.telefono,
//     username: req.body.username,
//     pass: req.body.pass,
//   };
//   connection.query(sql, info, (err) => {
//     if (err) {
//       console.log(err);
//       res.status(404).send({
//         Observaciones: `Se encontraron los siguientes errores: `,
//         err,
//       });
//     } else {
//       console.log(" usuario ");
//       res.status(200).send({
//         Observaciones: `Se agrego el usuario `,
//         info,
//       });
//     }
//   });
// });

// //actualizar usuario
// app.put("/update_usuario/:dni", (req, res) => {
//   const { dni } = req.params;
//   console.log(req.body);

//   const {
//     nombre_apellido,
//     fecha_nacimiento,
//     domicilio,
//     localidad,
//     telefono,
//     username,
//     pass,
//   } = req.body;

//   const sql = ` UPDATE usuarios SET  nombre_apellido='${nombre_apellido}', fecha_nacimiento='${fecha_nacimiento}', domicilio='${domicilio}',
//       localidad='${localidad}', telefono='${telefono}', username='${username}', pass='${pass}'  WHERE dni_usuario='${dni}' `;
//   connection.query(sql, (err) => {
//     console.log(err);
//     if (err) throw err;
//     res.send(` dni=${dni} usuario modificado`);
//     console.log(` dni=${dni} usuario modificado`);
//   });
// });

// app.delete("/delete_usuario/:dni", (req, res) => {
//   const { dni } = req.params;
//   const sql = `DELETE FROM usuarios WHERE dni_usuario=${dni}`;
//   connection.query(sql, (err) => {
//     if (err) {
//       console.log(err);
//       res.status(404).send({
//         Observaciones: `Se encontraron los siguientes errores: `,
//         err,
//       });
//     } else {
//       res.status(200).send({
//         Observaciones: `El usuario con DNI: ${dni} fue eliminado `,
//       });
//       console.info(` El usuario con  DNI= ${dni} fue eliminando`);
//     }
//   });
// });
