// pages/api/reservations.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { reservationTable } from '@/db/schema';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { celular,cedula, area_comun, fecha_reservacion, hora_reservada } = req.body;

      // Validación básica
      if (!celular || !area_comun || !fecha_reservacion || !hora_reservada) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }


      await db.insert(reservationTable).values({
        celular,
        cedula,
        area_comun,
        fecha_reservacion,
        hora_reservada,
        estado_reservacion: 'pendiente',
      });

      res.status(201).json({ message: 'Reserva creada exitosamente' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}