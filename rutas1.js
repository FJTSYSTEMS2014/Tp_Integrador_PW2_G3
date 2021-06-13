const express = require ('express');
const rutas1 = express.Router ();
const conexion = require ('./database/db');
// requerimos BCrypts
const bcrypts = require ('bcryptjs');
// configuramos las variables de session.
const session = require ('express-session')
// seteamos o configuramos que express va a utilizar session.
// mas info:https://www.npmjs.com/package/express-session
// las variables basicas de sesion son:
rutas1.use (
  session ({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true,
  })
);


rutas1.get ('/login', (req, res) => {
    
    res.render ('login');
  });
  rutas1.get ('/registro', (req, res) => {
    res.render ('registro');
  });
  rutas1.post ('/registro', async (req, res) => {
    const nombre_usuario = req.body.usuario1;
    const nombre_completo = req.body.nombrecompleto;
    const contrasena = req.body.pass;
    console.log (`${nombre_usuario},${nombre_completo},${contrasena}`);
    // vamos a encriptar la contraseña
    let nombre_password = await bcrypts.hash (contrasena, 5);
    // console.log(nombre_password);
  
    conexion.query (
      'INSERT INTO superUsuario SET ?',
      {
        nombre_usuario: nombre_usuario,
        nombre_completo: nombre_completo,
        nombre_password: nombre_password,
      },
      async (error, resultado) => {
        if (error) {
          console.log (error);
        } else {
          // podemos generar un mensaje con https://sweetalert2.github.io/
          // copiamos en registro <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
          res.render ('registro', {
            alert: true,
            alertTitulo: 'Registro de SuperUsuarios',
            mensaje: 'has sido registrado correctamente!',
            position: 'center',
            icon: 'success',
            showConfirmButton: false,
            timer: 5000,
            ruta: 'login',
          });
        }
      }
    );
  });
  rutas1.post ('/login1', async (req, res) => {
    console.log("entro a login")
    const nombre_usuario = req.body.user;
    const contrasena = req.body.password;
    console.log (`${nombre_usuario},${contrasena}`);
  
    // vamos a encriptar la contraseña
    let nombre_password = await bcrypts.hash (contrasena, 5);
    if (nombre_usuario && contrasena) {
      conexion.query (
        'SELECT * FROM superUsuario WHERE nombre_usuario = ?',
        [nombre_usuario],
        async (error, resultado) => {
  
          if (
            resultado.length == 0 ||
            !await bcrypts.compare (contrasena, resultado[0].nombre_password)
          ) {
            res.render ('login', {
              alert: true,
              alertTitulo: 'Error G3',
              mensaje: 'Usuario y/o contraseña incorrecta',
              position: 'center',
              icon: 'error',
              showConfirmButton: true,
              timer: 5500,
              ruta: 'login',
            });
          } else {
                 //varibles de sesion en verdadero cuando esta con login coorecto
        req.session.loggedin=true;
        // sacamos el nombre de resultado del query
        req.session.name=nombre_usuario   // me di error
            res.render ('login', {
              alert: true,
              alertTitulo: 'Conexión OK',
              mensaje: 'Login Aceptado!',
              position: 'center',
              icon: 'success',
              showConfirmButton: false,
              timer: 5000,
              ruta: '',
            });
          }
        }
      );
    } else {
     
      res.render ('login', {
        alert: true,
        alertTitulo: 'Error de Login',
        mensaje: ' Por favor, Ingrese un Usuario y contraseña',
        position: 'center',
        icon: 'warning',
        showConfirmButton: true,
        timer: 5500,
        ruta: 'login',
      });
    }
  });
  
  // autenticar resto de paginas con usuario con login ok
  rutas1.get('/',(req,res)=>{
  
      if(req.session.loggedin){
          res.render('index',{
              login:true,
              name: req.session.name
          })
      } else {
          res.render('index',{
  
              login:false,
              name:'Debe Iniciar Sesión'
          })
      }
  
  
  })
  
   //Logout
  //Destruye la sesión.
  rutas1.get('/logout', function (req, res) {
      req.session.destroy(() => {
        res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
      })
  }); 
  //función para limpiar la caché luego del logout (ver cookies con f12)
  rutas1.use(function(req, res, next) {
      if (!req.user)
          res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      next();
  });





module.exports = rutas1;