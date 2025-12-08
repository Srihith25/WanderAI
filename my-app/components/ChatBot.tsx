'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBotProps {
  itinerary: any;
  onClose: () => void;
}

export default function ChatBot({ itinerary, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Namaste! 🙏 I\'m Sanchari, your travel companion. Ask me anything about your trip!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          itinerary: itinerary
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 left-6 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-40 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
            🧭
          </div>
          <div>
            <h3 className="font-semibold text-white">Sanchari</h3>
            <p className="text-xs text-white/80">Your Travel Companion</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/80 hover:text-white p-1"
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-md rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-md shadow-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['Best time to visit?', 'Local food tips', 'Budget estimate', 'Safety tips'].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1 bg-white dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded-full whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Sanchari anything..."
                className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-full text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ➤
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}