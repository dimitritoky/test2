
export type TransactionType = 'income' | 'expense';
export type UserRole = 'admin' | 'user';

export enum Category {
  Housing = 'Logement',
  Food = 'Alimentation',
  Transport = 'Transport',
  Health = 'Santé',
  Leisure = 'Loisirs',
  Education = 'Éducation',
  Salary = 'Salaire',
  Bonus = 'Prime',
  Other = 'Autre'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  createdAt: string;
}

export interface Transaction {
  id: string;
  ownerId: string; // Lien avec l'utilisateur
  date: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
}

export interface FixedTemplate {
  id: string;
  ownerId: string; // Lien avec l'utilisateur
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export interface MonthlyBudget {
  category: Category;
  limit: number;
}

export interface FamilyState {
  transactions: Transaction[];
  budgets: MonthlyBudget[];
  templates: FixedTemplate[];
  users: User[];
}
