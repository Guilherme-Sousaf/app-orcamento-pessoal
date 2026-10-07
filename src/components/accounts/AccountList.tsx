'use client';

import React, { useState } from 'react';
import { Account } from '@/types/database.types';
import { formatCurrency } from '@/lib/formatters';
import { deleteAccountAction } from '@/lib/actions/accounts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreateAccountModal } from './CreateAccountModal';
import { Plus, Trash2, Wallet, Landmark, CreditCard, Banknote, LineChart } from 'lucide-react';

interface AccountListProps {
  accounts: Account[];
}

export function AccountList({ accounts }: AccountListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'savings':
        return Landmark;
      case 'credit_card':
        return CreditCard;
      case 'cash':
        return Banknote;
      case 'investment':
        return LineChart;
      default:
        return Wallet;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'checking':
        return 'Conta Corrente';
      case 'savings':
        return 'Poupança / Reserva';
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'cash':
        return 'Dinheiro Físico';
      case 'investment':
        return 'Investimentos';
      default:
        return 'Conta';
    }
  };

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir esta conta?')) return;
    setDeletingId(id);
    try {
      const res = await deleteAccountAction(id);
      if (res && !res.success && res.error) {
        alert(res.error);
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Suas Contas & Carteiras
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Gerencie onde seu dinheiro está guardado e alocado.
          </p>
        </div>

        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Adicionar Conta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => {
          const Icon = getIcon(acc.type);
          const balance = acc.current_balance ?? acc.initial_balance;

          return (
            <Card key={acc.id} className="glass-card relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: acc.color || '#3b82f6' }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{acc.name}</h3>
                    <p className="text-xs text-slate-400">{getTypeLabel(acc.type)}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(acc.id)}
                  disabled={deletingId === acc.id}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Excluir conta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Saldo Disponível
                </span>
                <p
                  className={`text-2xl font-extrabold mt-1 ${
                    balance >= 0 ? 'text-white' : 'text-rose-400'
                  }`}
                >
                  {formatCurrency(balance)}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <CreateAccountModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
