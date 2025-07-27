import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/use-websocket";
import { RefreshCw, ExternalLink, Code, FileCode, Clock, Weight, CheckCircle } from "lucide-react";
import type { PromptResponse } from "@shared/schema";

interface PreviewPanelProps {
  lastResponse?: PromptResponse;
}

export function PreviewPanel({ lastResponse }: PreviewPanelProps) {
  const [previewUrl, setPreviewUrl] = useState('/preview/index.html');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { isConnected, lastMessage } = useWebSocket();

  // Handle WebSocket messages for live reload
  useEffect(() => {
    if (lastMessage?.type === 'reload') {
      refreshPreview();
      setLastUpdated(new Date());
    }
  }, [lastMessage]);

  // Update preview URL when new code is generated
  useEffect(() => {
    if (lastResponse?.previewUrl) {
      setPreviewUrl(lastResponse.previewUrl);
      setLastUpdated(new Date());
    }
  }, [lastResponse]);

  const refreshPreview = () => {
    if (iframeRef.current) {
      // Force reload by updating src
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc + '?t=' + Date.now();
        }
      }, 100);
    }
  };

  const openInNewTab = () => {
    window.open(previewUrl + '?t=' + Date.now(), '_blank');
  };

  const getFileCount = () => {
    return lastResponse ? Object.keys(lastResponse.files).length : 0;
  };

  const getFileSize = () => {
    if (!lastResponse) return '0 KB';
    const totalSize = Object.values(lastResponse.files).reduce((sum, content) => sum + content.length, 0);
    return (totalSize / 1024).toFixed(1) + ' KB';
  };

  return (
    <div className="w-1/2 bg-slate-900 flex flex-col">
      {/* Preview Header */}
      <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-slate-50">Live Preview</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-slate-400">
              {isConnected ? 'Auto-refresh enabled' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshPreview}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            title="Refresh Preview"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={openInNewTab}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            title="Open in New Tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4">
        <div className="h-full bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-600">
          <iframe 
            ref={iframeRef}
            src={previewUrl + '?t=' + Date.now()}
            className="w-full h-full border-0"
            title="Generated Website Preview"
          />
        </div>
      </div>

      {/* Preview Footer with Stats */}
      <div className="px-6 py-3 border-t border-slate-700 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-slate-400">
          <span className="flex items-center">
            <FileCode className="h-4 w-4 mr-1" />
            {getFileCount()} files
          </span>
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Updated {Math.floor((Date.now() - lastUpdated.getTime()) / 1000 / 60)} min ago
          </span>
          <span className="flex items-center">
            <Weight className="h-4 w-4 mr-1" />
            {getFileSize()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {lastResponse && (
            <Badge variant="secondary" className="bg-emerald-900 text-emerald-200 border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              Generated
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
