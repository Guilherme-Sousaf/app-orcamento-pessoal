'use server';

import { createClient } from '@/lib/supabase/server';
import { transactionSchema } from '@/lib/validations/transaction';
import { revalidatePath } from 'next/cache';

export async function createTransactionAction(formData: FormData) {
  const rawData = {
    description: formData.get('description'),
    amount: parseFloat(formData.get('amount') as string),
    type: formData.get('type'),
    date: formData.get('date'),
    accountId: formData.get('accountId'),
    categoryId: formData.get('categoryId'),
    notes: formData.get('notes') ? (formData.get('notes') as string) : null,
  };

  const parsed = transactionSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Dados inválidos.',
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  const { error } = await supabase.from('transactions').insert({
    user_id: user.id,
    description: parsed.data.description,
    amount: parsed.data.amount,
    type: parsed.data.type,
    date: parsed.data.date,
    account_id: parsed.data.accountId,
    category_id: parsed.data.categoryId,
    notes: parsed.data.notes,
  });

  if (error) {
    return { success: false, error: `Erro ao criar transação: ${error.message}` };
  }

  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  revalidatePath('/budgets');
  revalidatePath('/accounts');

  return { success: true };
}

export async function deleteTransactionAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  revalidatePath('/budgets');
  revalidatePath('/accounts');

  return { success: true };
}
