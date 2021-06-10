const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// // a la funcion authenticateJWT se le pasan 3 paramtros : request, response y next
// // next se ejecuta solo si todo es exitoso
// // Authorization: Bearer <token>
const authenticateJWT = (req, res, next) => {
  // Authorization header = "Bearer {JWT}"
  const bearerHeader = req.headers["authorization"];
  //   const authHeader = req.headers.authorization;

  if (typeof bearerHeader !== "undefined") {
    //   if (authHeader) {

    // aca el token se divide en 3 elementos, el token esta en la posicion1 (2 elemento)
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;

    // const [bearer, jswtoken] = authHeader.split(" ");

    // en este caso vamos a pasar una funcion con el nombre que querramos x ejemplo: verifytoken
    // dentro de los 2 minutos deberias poder ver esta informacion.
    jwt.verify(bearerToken, JWT_SECRET, (error, authData) => {
      if (error) {
        res.status(403).send({
          Observaciones: `Acceso denegado: por favor iniciar sesion nuevamente `,
        });
      } else {
        req.session = {
          mensaje: " Iniciaste sesion correctamente (solo por 30 minutos)",
          authData,
        };
        next();
      }
    });
  } else {
    // usuario no autorizado
    res.sendStatus(401);
  }
};

// // FIN: JWT  Biblioteca para la firma / verificación de tokens

// se exporta para ser utilizado en todos los endpoint
module.exports = authenticateJWT;
