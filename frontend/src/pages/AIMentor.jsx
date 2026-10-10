import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { getAIResponse, suggestedPrompts } from '../services/aiService';

const AIMentor = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Hello Ayan! I'm your AI coding mentor. I've analyzed your recent performance and I'm ready to help you improve. You can ask me about your weak areas, get study recommendations, or discuss problem-solving strategies.\n\nWhat would you like to work on today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(trimmed);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    return content.split('\n').map((line, i) => {
      // Bold
      let formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      // Headers with emoji
      if (formatted.startsWith('**')) {
        return <p key={i} className="font-semibold text-white mt-2" dangerouslySetInnerHTML={{ __html: formatted }} />;
      }
      // Bullet points
      if (formatted.startsWith('- ')) {
        return <p key={i} className="ml-3" dangerouslySetInnerHTML={{ __html: '• ' + formatted.slice(2) }} />;
      }
      // Empty lines
      if (formatted.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Neuron AI Mentor</h1>
            <p className="text-gray-400 text-sm">Your personalized coding companion</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-gray-800 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3">
            <p className="text-xs text-gray-500 mb-2">Suggested prompts:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <Sparkles size={12} className="text-purple-400" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI mentor anything..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white p-2.5 rounded-lg transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMentor;
