
import { GoogleGenAI } from "@google/genai";
import { Transaction, MonthlyBudget } from "../types";

// Fix: Initializing GoogleGenAI using the recommended configuration with process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBudget = async (transactions: Transaction[], budgets: MonthlyBudget[]) => {
  const prompt = `
    En tant qu'expert en finances familiales à Madagascar, analyse ces données :
    Transactions: ${JSON.stringify(transactions)}
    Budgets limites: ${JSON.stringify(budgets)}
    La monnaie utilisée est l'Ariary (Ar).
    
    Fournis un résumé concis comprenant :
    1. Un bilan global (revenus vs dépenses).
    2. Les 3 catégories où la famille pourrait économiser.
    3. Une suggestion concrète pour réduire les dépenses le mois prochain.
    4. Un message d'encouragement personnalisé.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text;
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return "Désolé, je ne peux pas analyser vos données pour le moment. Veuillez réessayer plus tard.";
  }
};
