/*  para ejecutar la aplicacion --> npm install -->  npm start  */
// requerir o importar express
const express = require ('express');
// requerir o importar mysql2
const mysql = require ('mysql2');
// nuevo para utilizar JWT
const jwt = require ('jsonwebtoken');
// el numero de puerto esta en config
const {PORT} = require ('./config/config');
// crear constante llamada app y generamos una instancia de express
const app = express ();

// utilizamos app.use y le pasamos bodyparser
app.use (express.json ());

// mysql en base a la documentacion:
//https://www.npmjs.com/package/mysql2

const connection = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  // En el password va tu contraseña de workbench
  password: 'TSCHERIG2002',
  // database: nombre de la base de datos utilizada en workbench
  database: 'grupo3',
});
// Primera Ruta
app.get ('/', (req, res) => {
  res.send ('Hola somos el grupo nº 3)');
});

// pedir tabla usuarios
////http://localhost:3000/usuarios
app.get ('/usuarios', (req, res) => {
  connection.query (
    'SELECT   dni_usuario,nombre_apellido, fecha_nacimiento, domicilio,localidad,telefono FROM usuarios',
    (err, resultado) => {
      if (!err) {
        res.status (200).send ({
          Observaciones: ` Se puede observar toda la información de la tabla USUARIOS: `,
          resultado,
        });
      } else {
        console.log (err);
        res.status (404).send ({
          Observaciones: `Se encontraron los siguientes errores: `,
          err,
        });
      }
    }
  );
});
// pedir tabla tareas
//http://localhost:3000/tareas
app.get ('/tareas', (req, res) => {
  connection.query ('SELECT * FROM tareas', (err, resultado) => {
    if (!err) {
      res.status (200).send ({
        Observaciones: `Todos los datos de la tabla TAREAS son: `,
        resultado,
      });
    } else {
      console.log (err);
      res.status (404).send ({
        Observaciones: `Se encontraron los siguientes errores: `,
        err,
      });
    }
  });
});
// leer un usuario por DNI sin contraseña y pass
app.get ('/usuarios/:dni', (req, res) => {
  const {dni} = req.params;
  const sql = `SELECT   nombre_apellido,
  fecha_nacimiento,
  domicilio,
  localidad,
  telefono FROM usuarios WHERE dni_usuario= ${dni}`;
  connection.query (sql, (err, resultado) => {
    if (!err) {
      res.status (200).send ({
        Observaciones: `El usuario con DNI: ${dni} es:`,
        resultado,
      });
    } else {
      console.log (err);
      res.status (404).send ({
        Observaciones: `Se encontraron los siguientes errores: `,
        err,
      });
    }
  });
});
// leer una tarea por dni
app.get ('/tarea/:dni', (req, res) => {
  const {dni} = req.params;
  const sql = `SELECT * FROM tareas WHERE dni_usuario= ${dni}`;
  connection.query (sql, (err, resultado) => {
    if (!err) {
      res.status (200).send ({
        Observaciones: ` la TAREA para el usuario  con DNI : ${dni} es:`,
        resultado,
      });
    } else {
      console.log (err);
      res.status (404).send ({
        Observaciones: `Se encontraron los siguientes errores: `,
        err,
      });
    }
  });
});
// leer un usuario por DNI sin contraseña y pass
app.get ('/usuarios_pass/:dni', (req, res) => {
  const {dni} = req.params;
  const sql = `SELECT   username,pass FROM usuarios WHERE dni_usuario= ${dni}`;
  connection.query (sql, (err, resultado) => {
    if (!err) {
      res.status (200).send ({
        Observaciones: `El Usuario y Password que corresponde al DNI: ${dni} es:`,
        resultado,
      });
    } else {
      console.log (err);
      res.status (404).send ({
        Observaciones: `Se encontraron los siguientes errores: `,
        err,
      });
    }
  });
});
// agregar usuarios
//--  insert  en tabla usuarios
app.post ('/add_usuarios', (req, res) => {
  // const sql_id = 'SELECT MAX(id) FROM usuarios';
  // id:sql_id+1,

  const sql = 'INSERT INTO usuarios SET ?';
  const info = {
    dni_usuario: req.body.dni_usuario,
    nombre_apellido: req.body.nombre_apellido,
    fecha_nacimiento: req.body.fecha_nacimiento,
    domicilio: req.body.domicilio,
    localidad: req.body.localidad,
    telefono: req.body.telefono,
    username: req.body.username,
    pass: req.body.pass,
  };
  connection.query (sql, info, err => {
    if (err) {
      console.log (err);
      res.status (404).send ({
        Observaciones: `Se encontraron los siguientes errores: `,
        err,
      });
    } else {
      console.log (' usuario ');
      res.status (200).send ({
        Observaciones: `Se agrego el usuario `,
        info,
      });
    }
  });
});
// agregar tareas
//--  insert  en tabla tareas

app.post ('/add_tareas', (req, res) => {
  const sql = 'INSERT INTO tareas SET ?';
  const info = {
    dni_usuario: req.body.dni_usuario,
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    estado: req.body.estado,
    created: req.body.created,
    updated: req.body.updated,
    eliminated: req.body.eliminated,
  };
  connection.query (sql, info, err => {
    if (err) {
      console.log (err);
      res.status (404).send ({
        Observaciones: `Se encontraron los siguientes errores: `,
        err,
      });
    } else {
      res.status (200).send ({
        Observaciones: `la tarea nueva es: `,
        info,
      });
      console.log (' tarea actualizada');
    }
  });
});
//actualizar usuario
app.put ('/update_usuario/:dni', (req, res) => {
  const {dni} = req.params;
  console.log (req.body);

  const {
    nombre_apellido,
    fecha_nacimiento,
    domicilio,
    localidad,
    telefono,
    username,
    pass,
  } = req.body;

  const sql = ` UPDATE usuarios SET  nombre_apellido='${nombre_apellido}', fecha_nacimiento='${fecha_nacimiento}', domicilio='${domicilio}',
  localidad='${localidad}', telefono='${telefono}', username='${username}', pass='${pass}'  WHERE dni_usuario='${dni}' `;
  connection.query (sql, err => {
    console.log (err);
    if (err) throw err;
    res.send (` dni=${dni} usuario modificado`);
    console.log (` dni=${dni} usuario modificado`);
  });
});

app.delete ('/delete_tarea/:dni', (req, res) => {
  const {dni} = req.params;
  const sql = `DELETE FROM tareas WHERE dni_usuario=${dni}`;
  connection.query (sql, err => {
    if (err) {
      console.log (err);
      res.status (404).send ({
        Observaciones: `Se encontraron los siguientes errores: `,
        err,
      });
    } else {
      res.status (200).send ({
        Observaciones: `Las tareas del Usuario con DNI: ${dni} fueron eliminadas `,
      });
      console.info (
        ` Las tareas del Usuario con DNI: ${dni} fueron eliminadas`
      );
    }
  });
});
app.delete ('/delete_usuario/:dni', (req, res) => {
  const {dni} = req.params;
  const sql = `DELETE FROM usuarios WHERE dni_usuario=${dni}`;
  connection.query (sql, err => {
    if (err) {
      console.log (err);
      res.status (404).send ({
        Observaciones: `Se encontraron los siguientes errores: `,
        err,
      });
    } else {
      res.status (200).send ({
        Observaciones: `El usuario con DNI: ${dni} fue eliminado `,
      });
      console.info (` El usuario con  DNI= ${dni} fue eliminando`);
    }
  });
});

// INICIO: JWT  Biblioteca para la firma / verificación de tokens
/* La idea es que el usuario puede generar un token. utilizamos la herramienta JWT.
// cuando el usuario ingrese a login se generara un token.
// de esa manera un usuario puede ser identificado */

app.post ('/api/login', (req, res) => {
  const user = {
    dni_usuario: 'PAS45569-k ',
    nombre_apellido: 'prueba de funcionamiento',
    fecha_nacimiento: '1985-01-22',
    domicilio: ' casa linda 545 ',
    localidad: ' houston',
    telefono: '+15335228',
    username: 'prueba',
    pass: 'prueba',
  };
  // jwt.sign le pasamos la constante user, una llave secreta , tiempo de expiracion. err nos indica el error y
  // si no hay error nos dara el token
  // ese token se envia al navegador y de alguna manera lo deberia almacenar el explorador en una cookie o
  // utilizando localstorage.Authorization: Bearer <token>
  // mas info:https://jwt.io/introduction
  // la diferencia con otros JWT deja el token del lado del cliente y no del lado del servidor.
  jwt.sign ({user}, 'secretkey', {expiresIn: '120s'}, (err, token) => {
    // enviamos el token hacia el lado del usuario (cliente) valido por 2 minutos
    res.json ({
      token,
    });
  });
});

// en este caso vamos a pasar una funcion con el nombre que querramos x ejemplo: verifytoken
// dentro de los 2 minutos si entras a esta url debrias poder ver esta informacion.
app.post ('/api/posts', verificarToken, (req, res) => {
  jwt.verify (req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.status (403).send ({
        Observaciones: `Acceso denegado: por favor iniciar sesion nuevamente `,
      });
    } else {
      res.json ({
        mensaje: ' Iniciaste sesion correctamente (solo por 120 segundos)',
        authData,
      });
    }
  });
});
// la funcion verificarToken se le pasan 3 paramtros : request, response y next
// next se ejecuta solo si todo es exitoso
// Authorization: Bearer <token>
function verificarToken (req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    // aca el token se divide en 3 elementos, el token esta en la posicion1 (2 elemento)
    const bearerToken = bearerHeader.split (' ')[1];
    req.token = bearerToken;
    next ();
  } else {
    // 403 significa acceso prohibido
    res.status (403).send ({
      Observaciones: `Se encontraron los siguientes errores: `,
      err,
    });
  }
}
// FIN: JWT  Biblioteca para la firma / verificación de tokens

// chequeo de conexión
connection.connect (error => {
  if (error) throw error;
  console.info ('la base de datos esta funcionando');
});

// escuchar el puerto (alt96 = `)
app.listen (PORT, () =>
  console.info (`El servidor esta escuchando en el puerto:${PORT}`)
);
