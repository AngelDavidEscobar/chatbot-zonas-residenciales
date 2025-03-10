import { db } from '../index';
import { InsertReservation, reservationTable} from '../schema';

export async function createReservation(data: InsertReservation) {
  await db.insert(reservationTable).values(data);
}

