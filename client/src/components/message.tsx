import { Message } from "@shared/schema";
import { CheckCircle, User, Bot, FileCode2, Clock, Weight } from "lucide-react";

interface MessageProps {
  message: Message;
}

export function MessageComponent({ message }: MessageProps) {
  const isUser = message.role === 'user';
  
  if (isUser) {
    return (
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <div className="bg-slate-700 rounded-lg px-4 py-3 text-slate-100">
            {message.content}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : 'Just now'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
          {message.plan && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-slate-200 mb-2">
                <CheckCircle className="inline h-4 w-4 mr-2 text-emerald-400" />
                Implementation Plan
              </h4>
              <ul className="space-y-1 text-sm text-slate-300">
                {message.plan.map((step, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-3 w-3 text-emerald-400 mr-2 flex-shrink-0" />
                    {typeof step === 'string' ? step : 
                     (step as any)?.action ? `${(step as any).step ? `${(step as any).step}. ` : ''}${(step as any).action}${(step as any).details ? ` - ${(step as any).details}` : ''}` :
                     JSON.stringify(step)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {message.files && Object.keys(message.files).length > 0 && (
            <div className="bg-slate-900 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Generated Files</span>
                <span className="text-xs text-emerald-400">
                  {Object.keys(message.files).length} files updated
                </span>
              </div>
              <div className="space-y-1 text-xs">
                {Object.keys(message.files).map(filename => (
                  <div key={filename} className="flex items-center text-slate-300">
                    <FileCode2 className="h-3 w-3 mr-2 text-blue-400" />
                    {filename}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <span className="text-xs text-slate-500 mt-1 block">
          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString() : 'Just now'}
        </span>
      </div>
    </div>
  );
}
