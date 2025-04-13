import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Edit, Trash, GripVertical, Pencil, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Chapter, Scene, Project } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { exportChapter, exportProject, exportScene } from '@/utils/exportUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ProjectStructureProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  onSelectScene: (chapterId: string, sceneId: string) => void;
  activeChapterId?: string;
  activeSceneId?: string;
}

const ProjectStructure: React.FC<ProjectStructureProps> = ({
  project,
  onUpdateProject,
  onSelectScene,
  activeChapterId,
  activeSceneId,
}) => {
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [addingChapter, setAddingChapter] = useState(false);
  const [addingSceneToChapter, setAddingSceneToChapter] = useState<string | null>(null);
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [editingScene, setEditingScene] = useState<{ chapterId: string; sceneId: string } | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [exportOptionsOpen, setExportOptionsOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [exportOptions, setExportOptions] = useState({
    includeChapterTitle: true,
    includeSceneTitles: true,
    addPageBreaks: true,
    formatType: "plain" as "plain" | "markdown",
  });

  const toggleChapter = (chapterId: string) => {
    if (expandedChapters.includes(chapterId)) {
      setExpandedChapters(expandedChapters.filter(id => id !== chapterId));
    } else {
      setExpandedChapters([...expandedChapters, chapterId]);
    }
  };

  const handleAddChapter = () => {
    if (!newTitle.trim()) {
      toast.error('Chapter title cannot be empty');
      return;
    }

    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: newTitle,
      order: project.chapters.length,
      scenes: [],
    };

    const updatedProject = {
      ...project,
      chapters: [...project.chapters, newChapter],
    };

    onUpdateProject(updatedProject);
    setAddingChapter(false);
    setNewTitle('');
    setExpandedChapters([...expandedChapters, newChapter.id]);
    toast.success('Chapter added');
  };

  const handleAddScene = (chapterId: string) => {
    if (!newTitle.trim()) {
      toast.error('Scene title cannot be empty');
      return;
    }

    const newScene: Scene = {
      id: Date.now().toString(),
      title: newTitle,
      content: '',
      order: project.chapters.find(c => c.id === chapterId)?.scenes.length || 0,
    };

    const updatedProject = {
      ...project,
      chapters: project.chapters.map(chapter =>
        chapter.id === chapterId
          ? { ...chapter, scenes: [...chapter.scenes, newScene] }
          : chapter
      ),
    };

    onUpdateProject(updatedProject);
    setAddingSceneToChapter(null);
    setNewTitle('');
    toast.success('Scene added');
  };

  const handleUpdateChapterTitle = (chapterId: string) => {
    if (!newTitle.trim()) {
      toast.error('Chapter title cannot be empty');
      return;
    }

    const updatedProject = {
      ...project,
      chapters: project.chapters.map(chapter =>
        chapter.id === chapterId ? { ...chapter, title: newTitle } : chapter
      ),
    };

    onUpdateProject(updatedProject);
    setEditingChapter(null);
    setNewTitle('');
    toast.success('Chapter updated');
  };

  const handleUpdateSceneTitle = (chapterId: string, sceneId: string) => {
    if (!newTitle.trim()) {
      toast.error('Scene title cannot be empty');
      return;
    }

    const updatedProject = {
      ...project,
      chapters: project.chapters.map(chapter =>
        chapter.id === chapterId
          ? {
              ...chapter,
              scenes: chapter.scenes.map(scene =>
                scene.id === sceneId ? { ...scene, title: newTitle } : scene
              ),
            }
          : chapter
      ),
    };

    onUpdateProject(updatedProject);
    setEditingScene(null);
    setNewTitle('');
    toast.success('Scene updated');
  };

  const handleDeleteChapter = (chapterId: string) => {
    const updatedProject = {
      ...project,
      chapters: project.chapters.filter(chapter => chapter.id !== chapterId),
    };

    onUpdateProject(updatedProject);
    toast.success('Chapter deleted');
  };

  const handleDeleteScene = (chapterId: string, sceneId: string) => {
    const updatedProject = {
      ...project,
      chapters: project.chapters.map(chapter =>
        chapter.id === chapterId
          ? {
              ...chapter,
              scenes: chapter.scenes.filter(scene => scene.id !== sceneId),
            }
          : chapter
      ),
    };

    onUpdateProject(updatedProject);
    toast.success('Scene deleted');
  };

  const handleExportScene = (chapterId: string, sceneId: string) => {
    const chapter = project.chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    
    const scene = chapter.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    
    exportScene(scene);
    toast.success(`Scene "${scene.title}" exported successfully`);
  };

  const handleExportChapter = (chapterId: string) => {
    const chapter = project.chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    
    exportChapter(chapter, exportOptions);
    toast.success(`Chapter "${chapter.title}" exported successfully`);
    setExportOptionsOpen(false);
  };

  const handleExportProject = () => {
    exportProject(project.chapters, project.title, exportOptions);
    toast.success(`Project "${project.title}" exported successfully`);
    setExportOptionsOpen(false);
  };

  const openExportDialog = (chapterId?: string, sceneId?: string) => {
    setSelectedChapterId(chapterId || null);
    setSelectedSceneId(sceneId || null);
    setExportOptionsOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold">Project Structure</h2>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileDown size={16} className="mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => openExportDialog()}>
                Export Entire Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Configure Export</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => openExportDialog()}>
                Export with Custom Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {!addingChapter && (
            <Button onClick={() => setAddingChapter(true)}>
              <Plus size={16} className="mr-2" />
              Add Chapter
            </Button>
          )}
        </div>
      </div>

      {addingChapter && (
        <div className="flex items-center space-x-2 p-4 bg-secondary rounded-md animate-fade-in">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Chapter title"
            autoFocus
          />
          <Button variant="default" onClick={handleAddChapter}>
            Add
          </Button>
          <Button variant="ghost" onClick={() => {
            setAddingChapter(false);
            setNewTitle('');
          }}>
            Cancel
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {project.chapters.map((chapter) => (
          <div key={chapter.id} className="border rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-secondary/50">
              <div 
                className="flex items-center flex-1 cursor-pointer"
                onClick={() => toggleChapter(chapter.id)}
              >
                {expandedChapters.includes(chapter.id) ? (
                  <ChevronDown size={18} className="mr-2" />
                ) : (
                  <ChevronRight size={18} className="mr-2" />
                )}
                
                {editingChapter === chapter.id ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Chapter title"
                      autoFocus
                      className="h-8"
                    />
                    <Button size="sm" onClick={() => handleUpdateChapterTitle(chapter.id)}>
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingChapter(null);
                        setNewTitle('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <span className="font-medium">{chapter.title}</span>
                )}
              </div>
              
              {editingChapter !== chapter.id && (
                <div className="flex space-x-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <FileDown size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleExportChapter(chapter.id)}>
                        Quick Export
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openExportDialog(chapter.id)}>
                        Configure Export
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingChapter(chapter.id);
                      setNewTitle(chapter.title);
                    }}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteChapter(chapter.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              )}
            </div>
            
            {expandedChapters.includes(chapter.id) && (
              <div className="p-2 pl-8 space-y-1 bg-background">
                {chapter.scenes.map((scene) => (
                  <div 
                    key={scene.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-secondary/50 group",
                      activeChapterId === chapter.id && activeSceneId === scene.id && "bg-secondary"
                    )}
                    onClick={() => onSelectScene(chapter.id, scene.id)}
                  >
                    <div className="flex items-center flex-1">
                      {editingScene?.chapterId === chapter.id && editingScene?.sceneId === scene.id ? (
                        <div className="flex items-center space-x-2 flex-1">
                          <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Scene title"
                            autoFocus
                            className="h-8"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateSceneTitle(chapter.id, scene.id)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingScene(null);
                              setNewTitle('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <GripVertical size={16} className="mr-2 text-muted-foreground" />
                          <Pencil size={14} className="mr-2 text-muted-foreground" />
                          <span>{scene.title}</span>
                        </>
                      )}
                    </div>
                    
                    {!(editingScene?.chapterId === chapter.id && editingScene?.sceneId === scene.id) && (
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportScene(chapter.id, scene.id);
                          }}
                        >
                          <FileDown size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingScene({ chapterId: chapter.id, sceneId: scene.id });
                            setNewTitle(scene.title);
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteScene(chapter.id, scene.id);
                          }}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                
                {addingSceneToChapter === chapter.id ? (
                  <div className="flex items-center space-x-2 p-2 animate-fade-in">
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Scene title"
                      autoFocus
                      className="h-8"
                    />
                    <Button size="sm" onClick={() => handleAddScene(chapter.id)}>
                      Add
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAddingSceneToChapter(null);
                        setNewTitle('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-6 mt-1"
                    onClick={() => setAddingSceneToChapter(chapter.id)}
                  >
                    <Plus size={14} className="mr-1" />
                    Add Scene
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
        
        {project.chapters.length === 0 && !addingChapter && (
          <div className="flex flex-col items-center justify-center p-10 bg-secondary/50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">No Chapters Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Organize your story into chapters and scenes to keep your writing structured.
            </p>
            <Button onClick={() => setAddingChapter(true)}>
              <Plus size={16} className="mr-2" />
              Add First Chapter
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={exportOptionsOpen} onOpenChange={setExportOptionsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Options</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-chapter-title">Include Chapter Titles</Label>
              <Switch
                id="include-chapter-title"
                checked={exportOptions.includeChapterTitle}
                onCheckedChange={(checked) => 
                  setExportOptions({...exportOptions, includeChapterTitle: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="include-scene-titles">Include Scene Titles</Label>
              <Switch
                id="include-scene-titles"
                checked={exportOptions.includeSceneTitles}
                onCheckedChange={(checked) => 
                  setExportOptions({...exportOptions, includeSceneTitles: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="add-page-breaks">Add Page Breaks</Label>
              <Switch
                id="add-page-breaks"
                checked={exportOptions.addPageBreaks}
                onCheckedChange={(checked) => 
                  setExportOptions({...exportOptions, addPageBreaks: checked})
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label>Format Type</Label>
              <RadioGroup 
                value={exportOptions.formatType} 
                onValueChange={(value: "plain" | "markdown") => 
                  setExportOptions({...exportOptions, formatType: value})
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="plain" id="plain" />
                  <Label htmlFor="plain">Plain Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="markdown" id="markdown" />
                  <Label htmlFor="markdown">Markdown</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOptionsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (selectedChapterId && !selectedSceneId) {
                handleExportChapter(selectedChapterId);
              } else {
                handleExportProject();
              }
            }}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectStructure;
