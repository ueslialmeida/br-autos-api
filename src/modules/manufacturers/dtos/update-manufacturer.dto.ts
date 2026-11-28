import { z } from 'zod';

export const updateManufacturerSchema = z.object({
  id: z.uuid('O ID do fabricante deve ser um UUID válido'),
  name: z
    .string()
    .min(1, 'O nome do fabricante deve ter pelo menos 1 caractere')
    .max(255, 'O nome do fabricante deve ter no máximo 255 caracteres'),
});

export type UpdateManufacturerDTO = z.infer<typeof updateManufacturerSchema>;
