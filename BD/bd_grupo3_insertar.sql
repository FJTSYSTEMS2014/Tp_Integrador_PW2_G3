USE grupo3;
--  insert en tabla usuarios
INSERT INTO usuarios VALUES ("DNI33.333.333", "Bart Simpsons","1990-06-01"," Siempre Viva 123 ", "springfield","+5492944898", "el_Barto","krusty");
INSERT INTO usuarios VALUES ("DNI38.333.111", "Lisa Simpsons","1992-08-11"," Siempre Viva 123 ", "springfield","+5492944899", "LS","Chica_jazz");
INSERT INTO usuarios VALUES ("PAS45569-k ", "Claudio Segundo","1970-06-01"," Rolling Stones 1236 - 1F ", "kasajistan","+129298002555", "claudio123","12345678");

--  insert  en tabla tareas
/* el estado puede ser: 'pendiente','completada','eliminada' */
INSERT INTO tareas VALUES (1,"DNI33.333.333","tarea1","sumar numeros complejos", "pendiente","2021-06-01","2021-06-01","2021-06-01" );
INSERT INTO tareas VALUES (2,"PAS45569-k ","tarea2","multiplicar numeros complejos", "pendiente","2021-06-01","2021-06-01","2021-06-01" );
INSERT INTO tareas VALUES (3,"DNI38.333.111","tarea1","sumar numeros complejos", "completada","2021-06-01","2021-06-02","2021-06-03" );

