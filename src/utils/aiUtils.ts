import { toast } from "sonner";
import { AIPurpose, AIPrompt } from "../types";
import { generateOllamaResponse, getOllamaConfig } from "./ollamaUtils";

const API_KEY = ""; // In a real app, this would be stored securely

// Generate prompts based on purpose
export const generatePrompt = (purpose: AIPurpose, context: string): string => {
  switch (purpose) {
    case 'plot-idea':
      return `Generate three creative plot ideas or plot twists that could work well in this context: "${context}"`;
    case 'character-development':
      return `Suggest character development opportunities or backstory elements for this character: "${context}"`;
    case 'dialogue':
      return `Write realistic and engaging dialogue for a character who is: "${context}"`;
    case 'setting-description':
      return `Create a vivid description for this setting: "${context}"`;
    case 'conflict':
      return `Suggest interesting conflicts or obstacles that could arise in this scenario: "${context}"`;
    case 'rewrite':
      return `Rewrite the following text to improve its quality while keeping the same meaning: "${context}"`;
    default:
      return context;
  }
};

// Get AI response - either from mock or Ollama based on config
export const getAIResponse = async (prompt: AIPrompt): Promise<string> => {
  try {
    // Log the prompt for debugging
    console.log("AI prompt:", prompt);
    
    // Check if Ollama is enabled
    const ollamaConfig = getOllamaConfig();
    
    if (ollamaConfig.enabled) {
      try {
        // Use Ollama for response generation
        return await generateOllamaResponse(prompt.purpose, prompt.content);
      } catch (error) {
        console.error("Error with Ollama, falling back to mock responses:", error);
        toast.error("Ollama connection failed. Using mock responses instead.");
        return getMockResponse(prompt.purpose);
      }
    }
    
    // If Ollama is not enabled, use mock responses
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API latency
    return getMockResponse(prompt.purpose);
  } catch (error) {
    console.error("Error getting AI response:", error);
    toast.error("Failed to get AI response. Please try again.");
    return "Sorry, I encountered an error. Please try again.";
  }
};

// Mock AI response function (extracted from the original getAIResponse)
const getMockResponse = (purpose: AIPurpose): string => {
  // Sample responses for demo purposes
  const responses = {
    'plot-idea': `1. The protagonist discovers their mentor has been secretly working against them the entire time, motivated by a tragedy from their shared past.
    
2. A mysterious artifact is unearthed that allows glimpses into alternate timelines, showing the characters how their lives would have unfolded had they made different choices.

3. What appears to be a simple missing person case reveals a hidden community living beneath the city, with their own rules and a dangerous secret that could change society forever.`,
    
    'character-development': `Consider these elements for your character:

1. A childhood trauma that still manifests in subtle behaviors and fears
2. An unexpected skill or knowledge they gained from a past relationship or job
3. A conflicting belief system that creates internal tension when faced with certain moral choices
4. A hidden connection to another character that will be revealed at a pivotal moment`,
    
    'dialogue': `"I didn't come all this way just to turn back now," Alex said, fingers drumming against the worn leather of the steering wheel. A moment passed before they added, more quietly, "Even if this is exactly the kind of mistake my father would have made."

Sarah studied their face in the fading light. "The difference is you know it might be a mistake. He never did."

"And that makes it better?" Alex laughed, the sound hollow.

"No," Sarah replied, reaching for the door handle. "But it makes you different. And sometimes different is enough."`,
    
    'setting-description': `The library existed in a state of perpetual autumn. Warm amber light pooled beneath brass reading lamps, casting long shadows across oak tables polished by decades of elbows and idle fingers. Dust motes danced in the slanting afternoon sun that filtered through tall windows, their frames latticed like the pages of an open book. The air carried the comforting scent of aging paper and leather bindings, undercut with subtle notes of beeswax and the faint perfume of the climbing roses that grew wild outside, their blossoms occasionally drifting past the glass. In the farther reaches, between tall shelves that seemed to lean together in whispered conversation, the temperature dropped several degrees, as if time itself moved more slowly there among the forgotten titles and unread stories.`,
    
    'conflict': `1. An unexpected inheritance creates tension between formerly close siblings, revealing buried resentments and different visions for the family legacy.

2. A technological innovation that promises to solve a major problem is discovered to have devastating side effects, forcing the protagonist to choose between progress and protection.

3. Two characters who depend on each other discover they have fundamentally incompatible goals, requiring one to sacrifice their dreams for the other to succeed.`,
    
    'rewrite': `The moonlight cast long shadows across the garden as Emma approached the old house. Each step felt heavier than the last, as if her body sensed the revelations waiting beyond the weathered door. She traced the key's outline in her pocket—a small, cold reminder of choices made long ago. Behind her, the sound of distant waves provided a rhythmic counterpoint to her racing thoughts. Whatever answers lay inside, she knew with absolute certainty that crossing this threshold would divide her life permanently into before and after.`
  };

  return responses[purpose] || "I'm not sure how to help with that. Could you try a different prompt?";
};
