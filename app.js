const express = require ('express');
const app = express ();
// llamamos al motor de plantilla EJS
app.set ('view engine', 'ejs');
app.use (express.urlencoded ({extended: false}));
app.use (express.json ());
// enlazamos a rutas.js
app.use ('/', require ('./rutas'));
// le indicamos de donde vamos a sacar los imagenes

app.use ('/public/img/', express.static ('./public/img'));

app.use (function (req, res) {
  res.status (404).render ('404');
});
app.listen (3000, () => {
  console.log ('SERVER corriendo en http://localhost:3000');
});
