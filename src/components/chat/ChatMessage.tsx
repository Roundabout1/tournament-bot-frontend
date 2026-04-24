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
          container: 'justify-start',
          bubble: 'bg-blue-600 text-white rounded-br-none',
          icon: '💬',
          textSize: 'text-base',
          headerSize: 'text-xs',
        };
      case 'server':
        return {
          container: 'justify-start',
          bubble: 'bg-gray-600 text-gray-200 rounded-bl-none',
          icon: '🤖',
          textSize: 'text-base',
          headerSize: 'text-xs',
        };
      case 'system':
        return {
          container: 'justify-center',
          bubble: 'bg-gray-700 text-gray-400 italic',
          icon: 'ℹ️',
          textSize: 'text-sm',
          headerSize: 'text-xs',
        };
      case 'error':
        return {
          container: 'justify-center',
          bubble: 'bg-red-900/50 text-red-300',
          icon: '⚠️',
          textSize: 'text-sm',
          headerSize: 'text-xs',
        };
      case 'observer':
        return {
          container: 'justify-center',
          bubble: 'bg-gray-700 text-gray-400 w-[800px]',
          icon: 'ℹ️',
          textSize: 'text-4xl',      // Очень крупный шрифт
          headerSize: 'text-sm',    // Увеличенный шрифт для времени
        };
      default:
        return {
          container: 'justify-start',
          bubble: 'bg-gray-600 text-gray-200',
          icon: '📨',
          textSize: 'text-base',
          headerSize: 'text-xs',
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
          'max-w-[80%] rounded-lg px-4 py-3 shadow-sm', // Увеличенные отступы
          styles.bubble
        )}
      >
        <div className="flex items-center gap-2">
          <span className={twMerge('text-base', styles.headerSize)}>
            {styles.icon}
          </span>
          {message.sender && (
            <span className={twMerge('font-semibold opacity-75', styles.headerSize)}>
              {message.sender}
            </span>
          )}
          <span className={twMerge('opacity-50', styles.headerSize)}>
            {timeStr}
          </span>
        </div>
        <div className={twMerge('mt-1 break-words whitespace-pre-wrap font-medium', styles.textSize)}>
          {message.text}
        </div>
      </div>
    </div>
  );
};