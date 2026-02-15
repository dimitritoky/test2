
import React from 'react';
import { Transaction } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Catégorie</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Montant</th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                Aucune transaction trouvée.
              </td>
            </tr>
          ) : (
            [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm text-slate-600">
                  {new Date(t.date).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="p-2 bg-slate-100 rounded-lg mr-3 text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {CATEGORY_ICONS[t.category] || <circle cx="12" cy="12" r="10" />}
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{t.category}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{t.description}</td>
                <td className={`px-4 py-3 text-sm font-semibold text-right ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('fr-FR')} Ar
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
