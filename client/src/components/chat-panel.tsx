import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MessageComponent } from "./message";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";
import { Send, WandSparkles, Loader2 } from "lucide-react";
import type { Message, PromptResponse } from "@shared/schema";

interface ChatPanelProps {
  onCodeGenerated: (response: PromptResponse) => void;
  projectId?: string;
}

export function ChatPanel({ onCodeGenerated, projectId }: ChatPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState(projectId);

  // Update currentProjectId when projectId prop changes (fresh start)
  useEffect(() => {
    if (projectId !== currentProjectId) {
      // Invalidate the old project's messages query before switching
      if (currentProjectId) {
        queryClient.removeQueries({
          queryKey: ['/api/projects', currentProjectId, 'messages']
        });
      }
      
      setCurrentProjectId(projectId);
      if (projectId) {
        console.log('ChatPanel: Fresh start with project ID:', projectId);
        // Invalidate and refetch messages for the new project to ensure fresh data
        queryClient.invalidateQueries({
          queryKey: ['/api/projects', projectId, 'messages']
        });
      }
    }
  }, [projectId, currentProjectId]);
  const [progressMessages, setProgressMessages] = useState<Array<{step: string, details: string, timestamp: string}>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { lastMessage } = useWebSocket();

  // Fetch messages for current project
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['/api/projects', currentProjectId, 'messages'],
    enabled: !!currentProjectId,
  });

  const generateCodeMutation = useMutation({
    mutationFn: async (data: { prompt: string; projectId?: string }) => {
      setIsGenerating(true);
      setProgressMessages([]);
      setGenerationProgress(0);
      const response = await apiRequest('POST', '/api/prompt', data);
      return response.json();
    },
    onSuccess: (data: PromptResponse & { projectId?: string }) => {
      setPrompt("");
      setCurrentProjectId(data.projectId);
      setIsGenerating(false);
      setProgressMessages([]);
      setGenerationProgress(0);
      onCodeGenerated(data);
      
      // Invalidate messages query to refetch
      if (data.projectId) {
        queryClient.invalidateQueries({
          queryKey: ['/api/projects', data.projectId, 'messages']
        });
      }
      
      toast({
        title: "Code Generated Successfully",
        description: `Generated ${Object.keys(data.files).length} files`,
      });
    },
    onError: (error: Error) => {
      setIsGenerating(false);
      setProgressMessages([]);
      setGenerationProgress(0);
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || generateCodeMutation.isPending) return;
    
    generateCodeMutation.mutate({
      prompt: trimmedPrompt,
      projectId: currentProjectId
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [prompt]);

  // Handle WebSocket progress messages
  useEffect(() => {
    if (lastMessage?.type === 'progress') {
      setProgressMessages(prev => [...prev, {
        step: lastMessage.step,
        details: lastMessage.details,
        timestamp: lastMessage.timestamp
      }]);
      
      // Update progress percentage based on step
      const stepMatch = lastMessage.step.match(/Step (\d+)\/(\d+)/);
      if (stepMatch) {
        const current = parseInt(stepMatch[1]);
        const total = parseInt(stepMatch[2]);
        setGenerationProgress((current / total) * 100);
      }
      
      if (lastMessage.step.includes('Complete')) {
        setGenerationProgress(100);
        if (lastMessage.step.includes('Generation Complete')) {
          setTimeout(() => {
            setIsGenerating(false);
            setProgressMessages([]);
            setGenerationProgress(0);
          }, 2000);
        }
      }
    }
  }, [lastMessage]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, progressMessages]);

  return (
    <div className="w-1/2 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-slate-50">Development Chat</h2>
          {currentProjectId && (
            <span className="text-xs text-slate-400 font-mono bg-slate-700 px-2 py-1 rounded">
              ID: {currentProjectId.slice(0, 8)}...
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400">Describe what you want to build and watch it come to life</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && !isGenerating ? (
          <div className="text-center py-8">
            <WandSparkles className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">Ready to Build</h3>
            <p className="text-slate-500">Start by describing what you want to create. I'll generate the code and show you a live preview.</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))}
            
            {/* Real-time Progress Display */}
            {isGenerating && (
              <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-slate-100 font-medium">Generating Application</h4>
                    <p className="text-slate-400 text-sm">Advanced multi-step AI generation in progress...</p>
                  </div>
                </div>
                
                <Progress value={generationProgress} className="mb-3" />
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {progressMessages.map((msg, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-blue-400 font-medium">{msg.step}</span>
                      <span className="text-slate-300 ml-2">{msg.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-slate-700">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Describe what you want to build... (e.g., 'Create a landing page with header, three feature cards, and footer')"
              className="w-full min-h-[80px] bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={generateCodeMutation.isPending}
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <span className="text-xs text-slate-500">Ctrl+Enter to send</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <WandSparkles className="h-4 w-4" />
              <span>AI will generate and preview your code instantly</span>
            </div>
            <Button 
              type="submit" 
              disabled={!prompt.trim() || generateCodeMutation.isPending}
              className="bg-primary hover:bg-blue-700 text-white font-medium"
            >
              <Send className="h-4 w-4 mr-2" />
              {generateCodeMutation.isPending ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
