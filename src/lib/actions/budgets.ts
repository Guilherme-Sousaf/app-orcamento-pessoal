'use server';

import { createClient } from '@/lib/supabase/server';
import { budgetSchema } from '@/lib/validations/budget';
import { revalidatePath } from 'next/cache';

export async function setBudgetAction(formData: FormData) {
  const rawData = {
    categoryId: formData.get('categoryId'),
    month: formData.get('month'),
    limitAmount: parseFloat(formData.get('limitAmount') as string),
  };

  const parsed = budgetSchema.safeParse(rawData);
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

  // O mês é formatado como o primeiro dia: YYYY-MM-01
  const formattedMonth = `${parsed.data.month}-01`;

  const { error } = await supabase.from('budgets').upsert(
    {
      user_id: user.id,
      category_id: parsed.data.categoryId,
      month: formattedMonth,
      limit_amount: parsed.data.limitAmount,
    },
    { onConflict: 'user_id,category_id,month' }
  );

  if (error) {
    return { success: false, error: `Erro ao salvar orçamento: ${error.message}` };
  }

  revalidatePath('/dashboard');
  revalidatePath('/budgets');

  return { success: true };
}

export async function deleteBudgetAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/budgets');

  return { success: true };
}
