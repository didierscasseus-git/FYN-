import { GoogleGenAI, Type } from "@google/genai";
import { Table, Guest, Staff, AIInsightResponse } from '../types';

// Initialize Gemini Client
// In a real scenario, this would check for existence, but we assume valid env based on prompt rules
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeTableStatus = async (
  table: Table,
  guest?: Guest,
  staff?: Staff
): Promise<AIInsightResponse> => {
  try {
    const context = {
      table_status: table.status,
      duration: table.seated_duration,
      is_vip: table.is_vip,
      alerts: table.alerts.map(a => a.message),
      guest_notes: guest?.notes || 'Unknown guest',
      guest_spend: guest?.average_spend,
      server: staff?.name || 'Unassigned',
    };

    const modelId = 'gemini-3-flash-preview';
    
    const prompt = `
      You are an expert Restaurant Manager AI. Analyze the following table context and provide actionable insights for the floor manager.
      
      Context: ${JSON.stringify(context)}
      
      Provide:
      1. A brief analysis of the situation (max 2 sentences).
      2. Three concrete suggested actions for the staff.
      3. A priority score from 1-10 (10 being urgent intervention needed).
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            suggested_actions: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            priority_score: { type: Type.NUMBER }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIInsightResponse;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      analysis: "Unable to analyze table status at this time.",
      suggested_actions: ["Check physical table status", "Verify alerts manually"],
      priority_score: 0
    };
  }
};