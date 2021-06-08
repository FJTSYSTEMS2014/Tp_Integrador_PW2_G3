const express = require ('express');
const rutas = express.Router ();
const conexion = require ('./database/db');
// nuevo para utilizar JWT
const jwt = require ('jsonwebtoken');

rutas.get ('/', (req, res) => {
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
      res.render ('index2', {resultado: resultado});
    }
  });
});

rutas.get ('/listar', (req, res, next) => {
  conexion.query ('SELECT * FROM usuarios', (error, results) => {
    if (error) {
      console.log (error);
    } else {
      res.render ('usuarios.ejs', {results: results});
    }
  });
});
rutas.get ('/edit', (req, res, next) => {
  res.render ('editar.ejs');
});

// voy al formulario de registro
rutas.get ('/registro', (req, res) => {
  conexion.query ('SELECT * FROM usuarios', (error, results) => {
    if (error) {
      console.log (error);
    } else {
      res.render ('crear.ejs');
    }
  });
});
// voy al formulario de crear tareas  x dni
rutas.get ('/add_tareas/:dni_usuario', (req, res) => {
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
});

rutas.get ('/tareas', (req, res) => {
  conexion.query ('SELECT * FROM tareas', (error, results) => {
    if (error) {
      console.log (error);
    } else {
      res.render ('tareasDNI.ejs', {results: results});
    }
  });
});

const crud = require ('./controladores/crud');
// agregar usuarios
rutas.post ('/salvar', crud.salvar);
// AGREGAR tarea
rutas.post ('/salvar_tarea', crud.salvar_tarea);
// verify usuarios
rutas.post ('/verify', crud.verify);
//actualizar usuarios
rutas.post ('/update', crud.update);
//actualizar tarea
rutas.post ('/update_tareas', crud.update_tareas);

// editar el archivos usuarios por dni (primary key)
rutas.get ('/edit/:dni_usuario', (req, res) => {
  const dni_usuario = req.params.dni_usuario;

  conexion.query (
    'SELECT * FROM usuarios WHERE dni_usuario=?',
    [dni_usuario],
    (error, results) => {
      if (error) {
        console.log (error);
      } else {
        res.render ('edit', {user: results[0]});
      }
    }
  );
});

// editar el archivos tareas por dni (F key)
rutas.get ('/edit_tareas/:id', (req, res) => {
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

// elimninar usuarios ver: el delete de usuarios.ejs
rutas.get ('/delete/:dni_usuario', (req, res) => {
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
        res.redirect ('/listar');
      }
    }
  );
});

// crear tareas por DNI --> seguir en crud
rutas.get ('/add/:dni_usuario', (req, res) => {
  conexion.query ('SELECT * FROM tareas', (error, results) => {
    if (error) {
      console.log (error);
    } else {
      res.render ('crear_tareas.ejs');
    }
  });
});

// ver todas las tareas  por DNI --> seguir en crud
rutas.get ('/view_tareas/:dni_usuario', (req, res) => {
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
});

// elimninar tareas x usuarios rs
rutas.get ('/delete_tareas/:id', (req, res) => {
  const id = req.params.id;

  conexion.query ('DELETE FROM tareas WHERE id= ?', [id], (error, results) => {
    if (error) {
      throw error;
    } else {
      res.redirect ('/tareas');
    }
  });
});

// editar el archivos usuarios por dni (primary key)

module.exports = rutas;
