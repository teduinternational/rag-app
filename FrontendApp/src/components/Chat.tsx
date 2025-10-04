import { useState, useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType } from '../types/chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SettingsPanel } from './SettingsPanel';
import { ApiStatus } from './ApiStatus';
import { SampleQuestions } from './SampleQuestions';
import { chatService } from '../services/chatService';

export const Chat = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [topK, setTopK] = useState(5);
  const [minScore, setMinScore] = useState(0.7);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSendMessage = async (message: string, customTopK?: number, customMinScore?: number) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.sendMessage({
        message,
        topK: customTopK ?? topK,
        minScore: customMinScore ?? minScore,
      });

      // Add assistant response
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: response.reply,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi tin nhắn');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className={`flex flex-col h-screen transition-colors ${
      darkMode ? 'bg-gray-900' : 'bg-transparent'
    }`}>
      {/* Header */}
      <div className={`border-b px-6 py-4 flex items-center justify-between transition-colors backdrop-blur-sm ${
        darkMode 
          ? 'bg-gray-800/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div>
          <h1 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            RAG Chat Assistant
          </h1>
          <div className="flex items-center space-x-4">
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              AI-powered knowledge base assistant
            </p>
            <ApiStatus darkMode={darkMode} />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <SettingsPanel
            topK={topK}
            minScore={minScore}
            onTopKChange={setTopK}
            onMinScoreChange={setMinScore}
            darkMode={darkMode}
            onDarkModeToggle={() => setDarkMode(!darkMode)}
          />
          <button
            onClick={clearChat}
            className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
              darkMode
                ? 'text-gray-300 border-gray-600 hover:text-white hover:bg-gray-700'
                : 'text-gray-600 border-gray-300 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Xóa cuộc trò chuyện
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4">
          <div className={`p-4 border rounded-lg ${
            darkMode
              ? 'bg-red-900 border-red-700'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex">
              <svg className={`w-5 h-5 mr-2 mt-0.5 ${
                darkMode ? 'text-red-400' : 'text-red-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className={`font-medium ${
                  darkMode ? 'text-red-200' : 'text-red-800'
                }`}>
                  Lỗi
                </h3>
                <p className={`text-sm mt-1 ${
                  darkMode ? 'text-red-300' : 'text-red-700'
                }`}>
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <div className="w-full max-w-6xl">
              <div className="text-center mb-8 animate-slide-up">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg ${
                  darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-700' : 'bg-gradient-to-br from-blue-100 to-purple-200'
                }`}>
                  <svg className={`w-8 h-8 ${
                    darkMode ? 'text-white' : 'text-blue-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-medium mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Chào mừng đến với RAG Chat Assistant
                </h3>
                <p className={`max-w-md mx-auto mb-8 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Hãy bắt đầu cuộc trò chuyện bằng cách gửi một câu hỏi hoặc chọn từ các câu hỏi mẫu bên dưới.
                </p>
              </div>
              
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <SampleQuestions 
                  onQuestionSelect={handleSendMessage}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={message.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ChatMessage message={message} darkMode={darkMode} />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4 animate-scale-in">
                <div className={`flex items-center space-x-2 px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg glass ${
                  darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
                }`}>
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-gray-400' : 'bg-gray-400'
                    }`}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-gray-400' : 'bg-gray-400'
                    }`} style={{ animationDelay: '0.1s' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-gray-400' : 'bg-gray-400'
                    }`} style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Đang tìm kiếm...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
        darkMode={darkMode}
        defaultTopK={topK}
        defaultMinScore={minScore}
      />
    </div>
  );
};