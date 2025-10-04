import type { ChatRequest, ChatResponse } from '../types/chat';
import { apiConfig } from './apiConfig';

export const chatService = {
  /**
   * Send a chat message to the RAG API
   * @param request Chat request with query and search parameters
   * @returns Promise with chat response
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await apiConfig.fetch('/chat/assist', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};