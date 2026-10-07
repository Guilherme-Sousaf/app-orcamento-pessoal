import Link from 'next/link';
import {
  TrendingUp,
  ShieldCheck,
  PieChart,
  ArrowRight,
  Wallet,
  Sparkles,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background radial highlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-emerald-500/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-7xl w-full mx-auto px-6 h-24 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Orça<span className="text-indigo-400">+</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Gestão Financeira Descomplicada & Segura</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
          Controle suas finanças com{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            clareza e precisão
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Organize receitas, despesas, orçamentos por categoria e planeje o futuro com um dashboard moderno construído com tecnologia de ponta.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/register">
            <Button size="lg" className="px-8 py-3.5 text-base">
              Começar Agora
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="px-8 py-3.5 text-base">
              Ver Demonstração
            </Button>
          </Link>
        </div>

        {/* Feature Grid Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="glass-card rounded-2xl p-6 border-white/5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Orçamentos Inteligentes</h3>
            <p className="text-sm text-slate-400">
              Defina tetos de gastos por categoria e receba alertas visuais antes de estourar o orçamento mensal.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border-white/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Dashboards em Tempo Real</h3>
            <p className="text-sm text-slate-400">
              Gráficos de evolução patrimonial, divisão de despesas e relatórios exportáveis em CSV.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border-white/5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Segurança Row Level</h3>
            <p className="text-sm text-slate-400">
              Seus dados são 100% isolados no banco de dados com autenticação robusta via Supabase.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        &copy; 2026 Orça+. Desenvolvido com Next.js & Supabase.
      </footer>
    </div>
  );
}
