import { GoogleGenAI, Type } from "@google/genai";
import { ExpenseCategory, ExpenseType } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeImage = async (base64Image: string) => {
  if (!process.env.API_KEY) {
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // System instruction to guide the persona
  const systemInstruction = `
    You are an expert financial AI assistant for a "Smart Spending Wallet". 
    Your job is to analyze images of products (drinks, food, clothes) or receipts.
    
    If it is a RECEIPT: Extract the total amount.
    If it is a PRODUCT: Estimate the price in PEN (Peruvian Soles) based on typical market value.
    
    Categorize strictly into one of: Food, Beverage, Clothing, Service, Other.
    Determine type: 'Hormiga' (small/impulse), 'Necesario' (needs), 'Servicio' (utilities).
    
    Return pure JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest', // Good balance of speed and vision capabilities
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, API handles most standard types
              data: base64Image
            }
          },
          {
            text: "Analyze this image. Identify the item, estimate or extract price (in PEN), category, and expense type."
          }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING, description: "Short name of the product or store" },
            amount: { type: Type.NUMBER, description: "Price in PEN" },
            category: { 
              type: Type.STRING, 
              enum: [
                ExpenseCategory.FOOD, 
                ExpenseCategory.BEVERAGE, 
                ExpenseCategory.CLOTHING, 
                ExpenseCategory.SERVICE, 
                ExpenseCategory.OTHER
              ]
            },
            type: {
              type: Type.STRING,
              enum: [
                ExpenseType.HORMIGA,
                ExpenseType.NECESARIO,
                ExpenseType.SERVICIO
              ]
            },
            confidence: { type: Type.NUMBER, description: "Confidence score 0-1" }
          },
          required: ["item", "amount", "category", "type"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response text");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback mock response for demo resilience if API fails or key is invalid
    return {
      item: "Detected Item",
      amount: 0.00,
      category: ExpenseCategory.OTHER,
      type: ExpenseType.HORMIGA,
      confidence: 0
    };
  }
};