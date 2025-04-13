
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';
import AIAssistant from '@/components/AIAssistant';
import CharacterProfile from '@/components/CharacterProfile';
import ProjectStructure from '@/components/ProjectStructure';
import { Project, Character } from '@/types';

const Index: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [activeChapterId, setActiveChapterId] = useState<string | undefined>(undefined);
  const [activeSceneId, setActiveSceneId] = useState<string | undefined>(undefined);
  
  // Initialize with sample project data
  const [project, setProject] = useState<Project>({
    id: '1',
    title: 'My Novel',
    description: 'A captivating story about adventure and discovery.',
    updated: new Date(),
    chapters: [
      {
        id: 'ch1',
        title: 'Chapter 1: Beginnings',
        order: 0,
        scenes: [
          {
            id: 'sc1',
            title: 'The Awakening',
            content: 'It was a cold morning when everything changed...',
            order: 0,
          },
          {
            id: 'sc2',
            title: 'First Encounter',
            content: 'The stranger approached cautiously, their eyes scanning the horizon...',
            order: 1,
          },
        ],
      },
    ],
    characters: [
      {
        id: 'char1',
        name: 'Alex Morgan',
        description: 'The protagonist with a mysterious past',
        traits: ['brave', 'resourceful', 'haunted'],
        background: 'Grew up in a small town but always dreamed of adventure. Left home at 18 after a family tragedy.',
      },
    ],
    notes: [],
  });

  const handleUpdateProject = (updatedProject: Project) => {
    setProject(updatedProject);
  };

  const handleSaveScene = (content: string, title?: string) => {
    if (!activeChapterId || !activeSceneId) return;

    const updatedProject = {
      ...project,
      chapters: project.chapters.map(chapter =>
        chapter.id === activeChapterId
          ? {
              ...chapter,
              scenes: chapter.scenes.map(scene =>
                scene.id === activeSceneId
                  ? { ...scene, content, ...(title && { title }) }
                  : scene
              ),
            }
          : chapter
      ),
    };

    setProject(updatedProject);
  };

  const handleSelectScene = (chapterId: string, sceneId: string) => {
    setActiveChapterId(chapterId);
    setActiveSceneId(sceneId);
    setActiveTab('editor');
  };

  const handleAddCharacter = (character: Character) => {
    setProject({
      ...project,
      characters: [...project.characters, character],
    });
  };

  const handleUpdateCharacter = (id: string, updatedData: Partial<Character>) => {
    setProject({
      ...project,
      characters: project.characters.map(character =>
        character.id === id ? { ...character, ...updatedData } : character
      ),
    });
  };

  const handleDeleteCharacter = (id: string) => {
    setProject({
      ...project,
      characters: project.characters.filter(character => character.id !== id),
    });
  };

  const activeChapter = activeChapterId
    ? project.chapters.find(chapter => chapter.id === activeChapterId)
    : undefined;

  const activeScene = activeChapter && activeSceneId
    ? activeChapter.scenes.find(scene => scene.id === activeSceneId)
    : undefined;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        project={project}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'editor' && (
          <Editor
            activeChapter={activeChapter}
            activeScene={activeScene}
            onSave={handleSaveScene}
          />
        )}
        
        {activeTab === 'chapters' && (
          <ProjectStructure
            project={project}
            onUpdateProject={handleUpdateProject}
            onSelectScene={handleSelectScene}
            activeChapterId={activeChapterId}
            activeSceneId={activeSceneId}
          />
        )}
        
        {activeTab === 'characters' && (
          <CharacterProfile
            characters={project.characters}
            onAddCharacter={handleAddCharacter}
            onUpdateCharacter={handleUpdateCharacter}
            onDeleteCharacter={handleDeleteCharacter}
          />
        )}
        
        {activeTab === 'ai-assistant' && (
          <AIAssistant />
        )}
      </div>
    </div>
  );
};

export default Index;
