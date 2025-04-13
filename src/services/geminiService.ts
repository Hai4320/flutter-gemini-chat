
import { toast } from "sonner";

// Message types
export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  messages: {
    role: MessageRole;
    content: string;
  }[];
}

// Temporary API key state for the demo
let apiKey = "";

export const setApiKey = (key: string) => {
  apiKey = key;
};

export const getApiKey = () => {
  return apiKey;
};

// Function to send a message to Gemini API
export const sendMessageToGemini = async (messages: Message[]): Promise<string> => {
  if (!apiKey) {
    throw new Error("No API key provided. Please enter a Gemini API key.");
  }

  try {
    // Format messages for the API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // Gemini API endpoint
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get response from Gemini");
    }

    const data = await response.json();
    
    // Extract the response text
    if (data.candidates && data.candidates[0]?.content?.parts) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.error("An unknown error occurred");
    }
    throw error;
  }
};

// Function to generate a unique ID for messages
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
