import { z } from 'zod';

// Esquema para validar la cédula (asumiendo formato ECUADOR)
export const cedulaSchema = z.string()
  .min(10, { message: "La cédula debe tener exactamente 10 dígitos." })
  .max(10, { message: "La cédula debe tener exactamente 10 dígitos." })
  .regex(/^\d+$/, { message: "La cédula solo puede contener números." });

// Esquema para validar el número de teléfono 
export const telefonoSchema = z.string()
  .min(10, { message: "El número de teléfono debe tener al menos 10 dígitos." })
  .max(15, { message: "El número de teléfono no puede exceder los 15 dígitos." })
  .regex(/^\+?\d+$/, { message: "El número de teléfono solo puede contener números ." });