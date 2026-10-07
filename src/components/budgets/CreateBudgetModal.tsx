'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { setBudgetAction } from '@/lib/actions/budgets';
import { Category } from '@/types/database.types';
import { PlusCircle, AlertCircle } from 'lucide-react';

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currentMonth: string;
}

export function CreateBudgetModal({
  isOpen,
  onClose,
  categories,
  currentMonth,
}: CreateBudgetModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Apenas categorias de despesas podem ter orçamentos de teto de gastos
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await setBudgetAction(formData);
      if (res && !res.success && res.error) {
        setError(res.error);
      } else {
        onClose();
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Definir Orçamento"
      description="Estipule o teto de gastos mensal para uma categoria"
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select label="Categoria de Despesa" name="categoryId" required>
          {expenseCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Input
          label="Mês de Referência"
          name="month"
          type="month"
          defaultValue={currentMonth}
          required
        />

        <Input
          label="Teto Máximo (R$)"
          name="limitAmount"
          type="number"
          step="0.01"
          min="1"
          placeholder="Ex: 1500,00"
          required
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Salvar Limite
          </Button>
        </div>
      </form>
    </Modal>
  );
}
