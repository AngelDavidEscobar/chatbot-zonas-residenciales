import { eq,  } from 'drizzle-orm';
import { db } from '../index';
import { SelectReservation, reservationTable } from '../schema';

export async function getReservationByCedula(id: SelectReservation['id']): Promise<
  Array<{
    id: number;
    celular: string;
    area_comun: string;
    fecha_reservacion: string;
    hora_reservada: string;
    estado_reservacion: string;
  }
   >
> {
  return db.select().from(reservationTable).where(eq(reservationTable.id, id));
}


