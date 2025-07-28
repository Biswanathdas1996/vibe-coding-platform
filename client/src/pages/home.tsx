import { useState, useEffect } from "react";
import { ChatPanel } from "@/components/chat-panel";
import { PreviewPanel } from "@/components/preview-panel";
import { Code, Settings, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PromptResponse } from "@shared/schema";

export default function Home() {
  const [lastResponse, setLastResponse] = useState<PromptResponse>();
  const [projectId, setProjectId] = useState<string>();
  const [isInitializing, setIsInitializing] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Initialize project ID from localStorage (created when template was selected)
  useEffect(() => {
    const initializeProject = async () => {
      const storedProjectId = localStorage.getItem('projectId');
      const selectedTemplate = localStorage.getItem('selectedTemplate');
      
      if (storedProjectId && !projectId) {
        // Project was already created in template selector, just use it
        setProjectId(storedProjectId);
        
        if (selectedTemplate) {
          setIsInitializing(true);
          try {
            // Fetch project data to show in preview
            const response = await apiRequest('GET', `/api/projects/${storedProjectId}`);
            const projectData = await response.json();
            
            const template = JSON.parse(selectedTemplate);
            setLastResponse({
              plan: [`Initialized ${template.name} template`, 'Files created and ready for customization'],
              files: projectData.files,
              previewUrl: '/preview/index.html'
            });
            
            toast({
              title: "Template Ready",
              description: `${template.name} is ready for customization`,
            });
          } catch (error) {
            console.error('Project loading error:', error);
            toast({
              title: "Loading Failed",
              description: "Failed to load project. Please try again.",
              variant: "destructive",
            });
          } finally {
            setIsInitializing(false);
          }
        }
      }
    };

    initializeProject();
  }, [projectId, toast]);

  const handleCodeGenerated = (response: PromptResponse & { projectId?: string }) => {
    setLastResponse(response);
    if (response.projectId) {
      setProjectId(response.projectId);
    }
  };

  const handleBackToTemplates = () => {
    localStorage.removeItem('selectedTemplate');
    localStorage.removeItem('projectId');
    setLocation('/');
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-900 text-slate-50">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToTemplates}
            className="text-slate-300 hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Templates
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-50">Vibe Coding</h1>
              <p className="text-xs text-slate-400">AI-Powered Development Platform</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isInitializing ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></div>
            <span className="text-sm text-slate-400">
              {isInitializing ? 'Initializing...' : 'Connected'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-700">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="bg-primary hover:bg-blue-700 text-white">
              <Save className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        <ChatPanel 
          onCodeGenerated={handleCodeGenerated}
          projectId={projectId}
        />
        <PreviewPanel lastResponse={lastResponse} />
      </div>
    </div>
  );
}
