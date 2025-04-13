
import { toast } from "sonner";
import { AIPurpose, OllamaConfig } from "@/types";

// Default Ollama configuration
export const defaultOllamaConfig: OllamaConfig = {
  enabled: false,
  serverUrl: "http://127.0.0.1:11434",
  model: "llama3"
};

// Available Ollama models
export const availableOllamaModels = [
  { value: "llama3", label: "Llama 3" },
  { value: "mistral", label: "Mistral" },
  { value: "gemma", label: "Gemma" },
  { value: "phi", label: "Phi-2" },
  { value: "mixtral", label: "Mixtral" },
  { value: "codellama", label: "Code Llama" }
];

// Get Ollama configuration from localStorage or use default
export const getOllamaConfig = (): OllamaConfig => {
  const storedConfig = localStorage.getItem("ollamaConfig");
  if (storedConfig) {
    try {
      return JSON.parse(storedConfig);
    } catch (error) {
      console.error("Error parsing Ollama config:", error);
      return defaultOllamaConfig;
    }
  }
  return defaultOllamaConfig;
};

// Save Ollama configuration to localStorage
export const saveOllamaConfig = (config: OllamaConfig): void => {
  localStorage.setItem("ollamaConfig", JSON.stringify(config));
};

// Generate response using Ollama API
export const generateOllamaResponse = async (purpose: AIPurpose, content: string): Promise<string> => {
  const config = getOllamaConfig();
  
  if (!config.enabled) {
    throw new Error("Ollama integration is disabled");
  }
  
  try {
    const systemPrompt = getSystemPromptForPurpose(purpose);
    
    const response = await fetch(`${config.serverUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        prompt: content,
        system: systemPrompt,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error generating Ollama response:", error);
    throw error;
  }
};

// Generate system prompts based on purpose
const getSystemPromptForPurpose = (purpose: AIPurpose): string => {
  switch (purpose) {
    case 'plot-idea':
      return "You are a creative writing assistant. Generate three unique and creative plot ideas or plot twists. Be specific, original, and provide enough detail to spark inspiration.";
    case 'character-development':
      return "You are a character development expert. Suggest detailed character development opportunities or backstory elements. Focus on creating complex, believable characters with depth.";
    case 'dialogue':
      return "You are a dialogue expert. Write realistic, engaging, and character-appropriate dialogue. Ensure the dialogue reveals character and advances the narrative.";
    case 'setting-description':
      return "You are a setting description specialist. Create vivid, immersive descriptions that engage multiple senses and establish atmosphere, mood, and context.";
    case 'conflict':
      return "You are a narrative conflict expert. Suggest compelling conflicts or obstacles that create tension, challenge characters, and drive plot development.";
    case 'rewrite':
      return "You are an editing assistant. Rewrite the provided text to improve quality, clarity, and impact while maintaining the original meaning and voice.";
    default:
      return "You are a helpful writing assistant. Provide thoughtful, creative, and useful responses to help with writing projects.";
  }
};

// Test Ollama connection
export const testOllamaConnection = async (config: OllamaConfig): Promise<boolean> => {
  try {
    const response = await fetch(`${config.serverUrl}/api/tags`, {
      method: "GET",
    });
    
    if (!response.ok) {
      throw new Error(`Ollama server connection failed: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error("Ollama connection test failed:", error);
    return false;
  }
};

