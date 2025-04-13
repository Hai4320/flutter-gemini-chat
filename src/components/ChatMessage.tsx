
import React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/services/geminiService";

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isLastMessage = false 
}) => {
  const isUser = message.role === "user";
  
  return (
    <div 
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "flex flex-col max-w-[80%] sm:max-w-[70%] p-3 rounded-2xl shadow-sm",
          isUser 
            ? "bg-flutter-blue text-white rounded-br-none" 
            : "bg-white dark:bg-gemini-darkPurple/20 rounded-bl-none border border-gemini-purple/20"
        )}
      >
        <div className="px-1">
          {message.content}
        </div>
        <div 
          className={cn(
            "text-xs mt-1 self-end",
            isUser ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
