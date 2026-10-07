'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Wallet,
  Tags,
  Target,
  LogOut,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/lib/actions/auth';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transações', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Orçamentos', href: '/budgets', icon: PieChart },
  { name: 'Contas', href: '/accounts', icon: Wallet },
  { name: 'Categorias', href: '/categories', icon: Tags },
  { name: 'Metas', href: '/goals', icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-slate-950/70 backdrop-blur-xl h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-20 border-b border-white/5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 text-white shadow-lg shadow-indigo-500/20">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-white">
            Orça<span className="text-indigo-400">+</span>
          </span>
          <p className="text-[11px] text-slate-400 font-medium">Gestão Financeira</p>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Menu Principal
        </div>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform group-hover:scale-110',
                  isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* User / Logout Footer */}
      <div className="p-4 border-t border-white/5">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center w-full gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors group cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-rose-400 transition-colors" />
            Sair da Conta
          </button>
        </form>
      </div>
    </aside>
  );
}
