'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createCategoryAction } from '@/lib/actions/categories';
import { PlusCircle, AlertCircle } from 'lucide-react';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCategoryModal({ isOpen, onClose }: CreateCategoryModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createCategoryAction(formData);
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
      title="Nova Categoria"
      description="Cadastre uma categoria para classificar receitas ou despesas"
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da Categoria"
          name="name"
          placeholder="Ex: Assinaturas, Pets, Farmácia"
          required
        />

        <Select label="Tipo" name="type" required>
          <option value="expense">Despesa (Gasto)</option>
          <option value="income">Receita (Entrada)</option>
        </Select>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Cor da Categoria
          </label>
          <input
            type="color"
            name="color"
            defaultValue="#6366f1"
            className="w-full h-10 rounded-xl bg-slate-900 border border-slate-700/80 p-1 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Salvar Categoria
          </Button>
        </div>
      </form>
    </Modal>
  );
}
