const conexion=require('../database/db');
// aca preguntamos o verificamos si exist el
// usuario y contraseña.

// para guardar el metodo es salvar lo podemos ver en crear.ejs
exports.salvar=(req,res)=>{
    console.log("entro a salvar usuario");
    // capturamos los campos del usuario.
    // para invocar a estos valores los tenemos que configurar en rutas.js.
   const user= req.body.user;

   const sql = 'INSERT INTO usuarios SET ?';
   const info = {
     dni_usuario: user[0],
     nombre_apellido: user[1],
     fecha_nacimiento: user[2],
     domicilio: user[3],
     localidad: user[4],
     telefono: user[5],
     username: user[6],
     pass: user[7],
   };
   conexion.query (sql, info, err => {
    if (err) {
      console.log (err);
     
    } else {
      console.log (' usuario agregado');
      res.redirect('/')

    }
  });
console.log(info);

};


// para guardar el metodo es salvar lo podemos ver en crear_tarea.ejs
exports.salvar_tarea=(req,res)=>{
  console.log("entro a salvar_tarea");
  // capturamos los campos de la tarea.
  // para invocar a estos valores los tenemos que configurar en rutas.js.
 const user= req.body.user;
 const id= req.body.getID;
 //const dni_usuario= 'DNI33.333.333'
 /*
 <%= dni_usuario  %>  */
 const sql = 'INSERT INTO tareas SET ?';
 const info = {
  dni_usuario: user[0],
   titulo: user[1],
   descripcion: user[2],
   estado: user[3],
   created: user[4],
   updated: user[5],
   eliminated: user[6],
 }; 
 conexion.query (sql, info, err => {
  if (err) {
    console.log (err);
   
  } else {
    console.log (' tarea agregada');
    res.redirect('/tareas')

  }
});  
console.log(user);


};



// para guardar el metodo es salvar lo podemos ver en index.ejs

exports.verify=(req,res)=>{
    console.log("entro a verify");
    // capturamos los campos del usuario.
    // para invocar a estos valores los tenemos que configurar en rutas.js.
   const user= req.body.user;
   console.log(user+ " " );
   const username=user[0];
   const pass=user[1];

if(username==undefined ||username==""|| pass==undefined||pass==""){
  console.log('DATOS indDEFINIDOS');
  res.render('404');
  
} else {


// ACa tenemos los datos de usuario y contraseña DESDE EL LOGIN
// FUNCION VERIFY
// documentacion:https://www.npmjs.com/package/mysql2?activeTab=readme
const resultado= conexion.execute(
  'SELECT `dni_usuario` FROM `usuarios` WHERE `username` = ? AND `pass` = ?',
  [username,pass],  function(err, resultado) {

    const dni_usuario= resultado[0].dni_usuario;    }    );
  res.redirect('/listar')
  }
};


// actualizar ver edit.ejs y rutas
exports.update=(req,res)=>{
  // capturo el dni old
const dni_usuario=req.body.id;
// en user vendria con el dni nuevo
const usuario=req.body.user;


console.log('entro  a actualizar /update')
// aca tenemos que ver todos los campos atualizados
console.log(`el dni original es: ${dni_usuario}`);
console.log(usuario);
conexion.query('UPDATE usuarios SET ? WHERE dni_usuario = ?',[{usuario:usuario},dni_usuario],(error, results)=>{

  if (error) {
    console.log (error);
   
  } else {
  
    res.redirect('/')

  }

})
// ir al enrutador para decirle que actualice con /update
}




// verificar token

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
