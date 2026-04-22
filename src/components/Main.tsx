import { Title } from './Title';
import { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { CreateGameDialog } from './CreateGameDialog';
import { Layout } from '../types/Layout';
import { MainMenu } from './MainMenu';
import { CreateGameStep } from '../types/CreateGameStep';
/*** 
Основной интерфейс
*/
export const Main: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState<string>('');
  const [layout, setLayout] = useState<Layout>('main');
  const [gameCreationStep, setGameCreationStep] = useState<CreateGameStep | null>(null);
  // TODO: разграничение пользователей на админов и судей
  const IsAdmin = true;
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let savedId = sessionStorage.getItem('ws_client_id');
    if (!savedId) {
      // TODO: получение ID с сервера
      savedId = `judge_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('ws_client_id', savedId);
    }
    setClientId(savedId);
    connectWebSocket(savedId);

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = (id: string) => {
    // Определяем WebSocket URL (используем текущий хост)
    // TODO: динамическое получение порта с сервера
    const wsUrl = `ws://${window.location.hostname}:8000/ws/${id}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket подключен');
      setIsConnected(true);
      setMessage('Подключение установлено...');
    };

    // обработка входящих сообщений
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Получено сообщение:', data);

        // Обрабатываем разные типы сообщений
        switch (data.type) {
          case 'connection':
            // Это подтверждение подключения от сервера
            setMessage(`✅ ${data.message} (Всего клиентов: ${data.clients_count})`);
            break;

          case 'create_game':
            // Обработка сообщений от сервера для создания игры
            if (data.subtype) {
              setGameCreationStep(data.subtype);
              if (data.subtype !== 'create_game_finish') {
                setLayout('create_game');
              }
            }
            if (data.message) {
              addLog(data.message, true);
            }
            break;

          case 'not_admin':
            setMessage(`⛔ ${data.message || 'Доступ запрещён. Только для администратора.'}`);
            break;

          case 'message':
            setMessage(`💬 ${data.client_id}: ${data.message}`);
            break;

          case 'user_joined':
            setMessage(
              `👤 Пользователь ${data.client_id} присоединился (Всего: ${data.clients_count})`,
            );
            break;

          case 'user_left':
            setMessage(
              `👋 Пользователь ${data.client_id} покинул чат (Осталось: ${data.clients_count})`,
            );
            break;

          default:
            setMessage(`📨 Получено: ${JSON.stringify(data)}`);
        }
      } catch (error) {
        console.error('Ошибка парсинга сообщения:', error);
        setMessage(`Получено: ${event.data}`);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
      setMessage('❌ Ошибка подключения к WebSocket');
      setIsConnected(false);
    };

    websocket.onclose = () => {
      console.log('WebSocket отключен');
      setIsConnected(false);
      setMessage('⚠️ Соединение с сервером разорвано');

      // Пытаемся переподключиться через 3 секунды
      setTimeout(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          console.log('Попытка переподключения...');
          connectWebSocket(clientId);
        }
      }, 3000);
    };

    wsRef.current = websocket;
  };

  const sendWebSocketMessage = (type: string, subtype?: string, content?: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: any = {
        type: type,
        timestamp: new Date().toISOString(),
      };
      if (subtype) message.subtype = subtype;
      if (content) Object.assign(message, content);

      wsRef.current.send(JSON.stringify(message));
      console.log('Отправлено:', message);
    } else {
      console.warn('WebSocket не подключен');
      setMessage('⚠️ Нет соединения с сервером');
    }
  };

  const addLog = (msg: string, fromServer: boolean) => {
    setMessage(msg);
    if (fromServer) {
      // TODO
    }
  };

  const switchLayout = (layout: Layout) => setLayout(layout);

  const logout = () => {
    // Закрываем WebSocket соединение
    if (wsRef.current) {
      wsRef.current.close();
    }
    sessionStorage.clear();
    // TODO: Перенаправление на страницу логина
    window.location.reload();
  };

  const renderLayout = () => {
    switch (layout) {
      case 'main':
        return (
          <MainMenu
            addLog={addLog}
            isAdmin={IsAdmin}
            sendWebSocketMessage={sendWebSocketMessage}
            switchLayout={switchLayout}
          />
        );
      case 'create_game':
        return (
          <CreateGameDialog
            onClose={() => {
              setLayout('main');
              setGameCreationStep(null);
            }}
            sendMessage={sendWebSocketMessage}
            currentStep={gameCreationStep}
          />
        );
    }
  };

  return (
    <div className="flex h-[100vh] w-[100wh] flex-col place-content-center items-center gap-2 bg-gray-700">
      <button
        className="absolute top-3 right-7 h-8 w-24 cursor-pointer rounded border border-none bg-[#324ab2] text-gray-200"
        onClick={logout}
      >
        Выйти
      </button>
      <Title />
      <div
        className={twMerge(
          'h-32 w-74 rounded border border-gray-400 px-2 py-1 text-left text-gray-200',
          message === null && 'text-gray-500',
        )}
      >
        {message === null ? 'Ответ от сервера...' : message}
      </div>

      {/* Индикатор статуса подключения */}
      <div className="text-sm text-gray-400">
        {isConnected ? (
          <span className="text-green-400">● Подключено к серверу (ID: {clientId})</span>
        ) : (
          <span className="text-red-400">○ Нет подключения к серверу</span>
        )}
      </div>
      {renderLayout()}
    </div>
  );
};
