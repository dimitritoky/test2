
import React, { useState } from 'react';
import { Transaction, Category, TransactionType, FixedTemplate } from '../types';
import { CATEGORIES_LIST } from '../constants';

interface FixedChecklistProps {
  transactions: Transaction[];
  templates: FixedTemplate[];
  // Fix: Omit ownerId since it is added by the parent component during transaction creation
  onAddTransaction: (item: Omit<FixedTemplate, 'id' | 'ownerId'>) => void;
  onRemoveTransaction: (id: string) => void;
  // Fix: Omit ownerId since it is added by the parent component during template creation
  onAddTemplate: (template: Omit<FixedTemplate, 'id' | 'ownerId'>) => void;
  onDeleteTemplate: (id: string) => void;
  viewMonth: number;
  viewYear: number;
}

export const FixedChecklist: React.FC<FixedChecklistProps> = ({ 
  transactions, 
  templates,
  onAddTransaction, 
  onRemoveTransaction, 
  onAddTemplate,
  onDeleteTemplate,
  viewMonth, 
  viewYear 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<TransactionType>('expense');
  const [newCat, setNewCat] = useState<Category>(Category.Other);

  const findMatchingTransaction = (item: FixedTemplate) => {
    return transactions.find(t => 
      t.description === item.description && 
      t.amount === item.amount &&
      new Date(t.date).getMonth() === viewMonth &&
      new Date(t.date).getFullYear() === viewYear
    );
  };

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;
    // Fix: Passing an object that matches Omit<FixedTemplate, 'id' | 'ownerId'>
    onAddTemplate({
      description: newDesc,
      amount: parseFloat(newAmount),
      type: newType,
      category: newCat
    });
    setNewDesc('');
    setNewAmount('');
    setIsAdding(false);
  };

  const Section = ({ title, items, colorClass }: { title: string, items: FixedTemplate[], colorClass: string }) => (
    <div className="space-y-3">
      <h4 className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>{title}</h4>
      <div className="space-y-2">
        {items.map((item) => {
          const matchingTx = findMatchingTransaction(item);
          const checked = !!matchingTx;
          
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => checked ? onRemoveTransaction(matchingTx.id) : onAddTransaction(item)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  checked 
                    ? 'bg-blue-50/50 border-blue-200 hover:border-rose-300 hover:bg-rose-50/30' 
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                    checked 
                      ? 'bg-blue-600 border-blue-600 group-hover:bg-rose-500 group-hover:border-rose-500' 
                      : 'bg-white border-slate-300'
                  }`}>
                    {checked && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <svg className="absolute group-hover:opacity-0 transition-opacity" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <svg className="absolute opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-medium transition-colors ${checked ? 'text-blue-800 group-hover:text-rose-700' : 'text-slate-700'}`}>
                      {item.description}
                    </p>
                    <p className="text-[10px] text-slate-400">{item.amount.toLocaleString('fr-FR')} Ar • {item.category}</p>
                  </div>
                </div>
                
                <div className="text-[10px] font-bold">
                  {checked ? (
                    <span className="text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded group-hover:hidden">Payé</span>
                  ) : (
                    <span className="text-slate-400 group-hover:text-blue-600">+ Pointer</span>
                  )}
                  {checked && (
                    <span className="hidden group-hover:inline text-rose-600 bg-rose-100/50 px-2 py-0.5 rounded">Retirer</span>
                  )}
                </div>
              </button>
              
              {/* Bouton de suppression du modèle récurrent */}
              {!checked && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteTemplate(item.id); }}
                  className="absolute -left-2 -top-2 opacity-0 group-hover:opacity-100 bg-rose-500 text-white rounded-full p-1 shadow-sm transition-opacity hover:scale-110"
                  title="Supprimer ce modèle récurrent"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <span className="text-[11px] text-slate-400 font-bold uppercase">Ma liste récurrente</span>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${isAdding ? 'bg-slate-200 text-slate-600' : 'bg-blue-600 text-white'}`}
        >
          {isAdding ? 'Annuler' : '+ Nouvel Elément Fixe'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreateTemplate} className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <input 
            type="text" 
            placeholder="Nom (ex: Loyer, Netflix...)" 
            className="w-full text-sm px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="number" 
              placeholder="Montant (Ar)" 
              className="w-full text-sm px-3 py-2 border rounded outline-none"
              value={newAmount}
              onChange={e => setNewAmount(e.target.value)}
              required
            />
            <select 
              className="w-full text-sm px-3 py-2 border rounded outline-none"
              value={newCat}
              onChange={e => setNewCat(e.target.value as Category)}
            >
              {CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => setNewType('income')}
              className={`flex-1 py-1 text-[10px] font-bold rounded ${newType === 'income' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              REVENU
            </button>
            <button 
              type="button" 
              onClick={() => setNewType('expense')}
              className={`flex-1 py-1 text-[10px] font-bold rounded ${newType === 'expense' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              DÉPENSE
            </button>
          </div>
          <button type="submit" className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700">
            Enregistrer ce modèle
          </button>
        </form>
      )}

      <Section 
        title="Revenus Fixes" 
        items={templates.filter(t => t.type === 'income')} 
        colorClass="text-emerald-600" 
      />
      <Section 
        title="Charges Fixes" 
        items={templates.filter(t => t.type === 'expense')} 
        colorClass="text-rose-600" 
      />
    </div>
  );
};
