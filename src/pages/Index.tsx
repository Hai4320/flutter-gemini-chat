
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import LoadingIndicator from "@/components/LoadingIndicator";
import { 
  Message, 
  MessageRole, 
  sendMessageToGemini, 
  generateId, 
  setApiKey,
  getApiKey
} from "@/services/geminiService";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isKeySet, setIsKeySet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle API key submission
  const handleSetApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setIsKeySet(true);
      toast.success("API key set successfully!");
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "Hello! I'm your Flutter-Gemini chatbot assistant. How can I help you today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  // Handle user message submission
  const handleSendMessage = async (content: string) => {
    // Create new user message
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Send to Gemini API
      const response = await sendMessageToGemini([...messages, userMessage]);
      
      // Create assistant message with response
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      // Add assistant message to chat
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Error is already handled in the API service
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-chat-pattern flex flex-col items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col shadow-lg bg-opacity-90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-flutter-blue to-gemini-purple text-white">
          <CardTitle className="flex items-center justify-center space-x-2">
            <span className="text-xl font-bold">Flutter-Gemini Chat</span>
          </CardTitle>
          <CardDescription className="text-white/80 text-center">
            Powered by Flutter design and Gemini AI
          </CardDescription>
        </CardHeader>
        
        {!isKeySet ? (
          <CardContent className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Welcome to Flutter-Gemini Chat</h3>
                <p className="text-muted-foreground">
                  To get started, please enter your Gemini API key below.
                </p>
              </div>
              
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter your Gemini API key"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full"
                />
                <Button 
                  onClick={handleSetApiKey} 
                  className="w-full bg-flutter-blue hover:bg-flutter-darkBlue"
                >
                  Start Chatting
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  You can get a Gemini API key from{" "}
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-flutter-blue hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent className="flex-1 overflow-y-auto p-4 custom-scrollbar chat-gradient-bg">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <p>No messages yet</p>
                  <p className="text-sm">Send a message to start the conversation</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((message, index) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message} 
                      isLastMessage={index === messages.length - 1} 
                    />
                  ))}
                  {isLoading && <LoadingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </CardContent>
            
            <CardFooter className="p-4 bg-background/50">
              <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default Index;
