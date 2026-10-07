import React from 'react';
import { getBudgetsWithProgress, getCategories } from '@/lib/data/finance';
import { BudgetList } from '@/components/budgets/BudgetList';

export const metadata = {
  title: 'Orçamentos Mensais | Orça+',
  description: 'Controle tetos de gastos e evite surpresas financeiras.',
};

export default async function BudgetsPage() {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [budgets, categories] = await Promise.all([
    getBudgetsWithProgress(currentMonth),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <BudgetList
        budgets={budgets}
        categories={categories}
        currentMonth={currentMonth}
      />
    </div>
  );
}
