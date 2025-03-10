CREATE TABLE Reservaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_cliente TEXT NOT NULL,
    area_comun TEXT NOT NULL,
    fecha_reservacion DATE NOT NULL,
    hora_reservada TIME NOT NULL,
    estado_reservacion TEXT DEFAULT 'Pendiente'
);