'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginAction } from '@/lib/actions/auth';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(formData);
      if (res && !res.success && res.error) {
        setError(res.error);
      }
    } catch {
      // Em caso de redirect nativo do Next.js, a exception é esperada
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glass-panel border-white/10 p-8 shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Acesse sua conta</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Informe seu e-mail e senha cadastrados
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-sm text-rose-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-mail"
          type="email"
          name="email"
          placeholder="seu@email.com"
          required
          autoComplete="email"
        />

        <Input
          label="Senha"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          className="w-full mt-2"
          size="lg"
          isLoading={loading}
        >
          <LogIn className="w-4 h-4 mr-2" />
          Entrar na Conta
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/5 text-center">
        <p className="text-sm text-slate-400">
          Ainda não tem conta?{' '}
          <Link
            href="/register"
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Cadastre-se gratuitamente
          </Link>
        </p>
      </div>
    </Card>
  );
}
