
export interface Project {
  id: string;
  title: string;
  description: string;
  updated: Date;
  chapters: Chapter[];
  characters: Character[];
  notes: Note[];
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  scenes: Scene[];
}

export interface Scene {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  traits: string[];
  background: string;
  image?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
}

export type AIPurpose = 
  | 'plot-idea'
  | 'character-development'
  | 'dialogue'
  | 'setting-description'
  | 'conflict'
  | 'rewrite';

export interface AIPrompt {
  purpose: AIPurpose;
  content: string;
}
