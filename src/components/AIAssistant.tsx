
import React, { useState } from 'react';
import { Wand2, RefreshCw, Copy, CheckCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AIPurpose } from '@/types';
import { getAIResponse, generatePrompt } from '@/utils/aiUtils';
import { toast } from 'sonner';

const AIAssistant: React.FC = () => {
  const [purpose, setPurpose] = useState<AIPurpose>('plot-idea');
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please enter some context for the AI');
      return;
    }

    setIsLoading(true);
    try {
      const prompt = generatePrompt(purpose, input);
      const result = await getAIResponse({ purpose, content: prompt });
      setResponse(result);
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-serif font-semibold">AI Writing Assistant</h2>
        <p className="text-muted-foreground">
          Get help with plot ideas, character development, dialogue, and more.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">What do you need help with?</label>
            <Select
              value={purpose}
              onValueChange={(value) => setPurpose(value as AIPurpose)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plot-idea">Plot Ideas & Twists</SelectItem>
                <SelectItem value="character-development">Character Development</SelectItem>
                <SelectItem value="dialogue">Dialogue Generation</SelectItem>
                <SelectItem value="setting-description">Setting Description</SelectItem>
                <SelectItem value="conflict">Conflict & Obstacles</SelectItem>
                <SelectItem value="rewrite">Rewrite & Polish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Context or Prompt</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your character, scene, or what you need help with..."
              className="min-h-[100px] resize-none"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={16} className="mr-2" />
                Generate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {response && (
        <Card className="animate-fade-in">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">AI Response</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-xs"
              >
                {copied ? (
                  <>
                    <CheckCheck size={14} className="mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} className="mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 rounded-md bg-secondary whitespace-pre-line">
              {response}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Info size={12} className="mr-1" />
              You can copy this text and paste it into your editor
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIAssistant;
