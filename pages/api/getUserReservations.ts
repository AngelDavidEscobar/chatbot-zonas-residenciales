import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { reservationTable } from '@/db/schema';
import {eq } from 'drizzle-orm';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const { cedula } = req.query;

        // Validación de parámetros
        if (!cedula) {
            return res.status(400).json({ error: 'Falta parámetro cedula' });
        }


        try {
            const reservas = await db
                .select({  id: reservationTable.id, hora: reservationTable.hora_reservada, area: reservationTable.area_comun, date: reservationTable.fecha_reservacion, status: reservationTable.estado_reservacion })
                .from(reservationTable)
                .where(
                 
                    
                    eq(reservationTable.cedula, cedula as string)
                );
            //consultar reservas por cedula
            const reservaData = reservas.map(r => ({
                id: r.id,
                area: r.area,
                date: r.date,
                time: r.hora,
                status: r.status,
            }));

            //console.log(reservaData);
            return res.status(200).json(reservaData);

        } catch (error) {
            console.error('Error al obtener horas reservadas:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

}