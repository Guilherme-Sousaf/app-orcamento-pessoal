import React from 'react';
import { getAccounts } from '@/lib/data/finance';
import { AccountList } from '@/components/accounts/AccountList';

export const metadata = {
  title: 'Contas Bancárias | Orça+',
  description: 'Gerencie todas as suas contas e cartões em um só lugar.',
};

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="space-y-6">
      <AccountList accounts={accounts} />
    </div>
  );
}
