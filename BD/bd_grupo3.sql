CREATE DATABASE grupo3;
USE grupo3;

CREATE TABLE usuarios(
dni_usuario VARCHAR(100)  PRIMARY KEY,
nombre_apellido VARCHAR(200),
fecha_nacimiento date,
domicilio VARCHAR(200),
localidad VARCHAR(200) ,
telefono VARCHAR(100) ,
username VARCHAR(50) ,
pass VARCHAR(50));
CREATE TABLE tareas(
id INT  UNSIGNED NOT NULL AUTO_INCREMENT  PRIMARY KEY,
dni_usuario VARCHAR(100) ,
titulo VARCHAR(200),
descripcion VARCHAR(100) ,
estado enum ('pendiente','completada','eliminada'),
created date ,
updated date,
eliminated date,
FOREIGN KEY (dni_usuario) REFERENCES usuarios(dni_usuario));

