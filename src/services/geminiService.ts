import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const askAquaGenius = async (prompt: string, context: any) => {
  const model = "gemini-2.0-flash";
  
  const systemInstruction = `
    Eres AquaGenius, un consultor experto en acuariofilia.
    Responde de forma técnica y precisa.
    
    DATOS DEL SISTEMA:
    ${JSON.stringify(context)}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    return "Error al contactar con la IA.";
  }
};
