import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCurse = async (appName: string, durationDays: number): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "The void stares back at you. You are bound by your own will.";

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are an ancient digital entity called SkinnerBox. 
      A user has decided to "bury" (block) an app called "${appName}" for ${durationDays} days to detox their dopamine.
      Write a cryptic, unsettling, analog-horror style epitaph (maximum 25 words) for this burial certificate.
      Do not be overly aggressive, but be eerie, psychological, and final. 
      Example: "Here lies the scrolling finger. It twitches no more in the static."
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text.trim() || "The screen goes black. You are free.";
  } catch (error) {
    console.error("Gemini failed to curse:", error);
    return "The silence is deafening. Do not dig this up.";
  }
};
