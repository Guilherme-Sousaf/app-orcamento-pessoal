'use client';

import React, { useState } from 'react';
import { Category } from '@/types/database.types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreateCategoryModal } from './CreateCategoryModal';
import { Plus, Tag } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Categorias Financeiras
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Organize suas movimentações em classificações claras.
          </p>
        </div>

        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Nova Categoria
        </Button>
      </div>

      <div className="space-y-8">
        {/* Despesas */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Categorias de Despesas ({expenseCategories.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {expenseCategories.map((cat) => (
              <Card key={cat.id} className="glass-card p-4 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: cat.color || '#ef4444' }}
                >
                  <Tag className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-100 truncate">{cat.name}</p>
                  <span className="text-[11px] text-slate-400">Despesa</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Receitas */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Categorias de Receitas ({incomeCategories.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {incomeCategories.map((cat) => (
              <Card key={cat.id} className="glass-card p-4 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: cat.color || '#10b981' }}
                >
                  <Tag className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-100 truncate">{cat.name}</p>
                  <span className="text-[11px] text-slate-400">Receita</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <CreateCategoryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
