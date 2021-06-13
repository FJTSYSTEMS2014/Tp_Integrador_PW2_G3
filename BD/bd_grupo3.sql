CREATE DATABASE grupo3;
USE grupo3;

CREATE TABLE usuarios(
dni_usuario VARCHAR(200)  PRIMARY KEY,
nombre_apellido VARCHAR(200),
fecha_nacimiento date,
domicilio VARCHAR(200),
localidad VARCHAR(200) ,
telefono VARCHAR(200) ,
username VARCHAR(200) ,
pass VARCHAR(200));
CREATE TABLE tareas(
id INT  UNSIGNED NOT NULL AUTO_INCREMENT  PRIMARY KEY,
dni_usuario VARCHAR(200) ,
titulo VARCHAR(200),
descripcion VARCHAR(200) ,
estado enum ('pendiente','completada','eliminada'),
created date ,
updated date,
eliminated date,
FOREIGN KEY (dni_usuario) REFERENCES usuarios(dni_usuario));
/* esta porcion de codigo se agrega super-usuarios.
se insertan valores desde la api de la rama:otra_version */ 
CREATE TABLE superUsuario(
nombre_usuario VARCHAR(200) PRIMARY KEY,
nombre_completo VARCHAR(200),
nombre_password VARCHAR(250)  
);

