import { z } from 'zod';

export const updateEngineSchema = z.object({
  id: z.uuid('O ID do motor deve ser um UUID válido'),
  code: z
    .string()
    .min(1, 'O código do motor deve ter pelo menos 1 caractere')
    .max(255, 'O código do motor deve ter no máximo 255 caracteres'),
  displacement: z.number().positive('A cilindrada do motor deve ser um número positivo'),
  power: z
    .number()
    .int('A potência do motor deve ser um número inteiro')
    .positive('A potência do motor deve ser um número positivo'),
  torque: z.number().positive('O torque do motor deve ser um número positivo'),
  fuelType: z
    .string()
    .min(1, 'O tipo de combustível do motor deve ter pelo menos 1 caractere')
    .max(50, 'O tipo de combustível do motor deve ter no máximo 50 caracteres'),
  valves: z
    .number()
    .int('O número de válvulas do motor deve ser um número inteiro')
    .positive('O número de válvulas do motor deve ser um número positivo'),
  cylinders: z
    .number()
    .int('O número de cilindros do motor deve ser um número inteiro')
    .positive('O número de cilindros do motor deve ser um número positivo'),
  synchronism: z
    .string()
    .min(1, 'O tipo de sincronismo do motor deve ter pelo menos 1 caractere')
    .max(50, 'O tipo de sincronismo do motor deve ter no máximo 50 caracteres'),
  aspiration: z
    .string()
    .min(1, 'O tipo de aspiração do motor deve ter pelo menos 1 caractere')
    .max(50, 'O tipo de aspiração do motor deve ter no máximo 50 caracteres'),
  layout: z
    .string()
    .min(1, 'O layout do motor deve ter pelo menos 1 caractere')
    .max(50, 'O layout do motor deve ter no máximo 50 caracteres'),
});

export type UpdateEngineDTO = z.infer<typeof updateEngineSchema>;
