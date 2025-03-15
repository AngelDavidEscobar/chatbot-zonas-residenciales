
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const reservationTable = sqliteTable('reservaciones', {
  id: integer('id').primaryKey(),
  celular: text('celular').notNull(),
  cedula: text('cedula').notNull(),
  area_comun: text('area_comun').notNull(),
  fecha_reservacion: text('fecha_reservacion').notNull(),
  hora_reservada: text('hora_reservada').notNull(),
  estado_reservacion: text('estado_reservacion').notNull(),
});


export type InsertReservation = typeof reservationTable.$inferInsert;
export type SelectReservation = typeof reservationTable.$inferSelect;


