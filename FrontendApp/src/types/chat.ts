export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: Source[];
}

export interface Source {
  ordinal: number;
  source: string;
  score: number;
}

export interface ChatRequest {
  message: string;
  topK?: number;
  minScore?: number;
}

export interface ChatResponse {
  reply: string;
}