
import React, { useState } from 'react';
import { Transaction, MonthlyBudget } from '../types';
import { analyzeBudget } from '../services/geminiService';
import { Card } from './ui/Card';

interface AIAdvisorProps {
  transactions: Transaction[];
  budgets: MonthlyBudget[];
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions, budgets }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    try {
      const result = await analyzeBudget(transactions, budgets);
      setAnalysis(result || "Impossible d'obtenir une analyse.");
    } catch (err) {
      setAnalysis("Erreur lors de l'analyse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path><path d="M12 12L2.2 9"></path><path d="M12 12L19.8 9"></path><path d="M12 12v10"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Conseiller IA EcoFamille</h3>
            <p className="text-sm text-slate-500">Analyses intelligentes de votre budget</p>
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || transactions.length < 3}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            loading || transactions.length < 3
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 active:scale-95'
          }`}
        >
          {loading ? 'Analyse...' : 'Analyser mon budget'}
        </button>
      </div>

      {transactions.length < 3 && (
        <p className="text-sm text-slate-500 italic">Ajoutez au moins 3 transactions pour activer le conseiller IA.</p>
      )}

      {analysis && !loading && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="prose prose-slate prose-sm max-w-none">
            {analysis.split('\n').map((line, i) => (
              <p key={i} className="mb-2 text-slate-700 leading-relaxed">
                {line.startsWith('- ') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') 
                  ? <span className="font-medium text-indigo-700">{line}</span>
                  : line}
              </p>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-8 flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
          </div>
          <p className="text-indigo-600 text-sm font-medium">Gemini examine vos habitudes financières...</p>
        </div>
      )}
    </Card>
  );
};
