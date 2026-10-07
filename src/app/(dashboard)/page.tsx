import React from 'react';
import { getDashboardData, getCategories } from '@/lib/data/finance';
import { StatCards } from '@/components/dashboard/StatCards';
import { DashboardCharts } from '@/components/dashboard/Charts';
import { RecentTransactionsList } from '@/components/dashboard/RecentTransactionsList';
import { BudgetSummaryList } from '@/components/dashboard/BudgetSummaryList';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export const metadata = {
  title: 'Dashboard | Orça+ Gestão Financeira',
  description: 'Visão geral do seu orçamento pessoal, receitas, despesas e metas.',
};

export default async function DashboardPage() {
  const data = await getDashboardData();
  const categories = await getCategories();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header com botões de ação */}
      <DashboardHeader accounts={data.accounts} categories={categories} />

      {/* Cards de Métricas Principais */}
      <StatCards
        totalBalance={data.totalBalance}
        monthIncome={data.monthIncome}
        monthExpense={data.monthExpense}
        netSavings={data.netSavings}
      />

      {/* Gráficos Analíticos */}
      <DashboardCharts
        categoryData={data.categoryChartData}
        monthlyHistory={data.monthlyHistory}
      />

      {/* Listas Recentes & Orçamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactionsList transactions={data.recentTransactions} />
        <BudgetSummaryList budgets={data.budgets} />
      </div>
    </div>
  );
}
