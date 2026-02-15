
import React from 'react';

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Logement: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  Alimentation: <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />,
  Transport: <path d="M14 10V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2m4 0h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6M10 18v2M14 18v2" />,
  Santé: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  Loisirs: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </>
  ),
  Éducation: <path d="M22 10v6M2 10l10-5 10 5-10 5z" />,
  Salaire: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="12" y1="11" x2="12" y2="15" />
    </>
  ),
  Prime: <path d="M6 9l6 6 6-6" />,
  Autre: <path d="M12 2v20M2 12h20" />
};

export const CATEGORIES_LIST = [
  'Logement', 'Alimentation', 'Transport', 'Santé', 'Loisirs', 'Éducation', 'Salaire', 'Prime', 'Autre'
];
