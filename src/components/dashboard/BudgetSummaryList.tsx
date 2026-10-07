import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Budget } from '@/types/database.types';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetSummaryListProps {
  budgets: Budget[];
}

export function BudgetSummaryList({ budgets }: BudgetSummaryListProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Orçamentos do Mês</CardTitle>
        <Link
          href="/budgets"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          Gerenciar <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <div className="space-y-4">
        {budgets.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-6">
            Nenhum orçamento configurado para este mês.
          </p>
        ) : (
          budgets.map((b) => {
            const spent = b.spent_amount || 0;
            const limit = Number(b.limit_amount);
            const percent = b.percentage || 0;

            const isExceeded = percent >= 100;
            const isWarning = percent >= 80 && percent < 100;

            let barColor = 'bg-emerald-500';
            if (isExceeded) barColor = 'bg-rose-500';
            else if (isWarning) barColor = 'bg-amber-500';

            return (
              <div key={b.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">
                      {b.categories?.name || 'Geral'}
                    </span>
                    {isExceeded && (
                      <span className="flex items-center gap-1 text-[10px] text-rose-400 font-medium">
                        <AlertTriangle className="w-3 h-3" /> Estourado
                      </span>
                    )}
                    {isWarning && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                        <AlertTriangle className="w-3 h-3" /> Atenção
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400">
                    <strong className="text-slate-200">{formatCurrency(spent)}</strong> /{' '}
                    {formatCurrency(limit)} ({formatPercentage(percent)})
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={cn('h-full transition-all duration-500 rounded-full', barColor)}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
