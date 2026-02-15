
import React from 'react';

interface MonthSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const MonthSelector: React.FC<MonthSelectorProps> = ({ month, year, onChange }) => {
  const handlePrev = () => {
    if (month === 0) onChange(11, year - 1);
    else onChange(month - 1, year);
  };

  const handleNext = () => {
    if (month === 11) onChange(0, year + 1);
    else onChange(month + 1, year);
  };

  const isCurrentMonth = new Date().getMonth() === month && new Date().getFullYear() === year;

  return (
    <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
      <button 
        onClick={handlePrev}
        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      
      <div className="flex flex-col items-center min-w-[140px]">
        <span className="text-sm font-bold text-slate-800">{MONTHS[month]} {year}</span>
        {isCurrentMonth && <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Mois en cours</span>}
      </div>

      <button 
        onClick={handleNext}
        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  );
};
