import React from 'react';
import { Message } from '../../types/Message';
import { twMerge } from 'tailwind-merge';
import Markdown from 'react-markdown'

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
          textSize: 'text-xs md:text-base',
          headerSize: 'text-xs',
        };
      case 'server':
        return {
          container: 'justify-start',
          bubble: 'bg-gray-600 text-gray-200 rounded-bl-none',
          icon: '🤖',
          textSize: 'text-xs md:text-base',
          headerSize: 'text-xs',
        };
      case 'system':
        return {
          container: 'justify-center',
          bubble: 'bg-gray-700 text-gray-400 italic',
          icon: 'ℹ️',
          textSize: 'text-xs md:text-base',
          headerSize: 'text-xs',
        };
      case 'error':
        return {
          container: 'justify-center',
          bubble: 'bg-red-900/50 text-red-300',
          icon: '⚠️',
          textSize: 'text-sm md:text-base',
          headerSize: 'text-xs',
        };
      case 'observer':
        return {
          container: 'justify-center',
          bubble: 'bg-gray-700 text-gray-400 text-center w-full',
          icon: '',
          textSize: 'text-xs md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl',
          headerSize: 'text-sm',
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
  const timeStr = message.timestamp?.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={twMerge('flex w-full', styles.container)}>
      <div
        className={twMerge(
          'max-w-[95%] rounded-lg px-4 py-3 shadow-sm',
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
          <Markdown>
            {message.text}
          </Markdown>
        </div>
      </div>
    </div>
  );
};