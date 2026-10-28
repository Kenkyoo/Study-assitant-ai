import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Falta la variable GEMINI_API_KEY en las variables de entorno');
}

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
