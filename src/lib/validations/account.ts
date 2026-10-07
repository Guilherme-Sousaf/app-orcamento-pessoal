import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres').max(50),
  type: z.enum(['checking', 'savings', 'credit_card', 'cash', 'investment'], {
    message: 'Selecione o tipo da conta',
  }),
  initialBalance: z.number().default(0),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida em hexadecimal'),
});

export type AccountInput = z.infer<typeof accountSchema>;
