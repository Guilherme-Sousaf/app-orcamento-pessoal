'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, PieChart, Wallet, Tags } from 'lucide-react';
import { cn } from '@/lib/utils';

const mobileNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transações', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Orçamentos', href: '/budgets', icon: PieChart },
  { name: 'Contas', href: '/accounts', icon: Wallet },
  { name: 'Categorias', href: '/categories', icon: Tags },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 px-2 py-2">
      <div className="flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[10px] font-medium transition-colors',
                isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Icon className={cn('w-5 h-5 mb-1', isActive ? 'text-indigo-400' : 'text-slate-400')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
