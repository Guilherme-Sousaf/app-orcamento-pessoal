'use server';

import { createClient } from '@/lib/supabase/server';
import { accountSchema } from '@/lib/validations/account';
import { revalidatePath } from 'next/cache';

export async function createAccountAction(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    type: formData.get('type'),
    initialBalance: parseFloat((formData.get('initialBalance') as string) || '0'),
    color: formData.get('color') || '#3b82f6',
  };

  const parsed = accountSchema.safeParse(rawData);
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

  const { error } = await supabase.from('accounts').insert({
    user_id: user.id,
    name: parsed.data.name,
    type: parsed.data.type,
    initial_balance: parsed.data.initialBalance,
    color: parsed.data.color,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/accounts');

  return { success: true };
}

export async function deleteAccountAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: 'Não é possível excluir contas com transações vinculadas.' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/accounts');

  return { success: true };
}
