import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, MonthlyBudget, Category, TransactionType, FixedTemplate, User } from './types';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { AIAdvisor } from './components/AIAdvisor';
import { Card } from './components/ui/Card';
import { FixedChecklist } from './components/FixedChecklist';
import { MonthSelector } from './components/MonthSelector';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { Settings } from './components/Settings';

const STORAGE_KEY = 'ecofamille_data_v5';

const DEFAULT_USERS: User[] = [
  { id: 'admin', username: 'admin', password: 'admin', role: 'admin', createdAt: new Date().toISOString() },
  { id: 'user1', username: 'famille', password: '123', role: 'user', createdAt: new Date().toISOString() }
];

const DEFAULT_TEMPLATES: FixedTemplate[] = [
  { id: '1', ownerId: 'user1', description: 'Salaire', amount: 1500000, type: 'income', category: Category.Salary },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [templates, setTemplates] = useState<FixedTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'insights' | 'admin' | 'settings'>('overview');
  
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setTransactions(parsed.transactions || []);
      setBudgets(parsed.budgets || []);
      setTemplates(parsed.templates || []);
      setUsers(parsed.users || DEFAULT_USERS);
      
      const savedUser = localStorage.getItem('ecofamille_session');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } else {
      setUsers(DEFAULT_USERS);
      setTemplates(DEFAULT_TEMPLATES);
      setBudgets([
        { category: Category.Housing, limit: 2000000 },
        { category: Category.Food, limit: 800000 },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, budgets, templates, users }));
  }, [transactions, budgets, templates, users]);

  const filteredTransactions = useMemo(() => {
    if (!currentUser) return [];
    return transactions.filter(t => {
      const d = new Date(t.date);
      return t.ownerId === currentUser.id && d.getMonth() === viewMonth && d.getFullYear() === viewYear;
    });
  }, [transactions, viewMonth, viewYear, currentUser]);

  const userTemplates = useMemo(() => {
    if (!currentUser) return [];
    return templates.filter(t => t.ownerId === currentUser.id);
  }, [templates, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ecofamille_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ecofamille_session');
    setActiveTab('overview');
  };

  const addTransaction = (data: any) => {
    if (!currentUser) return;
    const newTx: Transaction = {
      ...data,
      ownerId: currentUser.id,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([newTx, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addTemplate = (data: any) => {
    if (!currentUser) return;
    const newTemplate: FixedTemplate = {
      ...data,
      ownerId: currentUser.id,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTemplates([...templates, newTemplate]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const addUser = (userData: any) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const importData = (data: any) => {
    if (data.transactions) setTransactions(data.transactions);
    if (data.templates) setTemplates(data.templates);
    if (data.budgets) setBudgets(data.budgets);
  };

  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
            </div>
            <span className="text-lg font-bold text-slate-800">EcoFamille</span>
          </div>
          <div className="flex items-center gap-3">
            <MonthSelector 
              month={viewMonth} 
              year={viewYear} 
              onChange={(m: number, y: number) => { setViewMonth(m); setViewYear(y); }} 
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'admin' && currentUser.role === 'admin' ? (
          <AdminPanel users={users} onAddUser={addUser} onDeleteUser={deleteUser} />
        ) : activeTab === 'settings' ? (
          <Settings 
            user={currentUser} 
            onLogout={handleLogout} 
            data={{ transactions, templates, budgets }} 
            onImport={importData}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              {activeTab === 'overview' && <Dashboard transactions={filteredTransactions} />}
              {activeTab === 'transactions' && (
                <div className="space-y-6">
                  <Card title="Ajouter une opération">
                    <TransactionForm onAdd={addTransaction} />
                  </Card>
                  <Card title="Historique récent">
                    <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />
                  </Card>
                </div>
              )}
              {activeTab === 'insights' && <AIAdvisor transactions={filteredTransactions} budgets={budgets} />}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <Card title="Pointage Récurrent" className="bg-blue-50/40 border-blue-100">
                <FixedChecklist 
                  transactions={transactions} 
                  templates={userTemplates}
                  onAddTransaction={(item: any) => addTransaction({...item, date: new Date().toISOString().split('T')[0]})}
                  onRemoveTransaction={deleteTransaction}
                  onAddTemplate={addTemplate}
                  onDeleteTemplate={deleteTemplate}
                  viewMonth={viewMonth}
                  viewYear={viewYear}
                />
              </Card>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-50 md:hidden pb-safe">
        <button onClick={() => setActiveTab('overview')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'overview' ? 'text-blue-600' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span className="text-[10px] font-bold">Accueil</span>
        </button>
        <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'transactions' ? 'text-blue-600' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
          <span className="text-[10px] font-bold">Opérations</span>
        </button>
        <button onClick={() => setActiveTab('insights')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'insights' ? 'text-blue-600' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>
          <span className="text-[10px] font-bold">Conseils IA</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'settings' ? 'text-blue-600' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span className="text-[10px] font-bold">Réglages</span>
        </button>
      </nav>

      <div className="hidden md:flex fixed left-0 top-16 bottom-0 w-20 bg-white border-r border-slate-200 flex-col items-center py-8 gap-8 z-30">
        <NavIcon icon="home" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <NavIcon icon="plus" active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
        <NavIcon icon="cpu" active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} />
        {currentUser.role === 'admin' && <NavIcon icon="shield" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />}
        <NavIcon icon="settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>
    </div>
  );
};

const NavIcon = ({ icon, active, onClick }: { icon: string, active: boolean, onClick: () => void }) => {
  const icons: any = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>,
    plus: <path d="M12 5v14M5 12h14"></path>,
    cpu: <circle cx="12" cy="12" r="10"></circle>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>,
    settings: <circle cx="12" cy="12" r="3"></circle>
  };
  return (
    <button onClick={onClick} className={`p-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icons[icon]}
      </svg>
    </button>
  );
};

export default App;