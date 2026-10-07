'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createTransactionAction } from '@/lib/actions/transactions';
import { Account, Category } from '@/types/database.types';
import { PlusCircle, AlertCircle } from 'lucide-react';

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  categories: Category[];
}

export function CreateTransactionModal({
  isOpen,
  onClose,
  accounts,
  categories,
}: CreateTransactionModalProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredCategories = categories.filter((c) => c.type === type);
  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set('type', type);

    try {
      const res = await createTransactionAction(formData);
      if (res && !res.success && res.error) {
        setError(res.error);
      } else {
        onClose();
      }
    } catch {
      // Ignorar erros de redirect
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Transação"
      description="Lance uma nova despesa ou receita financeira"
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Seletor de Tipo (Receita vs Despesa) */}
      <div className="flex rounded-xl bg-slate-900 p-1 mb-5 border border-white/5">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            type === 'expense'
              ? 'bg-rose-500/20 text-rose-400 shadow-sm border border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Despesa
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            type === 'income'
              ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Receita
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Descrição"
          name="description"
          placeholder="Ex: Supermercado, Aluguel, Salário"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Valor (R$)"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            required
          />

          <Input
            label="Data"
            name="date"
            type="date"
            defaultValue={today}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Conta" name="accountId" required>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </Select>

          <Select label="Categoria" name="categoryId" required>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Observações (Opcional)"
          name="notes"
          placeholder="Informações adicionais..."
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant={type === 'expense' ? 'danger' : 'primary'}
            isLoading={loading}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Salvar {type === 'expense' ? 'Despesa' : 'Receita'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
