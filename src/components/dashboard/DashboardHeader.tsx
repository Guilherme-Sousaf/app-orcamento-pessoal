'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CreateTransactionModal } from '@/components/transactions/CreateTransactionModal';
import { Account, Category } from '@/types/database.types';
import { Plus, Download } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  accounts: Account[];
  categories: Category[];
}

export function DashboardHeader({ accounts, categories }: DashboardHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Visão Geral Financeira
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Acompanhe a saúde do seu orçamento e evolução dos seus gastos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/api/export-csv">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1.5" />
              Exportar CSV
            </Button>
          </Link>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Nova Transação
          </Button>
        </div>
      </div>

      <CreateTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        accounts={accounts}
        categories={categories}
      />
    </>
  );
}
