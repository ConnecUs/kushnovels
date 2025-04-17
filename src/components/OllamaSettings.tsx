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
import { RefreshCw, Check, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

const OllamaSettings: React.FC = () => {
  const [config, setConfig] = useState<OllamaConfig>(getOllamaConfig());
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'failed'>('untested');
  const [lastTestedConfig, setLastTestedConfig] = useState<string>('');

  useEffect(() => {
    // Load config from localStorage on mount
    setConfig(getOllamaConfig());
  }, []);

  const handleSaveConfig = () => {
    // Only save if Ollama is disabled or if the connection was successful
    if (!config.enabled || (connectionStatus === 'success' && lastTestedConfig === JSON.stringify(config))) {
      saveOllamaConfig(config);
      toast.success('Ollama settings saved successfully');
    } else if (config.enabled) {
      // If Ollama is enabled but not successfully tested, show a warning
      toast.warning('Please test the connection before saving enabled settings');
    }
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus('untested');
    
    try {
      const currentConfigString = JSON.stringify(config);
      console.log("Testing connection with config:", config);
      
      const success = await testOllamaConnection(config);
      setConnectionStatus(success ? 'success' : 'failed');
      
      if (success) {
        setLastTestedConfig(currentConfigString);
        toast.success('Successfully connected to Ollama server');
      } else {
        toast.error('Failed to connect to Ollama server');
      }
    } catch (error) {
      console.error("Error during connection test:", error);
      setConnectionStatus('failed');
      toast.error('Error connecting to Ollama server');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleToggleEnable = (checked: boolean) => {
    if (checked && connectionStatus !== 'success') {
      // If trying to enable without a successful connection test
      toast.warning('Please test the connection first before enabling Ollama');
      // Don't enable yet, but update the rest of the config
      setConfig(prev => ({ ...prev }));
    } else {
      // Otherwise update the config normally
      setConfig(prev => ({ ...prev, enabled: checked }));
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
          {connectionStatus === 'success' && (
            <Alert className="bg-green-500/10 border-green-500/30">
              <Check className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                Connection to Ollama server successful. Local AI is ready to use.
              </AlertDescription>
            </Alert>
          )}

          {connectionStatus === 'failed' && (
            <Alert className="bg-red-500/10 border-red-500/30">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-500">
                Failed to connect to Ollama server. Please check that Ollama is running and the server URL is correct.
              </AlertDescription>
            </Alert>
          )}

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
              onCheckedChange={handleToggleEnable}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="server-url">Ollama Server URL</Label>
            <Input
              id="server-url"
              value={config.serverUrl}
              onChange={(e) => setConfig({ ...config, serverUrl: e.target.value })}
              placeholder="http://localhost:11434"
            />
            <p className="text-xs text-muted-foreground">
              Default URL is http://localhost:11434 for local installations
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model-select">Model</Label>
            <Select
              value={config.model}
              onValueChange={(value) => setConfig({ ...config, model: value })}
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
              disabled={isConnecting}
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
              disabled={config.enabled && connectionStatus !== 'success'}
            >
              Save Settings
            </Button>
          </div>
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
          
          <div className="bg-muted p-3 rounded-md text-sm">
            <h4 className="font-medium mb-1">Troubleshooting Connection Issues:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Verify Ollama is installed and running on your machine</li>
              <li>Check that the server URL includes http:// and the correct port (default: 11434)</li>
              <li>Make sure any firewalls are configured to allow traffic to the Ollama server</li>
              <li>If you're using a non-default host or containerized setup, adjust the URL accordingly</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OllamaSettings;
