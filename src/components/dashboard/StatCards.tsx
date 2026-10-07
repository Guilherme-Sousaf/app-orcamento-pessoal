import React from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/formatters';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardsProps {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  netSavings: number;
}

export function StatCards({
  totalBalance,
  monthIncome,
  monthExpense,
  netSavings,
}: StatCardsProps) {
  const cards = [
    {
      title: 'Saldo Consolidado',
      value: totalBalance,
      icon: Wallet,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      description: 'Total em todas as contas ativas',
    },
    {
      title: 'Receitas do Mês',
      value: monthIncome,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      description: 'Entradas acumuladas neste mês',
    },
    {
      title: 'Despesas do Mês',
      value: monthExpense,
      icon: TrendingDown,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      description: 'Gastos computados no período',
    },
    {
      title: 'Economia Líquida',
      value: netSavings,
      icon: PiggyBank,
      color: netSavings >= 0 ? 'text-sky-400' : 'text-amber-400',
      bgColor: netSavings >= 0 ? 'bg-sky-500/10 border-sky-500/20' : 'bg-amber-500/10 border-amber-500/20',
      description: netSavings >= 0 ? 'Superávit financeiro mensal' : 'Déficit no período mensal',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="glass-card relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center border',
                  card.bgColor
                )}
              >
                <Icon className={cn('w-4 h-4', card.color)} />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold tracking-tight text-white">
                {formatCurrency(card.value)}
              </h3>
              <p className="mt-1 text-xs text-slate-400">{card.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
