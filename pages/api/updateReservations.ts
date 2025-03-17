import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { reservationTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function updateReservationHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { id, celular, area_comun, fecha_reservacion, hora_reservada } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'El ID de la reserva es requerido' });
        }

        const updateData: Partial<typeof reservationTable> = {};
        if (celular) updateData.celular = celular;
        if (area_comun) updateData.area_comun = area_comun;
        if (fecha_reservacion) updateData.fecha_reservacion = fecha_reservacion;
        if (hora_reservada) updateData.hora_reservada = hora_reservada;
      

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No hay datos para actualizar' });
        }

        const updatedReservation = await db
            .update(reservationTable)
            .set(updateData)
            .where(eq(reservationTable.id, parseInt(id as string, 10)))
            .returning();

        if (updatedReservation.length === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        res.status(200).json({ message: 'Reserva actualizada exitosamente', reserva: updatedReservation[0] });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
