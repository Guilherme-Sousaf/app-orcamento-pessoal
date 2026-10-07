export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AccountType = 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment';
export type TransactionType = 'income' | 'expense';

export interface Profile {
  id: string;
  full_name: string | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  initial_balance: number;
  color: string;
  created_at: string;
  updated_at: string;
  current_balance?: number;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  accounts?: Account;
  categories?: Category;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  month: string; // YYYY-MM-01
  limit_amount: number;
  created_at: string;
  updated_at: string;
  // Computed & Joins
  categories?: Category;
  spent_amount?: number;
  percentage?: number;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}
