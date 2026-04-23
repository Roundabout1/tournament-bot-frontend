import { Title } from './Title';
import { useState, useEffect, useRef } from 'react';
import { CreateGameDialog } from './dialogs/create_game/CreateGameDialog';
import { Layout } from '../types/Layout';
import { MainMenu } from './MainMenu';
import { CreateGameStep } from '../types/CreateGameStep';
import { Message } from '../types/Message';
import { ChatLog } from './chat/ChatLog';
import { getCommandText } from '../types/CommandTexts';
import { DeletePlayerDialog } from './dialogs/delete_player/DeletePlayerDialog';
import { AddResultsDialog } from './dialogs/add_results/AddResultsDialog';

export const Main: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState<string>('');
  const [layout, setLayout] = useState<Layout>('main');
  const [gameCreationStep, setGameCreationStep] = useState<CreateGameStep | null>(null);
  const [playerList, setPlayerList] = useState<string[]>([]);
  const [addResultsTables, setAddResultsTables] = useState<string[]>([]);
  const [addResultsTableInfo, setAddResultsTableInfo] = useState<any>(null);
  const [addResultsStep, setAddResultsStep] = useState<string>('start');
  const IsAdmin = true;
  const wsRef = useRef<WebSocket | null>(null);

  /** Функция для добавления сообщения*/
  const addChatMessage = (text: string, type: Message['type'] = 'system', sender?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date(),
      sender,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  useEffect(() => {
    let savedId = sessionStorage.getItem('ws_client_id');
    if (!savedId) {
      // TODO: получение ID с сервера
      savedId = `judge_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('ws_client_id', savedId);
    }
    setClientId(savedId);
    connectWebSocket(savedId);

    // Добавляем приветственное сообщение
    addChatMessage('Добро пожаловать в систему управления турниром!', 'system');

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
      addChatMessage('Соединение с сервером установлено', 'system');
    };

    // обработка входящих сообщений
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Получено сообщение:', data);

        // Обрабатываем разные типы сообщений
        switch (data.type) {
          case 'connection':
            addChatMessage(
              `${data.message} (Всего клиентов: ${data.clients_count})`,
              'server',
              'Сервер',
            );
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
              addChatMessage(data.message, 'server', 'Сервер');
            }
            break;

          case 'game_info':
            if (data.subtype === 'sum_up_results' || data.subtype === 'rounds_data') {
              var filename = data.message;
              var what = data.subtype === 'sum_up_results' ? 'Итоги' : 'Данные туров';
              addChatMessage(`📎 ${what} сохранены в файле "${filename}"`, 'server', 'Сервер');
            } else if (data.message) {
              addChatMessage(data.message, 'server', 'Сервер');
            }
            break;

          case 'delete_player':
            var sub = data.subtype;
            if (sub != 'list') {
              console.warn('Ожидается subtype: list');
              addChatMessage('Ошибка! Получено некорректное сообщение от сервера!', 'error');
              break;
            }
            if (data.message) {
              addChatMessage(data.message, 'server', 'Сервер');
            }
            if (!data.players) {
              console.warn('Ожидается поле players');
              addChatMessage('Ошибка! От сервера не пришёл список игроков!', 'error');
              break;
            }
            var players = data.players as string[];
            setPlayerList(players);
            switchLayout('delete_player');
            break;

          case 'add_results':
            if (data.subtype === 'start') {
              setAddResultsTables(data.tables || []);
              setAddResultsStep(data.subtype);
            } else if (data.subtype === 'entry_player_result') {
              setAddResultsTableInfo({
                table: data.table,
                player1: data.player1,
                player2: data.player2,
                hasFines: data.has_fines,
              });
              setAddResultsStep(data.subtype);
            } else if (data.subtype === 'finish') {
              setAddResultsStep(data.subtype);
            }
            if (data.message) {
              addChatMessage(data.message, 'server', 'Сервер');
            }
            break;

          case 'not_admin':
            addChatMessage(data.message || 'Доступ запрещён. Только для администратора.', 'error');
            break;

          case 'message':
            addChatMessage(data.message, 'user', data.client_id);
            break;

          case 'user_joined':
            addChatMessage(
              `Пользователь ${data.client_id} присоединился (Всего: ${data.clients_count})`,
              'system',
            );
            break;

          case 'user_left':
            addChatMessage(
              `Пользователь ${data.client_id} покинул чат (Осталось: ${data.clients_count})`,
              'system',
            );
            break;

          case 'app_error':
            addChatMessage(data.message, 'error');
            break;

          case 'event':
            addChatMessage(data.message, 'system');
            break;

          case 'no_game':
            addChatMessage(data.message, 'server');
            break;

          case 'game_closed':
            addChatMessage(data.message, 'server');
            break;

          default:
            addChatMessage(`Получено: ${JSON.stringify(data)}`, 'server', 'Сервер');
        }
      } catch (error) {
        console.error('Ошибка парсинга сообщения:', error);
        addChatMessage(`Ошибка обработки сообщения: ${event.data}`, 'error');
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
      addChatMessage('Ошибка подключения к WebSocket', 'error');
      setIsConnected(false);
    };

    websocket.onclose = () => {
      console.log('WebSocket отключен');
      setIsConnected(false);
      addChatMessage('Соединение с сервером разорвано', 'error');

      // Пытаемся переподключиться через 3 секунды
      setTimeout(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          console.log('Попытка переподключения...');
          addChatMessage('Попытка переподключения...', 'system');
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

      // Добавляем сообщение о команде в чат
      const commandText = getCommandText(type, subtype, content);
      if (commandText) {
        addChatMessage(commandText, 'user', 'Вы');
      }
    } else {
      console.warn('WebSocket не подключен');
      addChatMessage('Нет соединения с сервером', 'error');
    }
  };

  const switchLayout = (layout: Layout) => setLayout(layout);

  const logout = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    sessionStorage.clear();
    addChatMessage('Вы вышли из системы', 'system');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const returnToMain = () => {
    setLayout('main');
  };

  const renderLayout = () => {
    switch (layout) {
      case 'main':
        return (
          <MainMenu
            isAdmin={IsAdmin}
            sendWebSocketMessage={sendWebSocketMessage}
            switchLayout={switchLayout}
          />
        );
      case 'create_game':
        return (
          <CreateGameDialog
            onClose={() => {
              returnToMain();
              setGameCreationStep(null);
            }}
            sendMessage={sendWebSocketMessage}
            currentStep={gameCreationStep}
          />
        );
      case 'delete_player':
        return (
          <DeletePlayerDialog
            sendMessage={sendWebSocketMessage}
            players={playerList}
            onClose={() => {
              returnToMain();
              setPlayerList([]);
            }}
          />
        );
      case 'add_results':
        return (
          <AddResultsDialog
            onClose={() => {
              setLayout('main');
              setAddResultsTables([]);
              setAddResultsTableInfo(null);
              setAddResultsStep('start');
            }}
            sendMessage={sendWebSocketMessage}
            step={addResultsStep}
            tables={addResultsTables}
            tableInfo={addResultsTableInfo}
          />
        );
      default:
        return null;
    }
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
        <div className="text-xs text-gray-500">ID: {clientId}</div>
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

      {/* Нижняя панель - меню */}
      <div className="border-t border-gray-700 bg-gray-900 p-4">{renderLayout()}</div>
    </div>
  );
};
