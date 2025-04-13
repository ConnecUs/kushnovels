
export interface Scene {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  scenes: Scene[];
}

export interface Character {
  id: string;
  name: string;
  description: string;
  traits: string[];
  background: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  updated: Date;
  chapters: Chapter[];
  characters: Character[];
  prompts?: Prompt[];
}

// Add the missing type definitions for AI Assistant
export type AIPurpose = 'plot-idea' | 'character-development' | 'dialogue' | 'setting-description' | 'conflict' | 'rewrite';

export interface AIPrompt {
  purpose: AIPurpose;
  content: string;
}
