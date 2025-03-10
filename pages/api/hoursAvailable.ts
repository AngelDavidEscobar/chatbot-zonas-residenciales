// pages/api/reservations.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { reservationTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { area, date } = req.query;

      // Validación de parámetros
      if (!area || !date) {
        return res.status(400).json({
          error: 'Faltan parámetros: area y date son requeridos'
        });
      }
      console.log("area y date", area, date);
  

      // Consultar horas reservadas
      const reservas = await db
        .select({ hora: reservationTable.hora_reservada })
        .from(reservationTable)
        .where(
          and(
            eq(reservationTable.area_comun, area as string),
            eq(reservationTable.fecha_reservacion, date as string)
          )
        );

      const horasReservadas = reservas.map(r => r.hora);
      return res.status(200).json(horasReservadas);

    } catch (error) {
      console.error('Error al obtener horas reservadas:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Si no es GET, retorna método no permitido
  return res.status(405).json({ error: 'Método no permitido' });
}