
import React from 'react';
import { User } from '../types';
import { Card } from './ui/Card';

interface SettingsProps {
  user: User;
  onLogout: () => void;
  data: any;
  onImport: (data: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout, data, onImport }) => {
  const handleExport = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `ecofamille_sauvegarde_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        if (e.target?.result) {
          try {
            const parsed = JSON.parse(e.target.result as string);
            onImport(parsed);
            alert("Données importées avec succès !");
          } catch (err) {
            alert("Erreur lors de l'importation du fichier.");
          }
        }
      };
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card title="Votre Profil">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user.username}</h2>
            <p className="text-sm text-slate-500 capitalize">Rôle : {user.role}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="mt-6 w-full py-3 bg-rose-50 text-rose-600 font-bold rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors"
        >
          Se déconnecter
        </button>
      </Card>

      <Card title="Sauvegarde & Sécurité">
        <p className="text-sm text-slate-500 mb-4">
          Vos données sont stockées localement sur ce navigateur. Pour ne jamais les perdre, pensez à exporter régulièrement une sauvegarde.
        </p>
        <div className="space-y-4">
          <button 
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exporter mes données (.json)
          </button>
          
          <label className="w-full flex items-center justify-center gap-2 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            Importer une sauvegarde
            <input type="file" className="hidden" accept=".json" onChange={handleImport} />
          </label>
        </div>
      </Card>

      <div className="text-center">
        <p className="text-xs text-slate-400">EcoFamille Web Version 1.2.0 • Propulsé par Gemini 3 Flash</p>
      </div>
    </div>
  );
};
