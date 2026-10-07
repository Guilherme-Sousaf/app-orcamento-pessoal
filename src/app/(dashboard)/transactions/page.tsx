import React from 'react';
import { getTransactions, getAccounts, getCategories } from '@/lib/data/finance';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export const metadata = {
  title: 'Transações | Orça+',
  description: 'Histórico completo de lançamentos de receitas e despesas.',
};

export default async function TransactionsPage() {
  const [transactions, accounts, categories] = await Promise.all([
    getTransactions(),
    getAccounts(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <DashboardHeader accounts={accounts} categories={categories} />
      <TransactionTable
        initialTransactions={transactions}
        accounts={accounts}
        categories={categories}
      />
    </div>
  );
}
