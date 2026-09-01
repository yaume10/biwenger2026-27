CREATE DATABASE biwenger2026_db;
USE biwenger2026_db;

CREATE TABLE jugadores (
	id int auto_increment primary key,
    nombre varchar(30) not null,
    password varchar(255),
    tesorero boolean
);

create table detalle_pagos (
	id int auto_increment primary key,
    jornada int not null,
    id_jugador int not null,
    importe_posicion decimal(10,2),
    importe_rojas decimal(10,2),
    pagado boolean,
    FOREIGN KEY (id_jugador) REFERENCES jugadores(id)
);

create table mensajes_personalizados (
	id int auto_increment primary key,
    id_jugador int not null,
    mensaje varchar (400),
    FOREIGN KEY (id_jugador) REFERENCES jugadores(id)
);

create table mensajes_ultimo (
	id int auto_increment primary key,
    id_jugador int not null,
    mensaje varchar (400),
    FOREIGN KEY (id_jugador) REFERENCES jugadores(id)
);