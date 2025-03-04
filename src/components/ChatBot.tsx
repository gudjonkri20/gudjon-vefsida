import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { generateLocalResponse } from '../utils/textProcessing';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  aboutContent: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ aboutContent }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm your personal assistant. Ask me anything about Guðjón's experience, skills, or projects!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setApiError(null);

    try {
      // Generate local response immediately as a fallback
      const localResponse = generateLocalResponse(input, aboutContent);
      
      // Try the edge function first (it's more reliable in Netlify)
      try {
        console.log("Trying /api/chat-edge");
        const edgeResponse = await fetch('/api/chat-edge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input,
            aboutContent: aboutContent,
          }),
          // Set a timeout for edge function
          signal: AbortSignal.timeout(10000),
        });
        
        if (edgeResponse.ok) {
          const data = await edgeResponse.json();
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: data.response,
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          return; // Exit early if successful
        } else {
          throw new Error(`Edge function returned status ${edgeResponse.status}`);
        }
      } catch (edgeError) {
        console.error("Edge function error:", edgeError);
        
        // Try the Netlify function as second option
        try {
          console.log("Edge function failed, trying /.netlify/functions/chat");
          const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: input,
              aboutContent: aboutContent,
            }),
            signal: AbortSignal.timeout(12000),
          });
          
          console.log("Response status:", response.status);
          
          if (response.ok) {
            const data = await response.json();
            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: data.response,
              sender: 'bot',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            return; // Exit early if successful
          } else {
            throw new Error(`Function returned status ${response.status}`);
          }
        } catch (functionError) {
          console.error("Function error:", functionError);
          throw functionError; // Let the outer catch handle it
        }
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setApiError(`API Error: ${error instanceof Error ? error.message : String(error)}`);
      
      // Use the local fallback response
      console.log("Using local fallback response");
      const localResponse = generateLocalResponse(input, aboutContent);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: localResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-800 text-white">
        <h2 className="text-xl font-semibold">Ask Me Anything</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-300">
            Powered by GPT-3.5-turbo
          </p>
          {apiError && (
            <p className="text-xs text-red-300">
              Using local fallback (API error)
            </p>
          )}
        </div>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-line">{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about Guðjón..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-r-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
            disabled={!input.trim() || isLoading}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;