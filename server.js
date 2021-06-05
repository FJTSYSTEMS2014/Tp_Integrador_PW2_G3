// importo express
const express = require("express");
// importo el puerto desde config
const { PORT } = require("./src/config");
// importo la función que inicia la conexión a la base de datos
const { initConnection } = require("./src/database");

// creación de una app express
const app = express();
// uso de boy parser
app.use(express.json());
// middleware para servir el frontend y acceso a scripts app.js y login.js
app.use(express.static("./public"));

// importo API de tareas creada mediante routing
const tareasAPI = require("./src/handlers");
app.use("/", tareasAPI);

// si la conexión es exitosa, muestro mensaje
initConnection().then(() => {
  app.listen(PORT, () => {
    console.info(`El servidor esta escuchando en el puerto: ${PORT}`);
  });
});

// chequeo de conexión
// connection.connect((error) => {
//   if (error) throw error;
//   console.info("la base de datos esta funcionando");
// });

// // escuchar el puerto (alt96 = `)

// app.listen(PORT, () => {
//   console.info(`El servidor esta escuchando en el puerto: ${PORT}`);
// });
