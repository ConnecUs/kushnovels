
import React, { useState } from 'react';
import { Plus, Trash, Edit, Save, Copy, Sparkles, Tag, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface PromptManagerProps {
  prompts: Prompt[];
  onAddPrompt: (prompt: Prompt) => void;
  onUpdatePrompt: (id: string, prompt: Partial<Prompt>) => void;
  onDeletePrompt: (id: string) => void;
}

const PromptManager: React.FC<PromptManagerProps> = ({
  prompts = [],
  onAddPrompt,
  onUpdatePrompt,
  onDeletePrompt,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [filter, setFilter] = useState('all');
  
  const categories = [
    { value: 'general', label: 'General' },
    { value: 'character', label: 'Character Development' },
    { value: 'plot', label: 'Plot Ideas' },
    { value: 'dialogue', label: 'Dialogue' },
    { value: 'setting', label: 'Setting & World Building' },
    { value: 'editing', label: 'Editing & Refinement' }
  ];
  
  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('general');
    setTags([]);
    setCurrentTag('');
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Prompt title is required');
      return;
    }

    if (!content.trim()) {
      toast.error('Prompt content is required');
      return;
    }

    if (editingId) {
      onUpdatePrompt(editingId, {
        title,
        content,
        category,
        tags,
      });
      setEditingId(null);
      toast.success('Prompt updated');
    } else {
      const newPrompt: Prompt = {
        id: Date.now().toString(),
        title,
        content,
        category,
        tags,
      };
      onAddPrompt(newPrompt);
      toast.success('Prompt added');
    }

    resetForm();
    setIsAdding(false);
  };

  const handleEdit = (prompt: Prompt) => {
    setTitle(prompt.title);
    setContent(prompt.content);
    setCategory(prompt.category);
    setTags(prompt.tags);
    setEditingId(prompt.id);
    setIsAdding(true);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleDeleteTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const filteredPrompts = filter === 'all' 
    ? prompts 
    : prompts.filter(prompt => prompt.category === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold">Prompt Manager</h2>
        <div className="flex gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus size={16} className="mr-2" />
              Add Prompt
            </Button>
          )}
        </div>
      </div>

      {isAdding && (
        <Card className="animate-fade-in border border-primary/20 bg-card shadow-md">
          <CardHeader className="bg-primary/5 pb-2">
            <CardTitle>{editingId ? 'Edit Prompt' : 'Add Prompt'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Prompt title"
                className="border-primary/20"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-primary/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Tags</label>
              <div className="flex space-x-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add tag"
                  className="border-primary/20"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button variant="outline" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full flex items-center"
                    >
                      {tag}
                      <button
                        onClick={() => handleDeleteTag(index)}
                        className="ml-2 text-primary hover:text-primary/70"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Prompt Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your prompt here..."
                rows={5}
                className="border-primary/20"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                <Save size={16} className="mr-2" />
                {editingId ? 'Update' : 'Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="prompt-card border border-primary/20 hover:shadow-lg transition-all duration-300 bg-card overflow-hidden">
            <CardHeader className="bg-primary/5 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="font-serif text-xl">{prompt.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyToClipboard(prompt.content)}
                    title="Copy to clipboard"
                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                  >
                    <Copy size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(prompt)}
                    title="Edit prompt"
                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onDeletePrompt(prompt.id);
                      toast.success('Prompt deleted');
                    }}
                    title="Delete prompt"
                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
              <div className="flex items-center mt-1 space-x-2">
                <span className="flex items-center text-xs bg-primary/15 text-primary/90 px-2 py-1 rounded-full">
                  <Tag size={12} className="mr-1" />
                  {categories.find(c => c.value === prompt.category)?.label || 'General'}
                </span>
                {prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 text-xs bg-secondary/40 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {prompt.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-xs bg-secondary/40 rounded-full">
                        +{prompt.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="relative">
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-card to-transparent"></div>
                <p className="text-sm whitespace-pre-line text-muted-foreground">
                  {prompt.content.length > 150
                    ? `${prompt.content.substring(0, 150)}...`
                    : prompt.content}
                </p>
              </div>
              <div className="flex justify-end mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs border-primary/20 bg-primary/5 hover:bg-primary/10"
                  onClick={() => handleCopyToClipboard(prompt.content)}
                >
                  <Sparkles size={12} className="mr-1 text-primary" /> Use Prompt
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPrompts.length === 0 && !isAdding && (
          <div className="col-span-2 flex flex-col items-center justify-center p-10 bg-secondary/10 border border-primary/10 rounded-lg">
            <FileText size={48} className="text-primary/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Prompts Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Save your favorite prompts to reuse them later in your writing process.
            </p>
            <Button onClick={() => setIsAdding(true)} className="bg-primary/80 hover:bg-primary">
              <Plus size={16} className="mr-2" />
              Add First Prompt
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptManager;
