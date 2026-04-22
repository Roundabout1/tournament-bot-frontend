import React from 'react';
import { Message } from '../../types/Message';
import { twMerge } from 'tailwind-merge';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const getMessageStyles = () => {
    switch (message.type) {
      case 'user':
        return {
          // justify-end
          container: 'justify-start',
          bubble: 'bg-blue-600 text-white rounded-br-none',
          icon: '💬',
        };
      case 'server':
        return {
          container: 'justify-start',
          bubble: 'bg-gray-600 text-gray-200 rounded-bl-none',
          icon: '🤖',
        };
      case 'system':
        return {
          container: 'justify-center',
          bubble: 'bg-gray-700 text-gray-400 text-sm italic',
          icon: 'ℹ️',
        };
      case 'error':
        return {
          container: 'justify-center',
          bubble: 'bg-red-900/50 text-red-300 text-sm',
          icon: '⚠️',
        };
      default:
        return {
          container: 'justify-start',
          bubble: 'bg-gray-600 text-gray-200',
          icon: '📨',
        };
    }
  };

  const styles = getMessageStyles();
  const timeStr = message.timestamp.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={twMerge('flex w-full', styles.container)}>
      <div
        className={twMerge(
          'max-w-[80%] rounded-lg px-3 py-2 shadow-sm',
          styles.bubble
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{styles.icon}</span>
          {message.sender && (
            <span className="text-xs font-semibold opacity-75">
              {message.sender}
            </span>
          )}
          <span className="text-xs opacity-50">{timeStr}</span>
        </div>
        <div className="mt-1 break-words whitespace-pre-wrap">
          {message.text}
        </div>
      </div>
    </div>
  );
};