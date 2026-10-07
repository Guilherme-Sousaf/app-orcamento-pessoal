'use server';

import { createClient } from '@/lib/supabase/server';
import { loginSchema, registerSchema } from '@/lib/validations/auth';
import { redirect } from 'next/navigation';

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Dados inválidos.',
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    let msg = 'Erro ao autenticar. Verifique suas credenciais.';
    if (error.message.includes('Invalid login credentials')) {
      msg = 'E-mail ou senha incorretos.';
    } else if (error.message.includes('Email not confirmed')) {
      msg = 'E-mail não confirmado. Verifique sua caixa de entrada.';
    }
    return { success: false, error: msg };
  }

  redirect('/dashboard');
}

export async function registerAction(formData: FormData): Promise<ActionResult> {
  const rawData = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || 'Dados inválidos.',
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });

  if (error) {
    let msg = error.message;
    if (error.message.includes('User already registered')) {
      msg = 'Este e-mail já está cadastrado.';
    }
    return { success: false, error: msg };
  }

  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
