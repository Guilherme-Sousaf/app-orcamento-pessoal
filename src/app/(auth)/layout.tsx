import React from 'react';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-950 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-[128px] pointer-events-none" />

      {/* Brand Logo Header */}
      <Link href="/" className="flex items-center gap-3 mb-8 group">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 text-white shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-transform">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div className="text-left">
          <span className="text-2xl font-bold tracking-tight text-white">
            Orça<span className="text-indigo-400">+</span>
          </span>
          <p className="text-xs text-slate-400 font-medium">Controle Financeiro Inteligente</p>
        </div>
      </Link>

      <div className="w-full max-w-md">{children}</div>

      <p className="mt-8 text-center text-xs text-slate-500">
        &copy; 2026 Orça+. Seguro, privado e moderno.
      </p>
    </div>
  );
}
