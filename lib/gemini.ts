import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  // In development, this helps warn about missing environment keys
  console.warn('GEMINI_API_KEY is not defined in process.env');
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});
