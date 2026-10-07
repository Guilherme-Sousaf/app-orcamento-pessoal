'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCategoryAction(formData: FormData) {
  const name = formData.get('name') as string;
  const type = formData.get('type') as 'income' | 'expense';
  const icon = (formData.get('icon') as string) || 'Tag';
  const color = (formData.get('color') as string) || '#64748b';

  if (!name || name.trim().length < 2) {
    return { success: false, error: 'O nome da categoria deve ter pelo menos 2 caracteres.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  const { error } = await supabase.from('categories').insert({
    user_id: user.id,
    name: name.trim(),
    type,
    icon,
    color,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/categories');
  revalidatePath('/transactions');

  return { success: true };
}
