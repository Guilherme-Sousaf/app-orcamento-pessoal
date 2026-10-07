import { z } from 'zod';

export const budgetSchema = z.object({
  categoryId: z.string().uuid('Selecione uma categoria válida'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Mês inválido (formato AAAA-MM)'),
  limitAmount: z.number().positive('O valor limite deve ser maior que zero'),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
