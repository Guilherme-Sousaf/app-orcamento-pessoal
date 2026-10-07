'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';

interface ChartsProps {
  categoryData: { name: string; value: number; color: string }[];
  monthlyHistory: { month: string; receitas: number; despesas: number }[];
}

export function DashboardCharts({ categoryData, monthlyHistory }: ChartsProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasCategoryData = categoryData && categoryData.length > 0;

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card h-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Fluxo dos Últimos 6 Meses</CardTitle>
          </CardHeader>
          <div className="h-60 w-full rounded-xl bg-slate-900/40 animate-pulse" />
        </Card>
        <Card className="glass-card h-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <div className="h-60 w-full rounded-xl bg-slate-900/40 animate-pulse" />
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico 1: Evolução Comparativa Receitas x Despesas */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Fluxo dos Últimos 6 Meses</CardTitle>
          <span className="text-xs text-slate-400">Receitas vs. Despesas</span>
        </CardHeader>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `R$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl glass-panel p-3 text-xs shadow-xl border border-white/10 space-y-1">
                        <p className="font-semibold text-slate-200 mb-1">{label}</p>
                        <p className="text-emerald-400">
                          Receitas: {formatCurrency(Number(payload[0].value))}
                        </p>
                        <p className="text-rose-400">
                          Despesas: {formatCurrency(Number(payload[1]?.value || 0))}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar dataKey="receitas" fill="#10b981" radius={[6, 6, 0, 0]} name="Receitas" />
              <Bar dataKey="despesas" fill="#ef4444" radius={[6, 6, 0, 0]} name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gráfico 2: Despesas por Categoria (Donut) */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <span className="text-xs text-slate-400">Distribuição no mês atual</span>
        </CardHeader>
        <div className="h-72 w-full flex items-center justify-center">
          {hasCategoryData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl glass-panel p-2.5 text-xs shadow-xl border border-white/10">
                          <p className="font-semibold text-slate-200">{data.name}</p>
                          <p className="text-indigo-400 mt-1">{formatCurrency(data.value)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-slate-500 text-sm">
              <p>Nenhuma despesa registrada no mês atual.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
