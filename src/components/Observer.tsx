import React, { useState, useEffect, useRef } from 'react';
import { Title } from './Title';
import { ChatLog } from './chat/ChatLog';
import { Message } from '../types/Message';

export const Observer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const addChatMessage = (text: string, type: Message['type'] = 'observer', sender?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date(),
      sender,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const connectWebSocket = () => {
    if (wsRef.current && wsRef.current?.readyState === wsRef.current?.OPEN) {
      console.log(`Повторная попытка подключиться: ${wsRef.current}`);
      return;
    }
    const wsUrl = `ws://${window.location.hostname}:${8000}/ws/observer`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('Observer WebSocket подключен');
      setIsConnected(true);
      //setMessages((prev) => [...prev, 'Подключен как наблюдатель']);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Observer получил:', data);

        if (data.type === 'observer_connected') {
          const events = data.history as string[];
          const events_map = events.map((v, i) => {
            return {
              id: `${Date.now().toString()}_${i}`,
              type: 'observer',
              text: v,
              timestamp: new Date(),
            } as Message;
          });
          setMessages(messages.concat(events_map));
          //setMessages((prev) => [...prev, data.message]);
        } else if (data.type === 'event') {
          addChatMessage(data.message);
        } else if (data.type === 'game_updated') {
          // TODO: такого типа сообщений нет на сервере, нужно добавить его, либо удалить
          //setMessages((prev) => [...prev, `Обновление: ${data.event} на столе ${data.table}`]);
        } else {
          console.log(`Получено неизвестное сообщение: ${JSON.stringify(data)}`);
        }
      } catch (error) {
        console.error('Ошибка парсинга:', error);
      }
    };

    websocket.onclose = () => {
      setIsConnected(false);
      //setMessages((prev) => [...prev, 'Соединение разорвано']);
      setTimeout(() => connectWebSocket(), 3000);
    };

    wsRef.current = websocket;
  };

  const logout = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    sessionStorage.clear();
    //addChatMessage('Вы вышли из системы', 'system');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="flex h-[100vh] w-[100wh] flex-col bg-gray-800">
      {/* Верхняя панель */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-6 py-3">
        <Title />
        <button
          className="rounded bg-[#324ab2] px-4 py-2 text-gray-200 transition-colors hover:bg-[#3b56c4]"
          onClick={logout}
        >
          Выйти
        </button>
      </div>

      {/* Статус подключения */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-6 py-2">
        <div className="text-sm">
          {isConnected ? (
            <span className="text-green-400">● Подключено к серверу</span>
          ) : (
            <span className="text-red-400">○ Нет подключения к серверу</span>
          )}
        </div>
      </div>

      {/* Основной контент - чат занимает основное пространство */}
      <div className="flex flex-1 flex-col overflow-hidden bg-gray-800">
        {/* Заголовок чата */}
        <div className="border-b border-gray-700 px-4 py-2">
          <h3 className="text-sm font-semibold text-gray-300">Системные сообщения</h3>
        </div>

        {/* Область сообщений - растягивается на всё доступное пространство */}
        <div className="flex-1 overflow-hidden">
          <ChatLog messages={messages} />
        </div>
      </div>
    </div>
  );
};
