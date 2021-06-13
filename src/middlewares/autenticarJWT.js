const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const autenticarJWT = (req, res, next) => {
  // authHeader = "Bearer {JWT}"
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const [bearer, jswtoken] = authHeader.split(" ");

    jwt.verify(jswtoken, JWT_SECRET, (err, session) => {
      if (err) {
        res.status(403).json({
          mensaje: "Error: La sesión ha caducado",
          error: 403,
        });
      }

      req.session = session;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = autenticarJWT;
