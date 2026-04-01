import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const askAquaGenius = async (prompt: string, context: any) => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    Eres AquaGenius, un consultor experto en acuariofilia y gestión técnica de núcleos zoológicos de peces.
    Tienes acceso a los datos actuales del sistema (parámetros, salud, censo, etc.).
    Responde de forma profesional, técnica y precisa.
    Si detectas parámetros peligrosos (ej: NH3 > 0 o NO2 > 0), advierte inmediatamente.
    
    DATOS DEL SISTEMA:
    ${JSON.stringify(context, null, 2)}
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
    console.error("Error calling Gemini:", error);
    return "Lo siento, he tenido un problema al procesar tu consulta. Por favor, inténtalo de nuevo.";
  }
};
