USE grupo3;
select * from tareas;
select * from usuarios;

/* consulta1: recuperando dni,nombre,telefono,titulo,descripcion,estado,creado,actualizado y eliminado
en un rango de fecha y el estado es pendiente*/
SELECT usuarios.dni_usuario,usuarios.nombre_apellido,usuarios.telefono,
tareas.titulo, tareas.descripcion, tareas.estado,
tareas.created,tareas.updated,tareas.eliminated

FROM tareas
INNER JOIN usuarios
ON usuarios.dni_usuario=tareas.dni_usuario
WHERE tareas.created  between "20210101" and "20250424" 
AND (tareas.estado like "pendiente");
