import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MessageComponent } from "./message";
import { useToast } from "@/hooks/use-toast";
import { Send, WandSparkles } from "lucide-react";
import type { Message, PromptResponse } from "@shared/schema";

interface ChatPanelProps {
  onCodeGenerated: (response: PromptResponse) => void;
  projectId?: string;
}

export function ChatPanel({ onCodeGenerated, projectId }: ChatPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState(projectId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch messages for current project
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['/api/projects', currentProjectId, 'messages'],
    enabled: !!currentProjectId,
  });

  const generateCodeMutation = useMutation({
    mutationFn: async (data: { prompt: string; projectId?: string }) => {
      const response = await apiRequest('POST', '/api/prompt', data);
      return response.json();
    },
    onSuccess: (data: PromptResponse & { projectId?: string }) => {
      setPrompt("");
      setCurrentProjectId(data.projectId);
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

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-1/2 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-slate-50 mb-1">Development Chat</h2>
        <p className="text-sm text-slate-400">Describe what you want to build and watch it come to life</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <WandSparkles className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">Ready to Build</h3>
            <p className="text-slate-500">Start by describing what you want to create. I'll generate the code and show you a live preview.</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))
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
