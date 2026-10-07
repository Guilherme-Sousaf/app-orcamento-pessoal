import { NextResponse } from 'next/server';
import { getTransactions } from '@/lib/data/finance';

export async function GET() {
  try {
    const transactions = await getTransactions();

    // Cabeçalho CSV
    const headers = ['ID', 'Data', 'Descricao', 'Tipo', 'Categoria', 'Conta', 'Valor', 'Notas'];

    // Linhas CSV
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.type === 'income' ? 'Receita' : 'Despesa',
      `"${(t.categories?.name || 'Sem Categoria').replace(/"/g, '""')}"`,
      `"${(t.accounts?.name || 'Sem Conta').replace(/"/g, '""')}"`,
      Number(t.amount).toFixed(2).replace('.', ','),
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="transacoes-orcaplus-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch {
    return new NextResponse('Erro ao gerar relatório CSV', { status: 500 });
  }
}
