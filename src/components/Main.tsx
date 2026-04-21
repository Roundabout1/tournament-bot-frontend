import { ButtonsList } from './ButtonsList';
import { Title } from './Title';
import { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
/*** 
Основной интерфейс
*/
export const Main: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState<string>('');
  // TODO: разграничение пользователей на админов и судей
  const IsAdmin = true;
  const wsRef = useRef<WebSocket | null>(null);

  // Получаем или создаём client_id при загрузке компонента
  useEffect(() => {
    // Пробуем получить ID из sessionStorage или генерируем новый
    let savedId = sessionStorage.getItem('ws_client_id');
    if (!savedId) {
      // TODO: получение ID с сервера
      savedId = `judge_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('ws_client_id', savedId);
    }
    setClientId(savedId);

    // Подключаемся к WebSocket
    connectWebSocket(savedId);

    // Отключаемся при размонтировании компонента
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  // Функция подключения к WebSocket
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

          case 'broadcast':
            setMessage(`📢 Broadcast: ${data.message}`);
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

          case 'create_game_accept':
            setMessage(`✅ Запрос на создание игры принят...`);
            break;

          default:
            setMessage(`📨 Получено: ${JSON.stringify(data)}`);
        }

        // // Через 5 секунд очищаем сообщение (опционально)
        // setTimeout(() => {
        //   // if (message === setMessage) {
        //   //   // Не очищаем если это последнее сообщение
        //   // }
        // }, 5000);
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

  // Функция для отправки сообщения через WebSocket
  const sendWebSocketMessage = (type: string, content?: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = {
        type: type,
        content: content,
        timestamp: new Date().toISOString(),
      };
      wsRef.current.send(JSON.stringify(message));
      console.log('Отправлено:', message);
    } else {
      console.warn('WebSocket не подключен');
      setMessage('⚠️ Нет соединения с сервером');
    }
  };

  const handleCreateGame = () => {
    sendWebSocketMessage('create_game');
    setMessage('🎮 Создание игры...');
    // TODO: Остальная логика
  };

  const handleSumUpResults = () => {
    sendWebSocketMessage('sum_up_results', { action: 'sum_up' });
    setMessage('📊 Подведение итогов...');
    // TODO
  };

  const handleEnterResults = () => {
    sendWebSocketMessage('enter_results', { action: 'enter' });
    setMessage('✏️ Ввод результатов...');
    // TODO
  };

  const handleEdit = () => {
    sendWebSocketMessage('edit', { action: 'edit' });
    setMessage('📝 Редактирование...');
    // TODO
  };

  const handleStatus = () => {
    sendWebSocketMessage('status', { action: 'status' });
    setMessage('ℹ️ Запрос статуса...');
    // TODO
  };

  const handleRemovePlayer = () => {
    sendWebSocketMessage('remove_player', { action: 'remove' });
    setMessage('🗑️ Удаление игрока...');
    // TODO
  };

  const handleDraw = () => {
    sendWebSocketMessage('draw', { action: 'draw' });
    setMessage('🎲 Жеребьёвка...');
    // TODO
  };

  const handleRoundsData = () => {
    sendWebSocketMessage('rounds_data', { action: 'get_rounds' });
    setMessage('📋 Запрос данных туров...');
    // TODO
  };

  const logout = () => {
    // Закрываем WebSocket соединение
    if (wsRef.current) {
      wsRef.current.close();
    }
    sessionStorage.clear();
    // TODO: Перенаправление на страницу логина
    window.location.reload();
  };

  const buttons = [
    {
      text: 'Создать игру',
      action: handleCreateGame,
      hidden: !IsAdmin,
    },
    {
      text: 'Подвести итоги',
      action: handleSumUpResults,
    },
    {
      text: 'Ввести результат',
      action: handleEnterResults,
    },
    {
      text: 'Ред.',
      action: handleEdit,
    },
    {
      text: 'Статус',
      action: handleStatus,
    },
    {
      text: 'Удалить игрока',
      action: handleRemovePlayer,
    },
    {
      text: 'Жеребьёвка',
      action: handleDraw,
    },
    {
      text: 'Данные туров',
      action: handleRoundsData,
    },
  ];

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

      <ButtonsList buttonClassName="w-74 py-2 h-auto" buttons={buttons} />
    </div>
  );
};
