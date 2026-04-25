export interface Message {
  id: string;
  type: 'user' | 'server' | 'system' | 'error' | 'observer';
  text: string;
  timestamp?: Date;
  sender?: string;
}

export type MessageType = Message['type'];