import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Transaction } from '@/types/database.types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { ArrowUpRight, ArrowDownLeft, ChevronRight } from 'lucide-react';

interface RecentTransactionsListProps {
  transactions: Transaction[];
}

export function RecentTransactionsList({ transactions }: RecentTransactionsListProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Últimas Transações</CardTitle>
        <Link
          href="/transactions"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          Ver todas <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-6">
            Nenhuma transação registrada ainda.
          </p>
        ) : (
          transactions.map((t) => {
            const isIncome = t.type === 'income';
            return (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200 line-clamp-1">
                      {t.description}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-400">
                        {formatDate(t.date)}
                      </span>
                      {t.categories && (
                        <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {t.categories.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      isIncome ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(Number(t.amount))}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {t.accounts?.name || 'Conta'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
