import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { Target, Plus, Calendar, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Metas Financeiras | Orça+',
  description: 'Planeje e conquiste seus objetivos financeiros.',
};

const SAMPLE_GOALS = [
  {
    id: 'g-1',
    name: 'Reserva de Emergência',
    target_amount: 15000,
    current_amount: 10450,
    deadline: '2026-12-31',
    color: '#10b981',
  },
  {
    id: 'g-2',
    name: 'Viagem de Férias',
    target_amount: 8000,
    current_amount: 3200,
    deadline: '2027-02-15',
    color: '#6366f1',
  },
  {
    id: 'g-3',
    name: 'Troca de Smartphone',
    target_amount: 4500,
    current_amount: 4500,
    deadline: '2026-11-20',
    color: '#f59e0b',
  },
];

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Metas & Sonhos
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Acompanhe a evolução das suas economias para atingir seus grandes objetivos.
          </p>
        </div>

        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Nova Meta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_GOALS.map((goal) => {
          const percent = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
          const isCompleted = percent >= 100;

          return (
            <Card key={goal.id} className="glass-card flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: goal.color }}
                    >
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{goal.name}</h3>
                      {goal.deadline && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> Prazo: {goal.deadline}
                        </p>
                      )}
                    </div>
                  </div>

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Sparkles className="w-3 h-3" /> Atingida!
                    </span>
                  )}
                </div>

                <div className="space-y-2 mt-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-white">
                      {formatCurrency(goal.current_amount)}
                    </span>
                    <span className="text-xs text-slate-400">
                      de {formatCurrency(goal.target_amount)}
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: goal.color,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>{formatPercentage(percent)} concluído</span>
                    <span>
                      Faltam{' '}
                      <strong className="text-slate-200">
                        {formatCurrency(Math.max(0, goal.target_amount - goal.current_amount))}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
