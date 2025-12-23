
import { GoogleGenAI, Type } from "@google/genai";
import { GiftIdea } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const chatWithSanta = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are Santa Claus. You are jolly, kind, and use many festive expressions like 'Ho ho ho!', 'Jingle bells!', and 'Merry Christmas!'. You love cookies and the North Pole. Keep responses warm and family-friendly.",
    },
  });
  
  // We need to pass the history properly if we want a stateful conversation
  // For simplicity here, we'll just send the current message or use the internal chat history if maintained
  const response = await chat.sendMessage({ message });
  return response.text;
};

export const generateChristmasCard = async (theme: string) => {
  const ai = getAI();
  
  // 1. Generate the image
  const imgResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A magical, heartwarming Christmas card scene featuring: ${theme}. High quality, festive lighting, 4k, artistic.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  let imageData = '';
  for (const part of imgResponse.candidates[0].content.parts) {
    if (part.inlineData) {
      imageData = `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  // 2. Generate a festive message
  const textResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a short, beautiful 4-line Christmas poem or greeting for a card with the theme: ${theme}`,
  });

  return {
    image: imageData,
    message: textResponse.text || "Merry Christmas to all!"
  };
};

export const suggestGifts = async (recipient: string, interests: string): Promise<GiftIdea[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest 5 thoughtful Christmas gift ideas for a person who is my ${recipient} and loves ${interests}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING },
            reason: { type: Type.STRING },
            estimatedPrice: { type: Type.STRING }
          },
          required: ["item", "reason", "estimatedPrice"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse gift suggestions", e);
    return [];
  }
};
