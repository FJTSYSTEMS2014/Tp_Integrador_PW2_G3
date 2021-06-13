const express = require ('express');
const rutas = express.Router ();
const conexion = require ('./database/db');
const bcrypts = require ('bcryptjs');
// configuramos las variables de session.
const session = require ('express-session')
// seteamos o configuramos que express va a utilizar session.
// mas info:https://www.npmjs.com/package/express-session
// las variables basicas de sesion son:
rutas.use (
  session ({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true,
  })
);



rutas.get ('/login', (req, res) => {
    
    
    res.render ('login');
  });
  rutas.get ('/registro', (req, res) => {
    res.render ('registro');
  });
  rutas.post ('/registro', async (req, res) => {
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
  rutas.post ('/login1', async (req, res) => {
    console.log("entro a login 1")
 
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
  rutas.get('/',(req,res)=>{
  
      if(req.session.loggedin){
          res.render('index',{
              login:true,
              name: req.session.name
              
          }   )
      } else {
          res.render('index',{
  
              login:false,
              name:'Debe Iniciar Sesión'
          })
      }

  })
  




/*
rutas.get ('/usuarios', (req, res) => {


    if(req.session.loggedin){
      
           
 //iniciar vistas en la carpeta views
    // pedir datos al server
  
    // aca hacemos una consulta por mysql
    // por convencion se utiliza error y results
    conexion.query ('SELECT * FROM usuarios', (error, resultado) => {
        if (error) {
          console.log (error);
        } else {
          // la variable resultado se la paso a login con una variable resultado.
          //  res.render('login',{resultado:resultado})
          res.render ('index2', {resultado: resultado, login:true, name: req.session.name});
        }
      }); }  
      
      else {
        res.render('index',{

            login:false,
            name:'Debe Iniciar Sesión'
        })
    }
})
  

*/

 

 rutas.get('/usuarios/listar',(req,res, next)=>{
  
    if(req.session.loggedin){
        {
            conexion.query ('SELECT * FROM usuarios', (error, results) => {
              if (error) {
                console.log (error);
              } else {
                res.render ('usuarios.ejs', {login:true, name: req.session.name,results: results});
              }
            });
          }



    } else {
        res.render('index',{

            login:false,
            name:'Debe Iniciar Sesión'
        })
    }
})






  rutas.get('/usuarios/tareas',(req,res, next)=>{
  
    if(req.session.loggedin){
        {
            conexion.query ('SELECT * FROM tareas', (error, results) => {
                if (error) {
                  console.log (error);
                } else {
                res.render ('tareasDNI', {login:true, name: req.session.name,results: results});
              }
            });
          }



    } else {
        res.render('index',{

            login:false,
            name:'Debe Iniciar Sesión'
        })
    }
})




   //Logout
  //Destruye la sesión.
  rutas.get('/logout', function (req, res) {
      req.session.destroy(() => {
        res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
      })
  }); 
  //función para limpiar la caché luego del logout (ver cookies con f12)
  rutas.use(function(req, res, next) {
      if (!req.user)
          res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      next();
  });











// voy al formulario de registro

  rutas.get('/usuarios/registro',(req,res)=>{
  
    if(req.session.loggedin){
        conexion.query ('SELECT * FROM usuarios', (error, results) => {
            if (error) {
              console.log (error);
            } else {
                res.render('crear.ejs',{
                    login:true,
                    name: req.session.name
                    
                }   )
            }
          });
        }
    else {
        res.render('index',{

            login:false,
            name:'Debe Iniciar Sesión'
        })
    }
})











/*
// voy al formulario de crear tareas  x dni
rutas.get ('/usuarios/add_tareas/:dni_usuario', (req, res) => {
  const dni_usuario = req.params.dni_usuario;
  // aca ya tenemos el dni del que va a crear la tarea
  // debemos de alguna manera ingresarlo al dni_usuario y que no cambie

  conexion.query ('SELECT * FROM tareas', (error, results) => {
    if (error) {
      console.log (error);
    } else {
      res.render ('crear_tareas.ejs', {dni_usuario: dni_usuario});
    }
  });
});  */

/*

// ver todas las tareas  por DNI --> seguir en crud
rutas.get ('/usuarios/view_tareas/:dni_usuario', (req, res) => {
  const dni_usuario = req.params.dni_usuario;
  conexion.query (
    'SELECT * FROM tareas WHERE dni_usuario = ? ',
    [dni_usuario],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render ('tareasDNI.ejs', {results: results});
      }
    }
  );
});  */



rutas.get ('/usuarios/view_tareas/:dni_usuario', (req, res) => {
  const dni_usuario = req.params.dni_usuario;
  if(req.session.loggedin){
    conexion.query (
      'SELECT * FROM tareas WHERE dni_usuario = ? ',
      [dni_usuario],
      (error, results) => {
          if (error) {
            console.log (error);
          } else {
              res.render('tareasDNI',{
                  login:true,
                  name: req.session.name,dni_usuario: dni_usuario,results: results
                  
              }   )
          }
        });
      }
  else {
      res.render('index',{

          login:false,
          name:'Debe Iniciar Sesión'
      })
  }
})







rutas.get ('/usuarios/add_tareas/:dni_usuario', (req, res) => {
  const dni_usuario = req.params.dni_usuario;
  
  if(req.session.loggedin){
    conexion.query ('SELECT * FROM tareas', (error, results) => {
          if (error) {
            console.log (error);
          } else {
              res.render('crear_tareas',{
                  login:true,
                  name: req.session.name,dni_usuario: dni_usuario
                  
              }   )
          }
        });
      }
  else {
      res.render('index',{

          login:false,
          name:'Debe Iniciar Sesión'
      })
  }
})


const crud = require ('./controladores/crud');
// agregar usuarios
rutas.post ('/usuarios/salvar', crud.salvar);
// AGREGAR tarea
rutas.post ('/usuarios/salvar_tarea', crud.salvar_tarea);
// verify usuarios
rutas.post ('/verify', crud.verify);
//actualizar usuarios
rutas.post ('/usuarios/update', crud.update);
//actualizar tarea
rutas.post ('/usuarios/update_tareas', crud.update_tareas);




// editar el archivos usuarios por dni (primary key)
rutas.get ('/usuarios/edit/:dni_usuario', (req, res) => {
  const dni_usuario = req.params.dni_usuario;
  
  if(req.session.loggedin){
    conexion.query (
      'SELECT * FROM usuarios WHERE dni_usuario=?',
      [dni_usuario],
      (error, results) => {
          if (error) {
            console.log (error);
          } else {
              res.render('edit',{
                  login:true,
                  name: req.session.name,user: results[0]
                  
              }   )
          }
        });
      }
  else {
      res.render('index',{

          login:false,
          name:'Debe Iniciar Sesión'
      })
  }
})



/*
// editar el archivos tareas por dni (F key)
rutas.get ('/usuarios/edit_tareas/:id', (req, res) => {
  console.log ('entro en /edit_tareas/:dni_usuario');
  const id = req.params.id;

  conexion.query ('SELECT * FROM tareas WHERE id=?', [id], (error, results) => {
    if (error) {
      console.log (error);
    } else {
      res.render ('edit_tareas', {user: results[0]});
    }
  });
});

*/

// editar el archivos tareas por dni (F key)
rutas.get ('/usuarios/edit_tareas/:id', (req, res) => {
  console.log ('entro en /edit_tareas/:dni_usuario');
  const id = req.params.id;
  
  if(req.session.loggedin){
    conexion.query ('SELECT * FROM tareas WHERE id=?', [id], (error, results) => {
          if (error) {
            console.log (error);
          } else {
              res.render('edit_tareas',{
                  login:true,
                  name: req.session.name,user: results[0]
                  
              }   )
          }
        });
      }
  else {
      res.render('index',{

          login:false,
          name:'Debe Iniciar Sesión'
      })
  }
})












// elimninar usuarios ver: el delete de usuarios.ejs
rutas.get ('/usuarios/delete/:dni_usuario', (req, res) => {
  console.log ('entro en /delete/:dni_usuario');
  const dni_usuario = req.params.dni_usuario;
  console.log (`el DNI a borrar es: ${dni_usuario}`);
  conexion.query (
    'DELETE FROM usuarios WHERE dni_usuario= ?',
    [dni_usuario],
    (error, results) => {
      if (error) {
        console.log (error);
      } else {
        res.redirect ('/usuarios/listar');
      }
    }
  );
});

// crear tareas por DNI --> seguir en crud





rutas.get('/usuarios/registro',(req,res)=>{
  
  if(req.session.loggedin){
      conexion.query ('SELECT * FROM usuarios', (error, results) => {
          if (error) {
            console.log (error);
          } else {
              res.render('crear.ejs',{
                  login:true,
                  name: req.session.name
                  
              }   )
          }
        });
      }
  else {
      res.render('index',{

          login:false,
          name:'Debe Iniciar Sesión'
      })
  }
})



/*
rutas.get ('/usuarios/add/:dni_usuario', (req, res) => {
  conexion.query ('SELECT * FROM tareas', (error, results) => {
    if (error) {
      console.log (error);
    } else {
      res.render ('crear_tareas.ejs');
    }
  });
});   */








// elimninar tareas x usuarios rs
rutas.get ('/usuarios/delete_tareas/:id', (req, res) => {
  const id = req.params.id;

  conexion.query ('DELETE FROM tareas WHERE id= ?', [id], (error, results) => {
    if (error) {
      throw error;
    } else {
      res.redirect ('/usuarios/tareas');
    }
  });
});

// editar el archivos usuarios por dni (primary key)

module.exports = rutas;
