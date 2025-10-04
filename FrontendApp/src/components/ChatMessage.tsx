import type { ChatMessage as ChatMessageType } from '../types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  darkMode?: boolean;
}

export const ChatMessage = ({ message, darkMode = false }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const parseMessageContent = (content: string) => {
    // Split content into main message and sources
    const parts = content.split('\n\nSources:\n');
    const mainContent = parts[0];
    const sourcesText = parts[1];
    
    let sources: string[] = [];
    if (sourcesText) {
      sources = sourcesText.split('\n').filter(line => line.trim() !== '');
    }
    
    return { mainContent, sources };
  };

  const { mainContent, sources } = message.role === 'assistant' 
    ? parseMessageContent(message.content)
    : { mainContent: message.content, sources: [] };

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-lg ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
              : darkMode
                ? 'bg-gray-700 text-gray-100 rounded-bl-sm'
                : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
          }`}
        >
          <div className="whitespace-pre-wrap">{mainContent}</div>
          
          {sources.length > 0 && (
            <div className={`mt-3 pt-3 border-t border-opacity-30 ${
              isUser 
                ? 'border-blue-300' 
                : darkMode 
                  ? 'border-gray-600' 
                  : 'border-gray-300'
            }`}>
              <div className="text-xs font-semibold mb-2 opacity-80">Sources:</div>
              {sources.map((source, index) => (
                <div key={index} className="text-xs opacity-70 mb-1">
                  {source}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={`text-xs mt-1 ${
          isUser ? 'text-right' : 'text-left'
        } ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
      
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ml-3 mr-3 ${
        isUser ? 'bg-blue-500 order-1' : darkMode ? 'bg-gray-600 order-2' : 'bg-gray-400 order-2'
      }`}>
        {isUser ? 'U' : 'AI'}
      </div>
    </div>
  );
};