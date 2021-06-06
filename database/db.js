// aca se define los parametros para la conexion de la base de datos
const mysql = require ('mysql2');

// aca ponemos los parametro de conexion con la base de datos
const conexion = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  password: 'TSCHERIG2002',
  database: 'grupo3',
});
conexion.connect((error)=>{
    if (error) {
      console.error('El error de conexión es: ' + error);
      console.log('El error de conexión es: ' + error);
      return;
    }
    console.log(`conectado a la base de datos`);
  });
  // exportamos esta conexion como un modulo.
  //invodado en rutas.js
module.exports = conexion;