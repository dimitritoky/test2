
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Transaction, Category } from '../types';
import { Card } from './ui/Card';

interface DashboardProps {
  transactions: Transaction[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  const recentActivityData = transactions.slice(-10).map(t => ({
    name: new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    amount: t.type === 'income' ? t.amount : -t.amount,
    type: t.type
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-emerald-100">
          <p className="text-emerald-600 text-sm font-medium">Revenus Totaux</p>
          <p className="text-3xl font-bold text-emerald-900 mt-1">{totalIncome.toLocaleString('fr-FR')} Ar</p>
        </Card>
        <Card className="bg-rose-50 border-rose-100">
          <p className="text-rose-600 text-sm font-medium">Dépenses Totales</p>
          <p className="text-3xl font-bold text-rose-900 mt-1">{totalExpense.toLocaleString('fr-FR')} Ar</p>
        </Card>
        <Card className={`${balance >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
          <p className={`${balance >= 0 ? 'text-blue-600' : 'text-orange-600'} text-sm font-medium`}>Solde</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-900' : 'text-orange-900'} mt-1`}>
            {balance.toLocaleString('fr-FR')} Ar
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Répartition des Dépenses">
          <div className="h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toLocaleString('fr-FR')} Ar`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Aucune dépense à afficher
              </div>
            )}
          </div>
        </Card>

        <Card title="Flux de Trésorerie Récents">
          <div className="h-64">
             {recentActivityData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recentActivityData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} formatter={(value: number) => `${value.toLocaleString('fr-FR')} Ar`} />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {recentActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-400">
                En attente de transactions...
              </div>
             )}
          </div>
        </Card>
      </div>
    </div>
  );
};
