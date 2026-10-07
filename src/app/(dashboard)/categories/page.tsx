import React from 'react';
import { getCategories } from '@/lib/data/finance';
import { CategoryList } from '@/components/categories/CategoryList';

export const metadata = {
  title: 'Categorias | Orça+',
  description: 'Gerencie categorias de receitas e despesas.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <CategoryList categories={categories} />
    </div>
  );
}
