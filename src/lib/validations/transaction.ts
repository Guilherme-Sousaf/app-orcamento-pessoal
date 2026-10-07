import { z } from 'zod';

export const transactionSchema = z.object({
  description: z.string().min(2, 'Descrição deve ter no mínimo 2 caracteres').max(100),
  amount: z.number().positive('O valor deve ser maior que zero'),
  type: z.enum(['income', 'expense'], { message: 'Selecione o tipo de transação' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (formato AAAA-MM-DD)'),
  accountId: z.string().uuid('Selecione uma conta válida'),
  categoryId: z.string().uuid('Selecione uma categoria válida'),
  notes: z.string().max(255).optional().nullable(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
