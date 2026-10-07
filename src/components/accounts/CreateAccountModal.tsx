'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createAccountAction } from '@/lib/actions/accounts';
import { PlusCircle, AlertCircle } from 'lucide-react';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAccountModal({ isOpen, onClose }: CreateAccountModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createAccountAction(formData);
      if (res && !res.success && res.error) {
        setError(res.error);
      } else {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Conta Financeira"
      description="Cadastre uma conta corrente, poupança, cartão ou carteira"
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da Conta"
          name="name"
          placeholder="Ex: Nubank, Itaú Corrente, Carteira"
          required
        />

        <Select label="Tipo da Conta" name="type" required>
          <option value="checking">Conta Corrente</option>
          <option value="savings">Conta Poupança / Reserva</option>
          <option value="credit_card">Cartão de Crédito</option>
          <option value="cash">Dinheiro em Espécie</option>
          <option value="investment">Investimentos</option>
        </Select>

        <Input
          label="Saldo Inicial (R$)"
          name="initialBalance"
          type="number"
          step="0.01"
          placeholder="0,00"
          defaultValue="0"
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Cor de Identificação
          </label>
          <input
            type="color"
            name="color"
            defaultValue="#3b82f6"
            className="w-full h-10 rounded-xl bg-slate-900 border border-slate-700/80 p-1 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Cadastrar Conta
          </Button>
        </div>
      </form>
    </Modal>
  );
}
