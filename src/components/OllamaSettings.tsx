
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { OllamaConfig } from '@/types';
import { getOllamaConfig, saveOllamaConfig, testOllamaConnection, availableOllamaModels } from '@/utils/ollamaUtils';
import { RefreshCw, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const OllamaSettings: React.FC = () => {
  const [config, setConfig] = useState<OllamaConfig>(getOllamaConfig());
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'failed'>('untested');

  useEffect(() => {
    // Load config from localStorage on mount
    setConfig(getOllamaConfig());
  }, []);

  const handleSaveConfig = () => {
    saveOllamaConfig(config);
    toast.success('Ollama settings saved successfully');
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus('untested');
    
    try {
      const success = await testOllamaConnection(config);
      setConnectionStatus(success ? 'success' : 'failed');
      
      if (success) {
        toast.success('Successfully connected to Ollama server');
      } else {
        toast.error('Failed to connect to Ollama server');
      }
    } catch (error) {
      setConnectionStatus('failed');
      toast.error('Error connecting to Ollama server');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-serif font-semibold">Ollama AI Settings</h2>
        <p className="text-muted-foreground">
          Configure settings for local Ollama model server integration.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ollama Configuration</CardTitle>
          <CardDescription>
            Connect to your locally running Ollama instance to use local AI models for text generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ollama-enabled">Enable Ollama Integration</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, AI responses will be generated using your local Ollama server
              </p>
            </div>
            <Switch
              id="ollama-enabled"
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="server-url">Ollama Server URL</Label>
            <Input
              id="server-url"
              value={config.serverUrl}
              onChange={(e) => setConfig({ ...config, serverUrl: e.target.value })}
              placeholder="http://127.0.0.1:11434"
              disabled={!config.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Default URL is http://127.0.0.1:11434 for local installations
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model-select">Model</Label>
            <Select
              value={config.model}
              onValueChange={(value) => setConfig({ ...config, model: value })}
              disabled={!config.enabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                {availableOllamaModels.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Make sure the selected model is downloaded and available on your Ollama server
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button 
              variant="outline" 
              onClick={handleTestConnection} 
              disabled={isConnecting || !config.enabled}
              className="flex items-center gap-2"
            >
              {isConnecting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  {connectionStatus === 'success' && <Check size={16} className="text-green-500" />}
                  {connectionStatus === 'failed' && <X size={16} className="text-red-500" />}
                  Test Connection
                </>
              )}
            </Button>

            <Button 
              onClick={handleSaveConfig}
              disabled={!config.enabled}
            >
              Save Settings
            </Button>
          </div>

          {connectionStatus === 'success' && (
            <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded text-sm text-green-500">
              Connection to Ollama server successful. Local AI is ready to use.
            </div>
          )}

          {connectionStatus === 'failed' && (
            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-500">
              Failed to connect to Ollama server. Please check that Ollama is running and the server URL is correct.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Ollama</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Ollama lets you run open-source large language models locally on your machine, 
            ensuring privacy and reducing latency for AI-powered features.
          </p>
          <div className="space-y-2">
            <h3 className="font-medium">Getting Started with Ollama:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">ollama.ai</a></li>
              <li>Start the Ollama server on your machine</li>
              <li>Download models with <code className="bg-muted px-1 rounded">ollama pull modelname</code></li>
              <li>Enable Ollama integration in these settings</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OllamaSettings;

