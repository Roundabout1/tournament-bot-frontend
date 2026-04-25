import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { Message } from '../../types/Message';

interface ChatLogProps {
  messages: Message[];
}

export const ChatLog: React.FC<ChatLogProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Нет сообщений
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-2 space-y-3">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};