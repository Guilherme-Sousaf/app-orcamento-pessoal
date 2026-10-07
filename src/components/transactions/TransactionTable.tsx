'use client';

import React, { useState, useMemo } from 'react';
import { Transaction, Account, Category } from '@/types/database.types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { deleteTransactionAction } from '@/lib/actions/transactions';
import {
  Search,
  Filter,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';

interface TransactionTableProps {
  initialTransactions: Transaction[];
  accounts: Account[];
  categories: Category[];
}

export function TransactionTable({
  initialTransactions,
  accounts,
  categories,
}: TransactionTableProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [accountFilter, setAccountFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter((t) => {
      // Busca por descrição
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Filtro de tipo
      if (typeFilter !== 'all' && t.type !== typeFilter) {
        return false;
      }
      // Filtro de conta
      if (accountFilter !== 'all' && t.account_id !== accountFilter) {
        return false;
      }
      // Filtro de categoria
      if (categoryFilter !== 'all' && t.category_id !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [initialTransactions, search, typeFilter, accountFilter, categoryFilter]);

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir esta transação?')) return;
    setDeletingId(id);
    try {
      await deleteTransactionAction(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Barra de Filtros */}
      <Card className="glass-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl glass-input placeholder-slate-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200"
          >
            <option value="all">Todos os Tipos</option>
            <option value="expense">Apenas Despesas</option>
            <option value="income">Apenas Receitas</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200"
          >
            <option value="all">Todas as Contas</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Tabela de Transações */}
      <Card className="glass-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Transação</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Conta</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhuma transação encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => {
                  const isIncome = t.type === 'income';
                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
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
                            <p className="font-semibold text-slate-100">{t.description}</p>
                            {t.notes && (
                              <p className="text-xs text-slate-400 line-clamp-1">{t.notes}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                          {t.categories?.name || 'Geral'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {t.accounts?.name || 'Conta Padrão'}
                      </td>

                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {formatDate(t.date)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span
                          className={`font-semibold ${
                            isIncome ? 'text-emerald-400' : 'text-slate-100'
                          }`}
                        >
                          {isIncome ? '+' : '-'} {formatCurrency(Number(t.amount))}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(t.id)}
                          disabled={deletingId === t.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                          title="Excluir lançamento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
