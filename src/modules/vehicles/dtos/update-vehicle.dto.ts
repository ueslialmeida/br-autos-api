import { z } from 'zod';

export const updateVehicleSchema = z.object({
  id: z.uuid('O ID do veículo deve ser um UUID válido'),
  model: z
    .string()
    .min(1, 'O modelo do veículo deve ter pelo menos 1 caractere')
    .max(255, 'O modelo do veículo deve ter no máximo 255 caracteres'),
  generation: z
    .number()
    .int('A geração do veículo deve ser um número inteiro')
    .min(1, 'A geração do veículo deve ser um número inteiro positivo'),
  manufacturerId: z.uuid('O ID do fabricante deve ser um UUID válido'),
  engineId: z.uuid('O ID do motor deve ser um UUID válido'),
  category: z
    .string()
    .min(1, 'A categoria do veículo deve ter pelo menos 1 caractere')
    .max(255, 'A categoria do veículo deve ter no máximo 255 caracteres'),
  bodyType: z
    .string()
    .min(1, 'O tipo de carroceria do veículo deve ter pelo menos 1 caractere')
    .max(255, 'O tipo de carroceria do veículo deve ter no máximo 255 caracteres'),
  manufacturingPeriodStart: z
    .number('A data de início do período de fabricação do veículo deve ser uma data válida')
    .optional(),
  manufacturingPeriodEnd: z
    .number('A data de término do período de fabricação do veículo deve ser uma data válida')
    .optional(),
  image: z.url('A imagem do veículo deve ser uma URL válida').optional(),
  description: z.string().optional(),
});

export type UpdateVehicleDTO = z.infer<typeof updateVehicleSchema>;
