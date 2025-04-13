
import React, { useState } from 'react';
import { Plus, Trash, Edit, Save, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Character } from '@/types';
import { toast } from 'sonner';

interface CharacterProfileProps {
  characters: Character[];
  onAddCharacter: (character: Character) => void;
  onUpdateCharacter: (id: string, character: Partial<Character>) => void;
  onDeleteCharacter: (id: string) => void;
}

const CharacterProfile: React.FC<CharacterProfileProps> = ({
  characters,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [traits, setTraits] = useState<string[]>([]);
  const [background, setBackground] = useState('');
  const [currentTrait, setCurrentTrait] = useState('');
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setTraits([]);
    setBackground('');
    setCurrentTrait('');
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Character name is required');
      return;
    }

    if (editingId) {
      onUpdateCharacter(editingId, {
        name,
        description,
        traits,
        background,
      });
      setEditingId(null);
      toast.success('Character updated');
    } else {
      const newCharacter: Character = {
        id: Date.now().toString(),
        name,
        description,
        traits,
        background,
      };
      onAddCharacter(newCharacter);
      toast.success('Character added');
    }

    resetForm();
    setIsAdding(false);
  };

  const handleEdit = (character: Character) => {
    setName(character.name);
    setDescription(character.description);
    setTraits(character.traits);
    setBackground(character.background);
    setEditingId(character.id);
    setIsAdding(true);
  };

  const handleAddTrait = () => {
    if (currentTrait.trim()) {
      setTraits([...traits, currentTrait.trim()]);
      setCurrentTrait('');
    }
  };

  const handleDeleteTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold">Characters</h2>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus size={16} className="mr-2" />
            Add Character
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Character' : 'Add Character'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Character name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the character"
                rows={2}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Traits</label>
              <div className="flex space-x-2">
                <Input
                  value={currentTrait}
                  onChange={(e) => setCurrentTrait(e.target.value)}
                  placeholder="Add trait (e.g., brave, intelligent)"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTrait()}
                />
                <Button variant="outline" onClick={handleAddTrait}>
                  Add
                </Button>
              </div>
              {traits.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {traits.map((trait, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 text-sm bg-secondary rounded-full flex items-center"
                    >
                      {trait}
                      <button
                        onClick={() => handleDeleteTrait(index)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Background</label>
              <Textarea
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Character's background story"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
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
        {characters.map((character) => (
          <Card key={character.id} className="character-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="font-serif">{character.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(character)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onDeleteCharacter(character.id);
                      toast.success('Character deleted');
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {character.description && (
                <p className="text-muted-foreground text-sm">{character.description}</p>
              )}
              
              {character.traits.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold mb-1">Traits</h4>
                  <div className="flex flex-wrap gap-1">
                    {character.traits.map((trait, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 text-xs bg-secondary rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {character.background && (
                <div>
                  <h4 className="text-xs font-semibold mb-1">Background</h4>
                  <p className="text-sm whitespace-pre-line">
                    {character.background.length > 120
                      ? `${character.background.substring(0, 120)}...`
                      : character.background}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {characters.length === 0 && !isAdding && (
          <div className="col-span-2 flex flex-col items-center justify-center p-10 bg-secondary/50 rounded-lg">
            <User size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Characters Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create characters to keep track of their traits, backgrounds, and development.
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus size={16} className="mr-2" />
              Add First Character
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterProfile;
