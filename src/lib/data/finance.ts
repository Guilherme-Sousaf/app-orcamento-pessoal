import { createClient } from '@/lib/supabase/server';
import { Account, Category, Transaction, Budget } from '@/types/database.types';

// Dados de demonstração padrão (usados quando o banco ainda não possuir lançamentos ou antes de configurar as chaves)
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', user_id: 'demo', name: 'Alimentação', type: 'expense', icon: 'Utensils', color: '#ef4444', created_at: '' },
  { id: 'cat-2', user_id: 'demo', name: 'Moradia', type: 'expense', icon: 'Home', color: '#f97316', created_at: '' },
  { id: 'cat-3', user_id: 'demo', name: 'Transporte', type: 'expense', icon: 'Car', color: '#eab308', created_at: '' },
  { id: 'cat-4', user_id: 'demo', name: 'Saúde', type: 'expense', icon: 'HeartPulse', color: '#ec4899', created_at: '' },
  { id: 'cat-5', user_id: 'demo', name: 'Lazer', type: 'expense', icon: 'Gamepad2', color: '#8b5cf6', created_at: '' },
  { id: 'cat-6', user_id: 'demo', name: 'Salário', type: 'income', icon: 'Briefcase', color: '#10b981', created_at: '' },
  { id: 'cat-7', user_id: 'demo', name: 'Investimentos', type: 'income', icon: 'TrendingUp', color: '#059669', created_at: '' },
];

const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc-1', user_id: 'demo', name: 'Conta Corrente', type: 'checking', initial_balance: 3500.00, color: '#3b82f6', created_at: '', updated_at: '', current_balance: 4250.00 },
  { id: 'acc-2', user_id: 'demo', name: 'Reserva de Emergência', type: 'savings', initial_balance: 10000.00, color: '#10b981', created_at: '', updated_at: '', current_balance: 10450.00 },
  { id: 'acc-3', user_id: 'demo', name: 'Cartão Platinum', type: 'credit_card', initial_balance: 0, color: '#8b5cf6', created_at: '', updated_at: '', current_balance: -850.00 },
];

export async function getAccounts(): Promise<Account[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return DEFAULT_ACCOUNTS;

    const { data: accounts, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !accounts || accounts.length === 0) {
      return DEFAULT_ACCOUNTS;
    }

    // Calcular saldos atuais
    const { data: txs } = await supabase
      .from('transactions')
      .select('account_id, type, amount');

    return accounts.map((acc) => {
      let balance = Number(acc.initial_balance) || 0;
      if (txs) {
        txs
          .filter((t) => t.account_id === acc.id)
          .forEach((t) => {
            if (t.type === 'income') balance += Number(t.amount);
            else balance -= Number(t.amount);
          });
      }
      return { ...acc, current_balance: balance };
    });
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return DEFAULT_CATEGORIES;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CATEGORIES;
    }
    return data;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  accountId?: string;
  type?: 'income' | 'expense';
  search?: string;
}

export async function getTransactions(filters?: TransactionFilter): Promise<Transaction[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Mock inicial para preview se deslogado
      return [
        {
          id: 't-1',
          user_id: 'demo',
          account_id: 'acc-1',
          category_id: 'cat-6',
          type: 'income',
          amount: 6500.0,
          date: new Date().toISOString().split('T')[0],
          description: 'Salário Mensal',
          notes: 'Pagamento CLT',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          accounts: DEFAULT_ACCOUNTS[0],
          categories: DEFAULT_CATEGORIES[5],
        },
        {
          id: 't-2',
          user_id: 'demo',
          account_id: 'acc-1',
          category_id: 'cat-1',
          type: 'expense',
          amount: 450.8,
          date: new Date().toISOString().split('T')[0],
          description: 'Supermercado Mensal',
          notes: 'Compras de alimentação',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          accounts: DEFAULT_ACCOUNTS[0],
          categories: DEFAULT_CATEGORIES[0],
        },
        {
          id: 't-3',
          user_id: 'demo',
          account_id: 'acc-3',
          category_id: 'cat-2',
          type: 'expense',
          amount: 1800.0,
          date: new Date().toISOString().split('T')[0],
          description: 'Aluguel do Apartamento',
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          accounts: DEFAULT_ACCOUNTS[2],
          categories: DEFAULT_CATEGORIES[1],
        },
      ];
    }

    let query = supabase
      .from('transactions')
      .select('*, accounts(*), categories(*)')
      .order('date', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.accountId) {
      query = query.eq('account_id', filters.accountId);
    }
    if (filters?.startDate) {
      query = query.gte('date', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate);
    }
    if (filters?.search) {
      query = query.ilike('description', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function getBudgetsWithProgress(monthString: string): Promise<Budget[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const formattedMonth = `${monthString}-01`;

    if (!user) {
      return [
        {
          id: 'b-1',
          user_id: 'demo',
          category_id: 'cat-1',
          month: formattedMonth,
          limit_amount: 1200.0,
          created_at: '',
          updated_at: '',
          categories: DEFAULT_CATEGORIES[0],
          spent_amount: 850.0,
          percentage: 70.8,
        },
        {
          id: 'b-2',
          user_id: 'demo',
          category_id: 'cat-2',
          month: formattedMonth,
          limit_amount: 2000.0,
          created_at: '',
          updated_at: '',
          categories: DEFAULT_CATEGORIES[1],
          spent_amount: 1800.0,
          percentage: 90.0,
        },
        {
          id: 'b-3',
          user_id: 'demo',
          category_id: 'cat-5',
          month: formattedMonth,
          limit_amount: 400.0,
          created_at: '',
          updated_at: '',
          categories: DEFAULT_CATEGORIES[4],
          spent_amount: 430.0,
          percentage: 107.5,
        },
      ];
    }

    const { data: budgets } = await supabase
      .from('budgets')
      .select('*, categories(*)')
      .eq('month', formattedMonth);

    if (!budgets || budgets.length === 0) return [];

    // Calcular o total gasto na categoria no mês selecionado
    const startOfMonth = formattedMonth;
    const parts = monthString.split('-');
    const nextMonth = new Date(parseInt(parts[0]), parseInt(parts[1]), 1)
      .toISOString()
      .split('T')[0];

    const { data: expenseTxs } = await supabase
      .from('transactions')
      .select('category_id, amount')
      .eq('type', 'expense')
      .gte('date', startOfMonth)
      .lt('date', nextMonth);

    return budgets.map((b) => {
      const spent = (expenseTxs || [])
        .filter((tx) => tx.category_id === b.category_id)
        .reduce((sum, tx) => sum + Number(tx.amount), 0);
      const limit = Number(b.limit_amount);
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;

      return {
        ...b,
        spent_amount: spent,
        percentage: Math.min(percentage, 999),
      };
    });
  } catch {
    return [];
  }
}

export async function getDashboardData() {
  const accounts = await getAccounts();
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const budgets = await getBudgetsWithProgress(currentMonthStr);
  const transactions = await getTransactions();

  // Calcular saldo consolidado total
  const totalBalance = accounts.reduce((acc, a) => acc + (a.current_balance || 0), 0);

  // Calcular receitas e despesas do mês corrente
  const startOfMonth = `${currentMonthStr}-01`;
  const monthTransactions = transactions.filter((t) => t.date >= startOfMonth);

  const monthIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netSavings = monthIncome - monthExpense;

  // Distribuição de despesas por categoria para o gráfico Donut
  const expensesByCategoryMap: { [catName: string]: { name: string; value: number; color: string } } = {};
  monthTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const catName = t.categories?.name || 'Outras';
      const catColor = t.categories?.color || '#64748b';
      if (!expensesByCategoryMap[catName]) {
        expensesByCategoryMap[catName] = { name: catName, value: 0, color: catColor };
      }
      expensesByCategoryMap[catName].value += Number(t.amount);
    });

  const categoryChartData = Object.values(expensesByCategoryMap);

  // Histórico dos últimos 6 meses para o gráfico de barras
  const monthlyHistory = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('pt-BR', { month: 'short' });

    const txsInMonth = transactions.filter((t) => t.date.startsWith(mStr));
    const inc = txsInMonth.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const exp = txsInMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

    monthlyHistory.push({
      month: label.toUpperCase(),
      receitas: inc,
      despesas: exp,
    });
  }

  return {
    totalBalance,
    monthIncome,
    monthExpense,
    netSavings,
    accounts,
    budgets,
    recentTransactions: transactions.slice(0, 5),
    categoryChartData,
    monthlyHistory,
    currentMonthStr,
  };
}
