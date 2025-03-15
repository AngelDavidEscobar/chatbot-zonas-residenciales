import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { reservationTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'DELETE') {
        const { id } = req.query;

        // Validación de parámetros
        if (!id) {
            return res.status(400).json({ error: 'Falta el parámetro id' });
        }

        try {
            // Eliminar la reserva por id
            const deletedReservation = await db
                .delete(reservationTable)
                .where(eq(reservationTable.id, parseInt(id as string, 10)))
                .returning(); // Esto devuelve el registro eliminado

            // Si no se encontró la reserva
            if (deletedReservation.length === 0) {
                return res.status(404).json({ error: 'Reserva no encontrada' });
            }

            // Respuesta exitosa
            return res.status(200).json({ 
                message: 'Reserva eliminada correctamente', 
                deletedReservation 
            });

        } catch (error) {
            console.error('Error al eliminar la reserva:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    } else {
        // Método no permitido
        return res.status(405).json({ error: 'Método no permitido' });
    }
}


