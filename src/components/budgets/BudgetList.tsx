'use client';

import React, { useState } from 'react';
import { Budget, Category } from '@/types/database.types';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { deleteBudgetAction } from '@/lib/actions/budgets';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreateBudgetModal } from './CreateBudgetModal';
import { Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetListProps {
  budgets: Budget[];
  categories: Category[];
  currentMonth: string;
}

export function BudgetList({ budgets, categories, currentMonth }: BudgetListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir este orçamento?')) return;
    setDeletingId(id);
    try {
      await deleteBudgetAction(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Orçamentos Mensais
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Acompanhe o consumo dos seus limites de despesas por categoria.
          </p>
        </div>

        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Definir Novo Teto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 glass-card rounded-2xl">
            <p>Nenhum orçamento configurado para este mês.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setModalOpen(true)}
            >
              Criar Primeiro Orçamento
            </Button>
          </div>
        ) : (
          budgets.map((b) => {
            const spent = b.spent_amount || 0;
            const limit = Number(b.limit_amount);
            const percent = b.percentage || 0;
            const remaining = Math.max(0, limit - spent);

            const isExceeded = percent >= 100;
            const isWarning = percent >= 80 && percent < 100;

            let barColor = 'bg-emerald-500';
            let badgeText = 'Dentro da Meta';
            let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

            if (isExceeded) {
              barColor = 'bg-rose-500';
              badgeText = 'Limite Estourado';
              badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            } else if (isWarning) {
              barColor = 'bg-amber-500';
              badgeText = 'Atenção (>80%)';
              badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            }

            return (
              <Card key={b.id} className="glass-card flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Categoria
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        {b.categories?.name || 'Geral'}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${badgeColor}`}
                    >
                      {isExceeded || isWarning ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <CheckCircle className="w-3 h-3" />
                      )}
                      {badgeText}
                    </span>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-white">
                        {formatCurrency(spent)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        de {formatCurrency(limit)}
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', barColor)}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>{formatPercentage(percent)} consumido</span>
                      <span>
                        {isExceeded ? 'Excedido:' : 'Disponível:'}{' '}
                        <strong
                          className={isExceeded ? 'text-rose-400' : 'text-emerald-400'}
                        >
                          {formatCurrency(Math.abs(limit - spent))}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end">
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={deletingId === b.id}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <CreateBudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        currentMonth={currentMonth}
      />
    </>
  );
}
