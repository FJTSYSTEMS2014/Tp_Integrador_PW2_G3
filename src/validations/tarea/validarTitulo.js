const { body, validationResult } = require("express-validator");

module.exports = body("titulo")
  .notEmpty()
  .withMessage("El campo título no debe estar vacío");
