import { useState, useEffect } from 'react';
import { healthService } from '../services/healthService';

interface ApiStatusProps {
  darkMode?: boolean;
}

export const ApiStatus = ({ darkMode = false }: ApiStatusProps) => {
  const [status, setStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    const result = await healthService.checkHealth();
    setStatus(result.isOnline ? 'online' : 'offline');
    setLastChecked(result.timestamp);
  };

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-red-500';
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'API Online';
      case 'offline':
        return 'API Offline';
      default:
        return 'Checking...';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center space-x-1 text-sm ${getStatusColor()}`}>
        <div className={`w-2 h-2 rounded-full ${
          status === 'online' ? 'bg-green-500' : 
          status === 'offline' ? 'bg-red-500' : 
          darkMode ? 'bg-gray-400' : 'bg-gray-500'
        } ${status === 'unknown' ? 'animate-pulse' : ''}`} />
        <span>{getStatusText()}</span>
      </div>
      {lastChecked && (
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          ({lastChecked.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })})
        </span>
      )}
    </div>
  );
};