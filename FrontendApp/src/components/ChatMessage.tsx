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
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-gray-900 rounded-br-sm'
              : darkMode
                ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-bl-sm'
                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-bl-sm border-2 border-gray-300'
          }`}
        >
          <div className="whitespace-pre-wrap font-medium">{mainContent}</div>
          
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
        
        <div className={`text-xs mt-1 font-medium ${
          isUser ? 'text-right' : 'text-left'
        } ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
      
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ml-3 mr-3 shadow-md ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 order-1' 
          : darkMode 
            ? 'bg-gradient-to-br from-purple-600 to-purple-700 order-2' 
            : 'bg-gradient-to-br from-purple-500 to-purple-600 order-2'
      }`}>
        {isUser ? '👤' : '🤖'}
      </div>
    </div>
  );
};