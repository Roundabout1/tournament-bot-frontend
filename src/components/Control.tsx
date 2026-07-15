import { Title } from './Title';
import { useState, useEffect, useRef } from 'react';
import { CreateGameDialog } from './dialogs/create_game/CreateGameDialog';
import { Layout } from '../types/Layout';
import { MainMenu } from './MainMenu';
import { ConfirmData, CreateGameState, ShuffleType } from './dialogs/create_game/types';
import { Message } from '../types/Message';
import { ChatLog } from './chat/ChatLog';
import { getCommandText } from '../types/CommandTexts';
import { DeletePlayerDialog } from './dialogs/delete_player/DeletePlayerDialog';
import { AddResultsDialog } from './dialogs/add_results/AddResultsDialog';
import { EditHistoryDialog } from './dialogs/add_results/EditHistoryDialog';
import { Auth } from './Auth';
import { RestorePlayerDialog } from './dialogs/restore_player/ResotrePlayerDialog';
import { MESSAGES_STORAGE_KEY } from '../consts/StorageKeys';
import { LogoutProps } from './interfaces/logout';

interface ControlProps extends LogoutProps {
  isAdmin: boolean;
}

export const Control: React.FC<ControlProps> = ({ isAdmin, logout }) => {
  // Загрузка сообщений из sessionStorage при инициализации
  const loadMessagesFromStorage = (): Message[] => {
    try {
      const stored = sessionStorage.getItem(MESSAGES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Восстанавливаем объекты Date из строк
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.error('Ошибка загрузки сообщений из sessionStorage:', error);
    }
    return [];
  };

  const [messages, setMessages] = useState<Message[]>(loadMessagesFromStorage);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('');
  const [layout, setLayout] = useState<Layout>('main');
  const [gameCreationStep, setGameCreationStep] = useState<CreateGameState | null>(null);
  const [playerList, setPlayerList] = useState<string[]>([]);
  const [addResultsTables, setAddResultsTables] = useState<string[]>([]);
  const [addResultsTableInfo, setAddResultsTableInfo] = useState<any>(null);
  const [addResultsStep, setAddResultsStep] = useState<string>('start');
  const [appError, setAppError] = useState<string | null>(null);
  const [editHistoryEntries, setEditHistoryEntries] = useState<any[]>([]);
  const [editHistoryRecordInfo, setEditHistoryRecordInfo] = useState<any>(null);
  const [editHistoryStep, setEditHistoryStep] = useState<string>('start');
  const [isAuth, setIsAuth] = useState<boolean>(false);
  /** заморозка основного интерфейса */
  const [isMenuFreezed, setIsMenuFreezed] = useState<boolean>(true);
  const [authError, setAuthError] = useState<boolean>(false);
  const [isWaitingAuth, setisWaitingAuth] = useState<boolean>(false);
  const [isPassRequired, setIsPassRequired] = useState<boolean>(false);
  const [chatSessionStore, setChatSessionStore] = useState<boolean>(true);
  const [shuffleType, setShuffleType] = useState<ShuffleType | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Сохранение сообщений в sessionStorage при каждом изменении
  useEffect(() => {
    if (!chatSessionStore) {
      return;
    }
    try {
      sessionStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Ошибка сохранения сообщений в sessionStorage:', error);
    }
  }, [messages]);

  useEffect(() => {
    if (isConnected || !isAuth) {
      return;
    }
    addChatMessage('Соединение с сервером разорвано', 'error');
  }, [isConnected]);

  useEffect(() => {
    if (!connectionError) {
      return;
    }
    addChatMessage('Ошибка подключения к серверу', 'error');
  }, [connectionError]);

  /** Функция для добавления сообщения*/
  const addChatMessage = (text: string, type: Message['type'] = 'system', sender?: string) => {
    const newMessage: Message = {
      id: `${Date.now().toString()}_${messages.length}`,
      type,
      text,
      timestamp: new Date(),
      sender,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const saveFile = (blob: Blob, name: string) => {
    const blobURL = URL.createObjectURL(blob);
    // Сделать невидимый HTML-элемент `<a download>`
    // и включить его в документ
    const a = document.createElement('a');
    a.href = blobURL;
    a.download = name;
    a.style.display = 'none';
    document.body.append(a);
    // Программно кликнуть по ссылке.
    a.click();
    // Уничтожить большой blob URL
    // и удалить ссылку из документа
    // после клика по ней
    setTimeout(() => {
      URL.revokeObjectURL(blobURL);
      a.remove();
    }, 1000);
  };

  useEffect(() => {
    connectWebSocket();

    // Добавляем приветственное сообщение только если нет сохранённых сообщений
    if (messages.length === 0) {
      addChatMessage('Добро пожаловать в систему управления турниром!', 'system');
    }

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (layout != 'main') {
      setAppError('');
    }
  }, [layout]);

  const connectWebSocket = () => {
    if (wsRef.current && wsRef.current?.readyState === wsRef.current?.OPEN) {
      console.log(`Повторная попытка подключиться: ${wsRef.current}`);
      return;
    }
    // Определяем WebSocket URL (используем текущий хост)
    const wsUrl = `ws://${window.location.hostname}:${window.location.port}/ws/control/${isAdmin ? 'admin' : 'judge'}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket подключен');
      setIsConnected(true);
      setConnectionError(false);
      setIsAuth(false);
      addChatMessage('Соединение с сервером установлено', 'system');
    };

    // обработка входящих сообщений
    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Получено сообщение:', data);

        // Обрабатываем разные типы сообщений
        switch (data.type) {
          case 'before_auth':
            setIsPassRequired(data.is_pass_required);
            break;
          case 'connection':
            addChatMessage(`${data.message}`, 'server', 'Сервер');
            setIsAuth(true);
            setAuthError(false);
            setisWaitingAuth(false);
            setIsMenuFreezed(false);
            if (data.shuffle_type) {
              setShuffleType(shuffleType);
            }
            break;

          case 'incorrect_password':
            setAuthError(true);
            setisWaitingAuth(false);
            setIsAuth(false);
            setIsMenuFreezed(true);
            break;

          case 'create_game':
            setGameCreationStep(data.subtype);
            if (data.subtype === 'start' || data.subtype === 'confirm') {
              switchLayout('create_game');
              setAppError(null);
            }
            if (data.message) {
              addChatMessage(data.message, 'server', 'Сервер');
            }
            break;

          case 'game_info':
            if (data.message) {
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

          case 'restore_player':
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
            switchLayout('restore_player');
            break;

          case 'add_results':
            if (data.subtype === 'start') {
              setAddResultsTables(data.tables || []);
              setAddResultsStep(data.subtype);
              switchLayout('add_results');
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

          case 'edit_history':
            if (data.subtype === 'start') {
              setEditHistoryEntries(data.entries || []);
              setEditHistoryStep(data.subtype);
              switchLayout('edit_history');
            } else if (data.subtype === 'entry_player_result') {
              setEditHistoryRecordInfo({
                table: data.table,
                player1: data.player1,
                player2: data.player2,
                tour: data.tour,
                hasFines: data.has_fines,
              });
              setEditHistoryStep(data.subtype);
            } else if (data.subtype === 'finish') {
              setEditHistoryStep(data.subtype);
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
            setAppError(data.message);
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
      setConnectionError(true);
      setIsConnected(false);
    };

    websocket.onclose = () => {
      console.log('WebSocket отключен');
      setIsConnected(false);
      setLayout('main');
      setIsMenuFreezed(true);

      // Пытаемся переподключиться через 3 секунды
      setTimeout(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          console.log('Попытка переподключения...');
          connectWebSocket();
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

  const downloadFile = async (filetype: string, filename: string) => {
    const response = await fetch(`/download/${filetype}`, {
      mode: 'cors',
      method: 'GET',
    });
    const blob = await response.blob();
    saveFile(blob, `${filename}.xlsx`);
    addChatMessage(`📎 Файл "${filename}" сохранён в загрузках`, 'server', 'Сервер');
  };

  const downloadSumUp = async (filename: string = 'Распределение мест') => {
    await downloadFile('sum_up_results', filename);
  };

  const downloadRoundsData = async (filename: string = 'Данные туров') => {
    await downloadFile('rounds_data', filename);
  };

  const sendAuthMessage = (name: string, pass: string) => {
    sendWebSocketMessage('auth', '', { name: name, password: pass });
  };

  const switchLayout = (layout: Layout) => setLayout(layout);

  const onLogout = () => {
    setChatSessionStore(false);
    if (wsRef.current) {
      wsRef.current.close();
    }
    logout();
  };

  const returnToMain = () => {
    setLayout('main');
  };

  const renderLayout = () => {
    switch (layout) {
      case 'main':
        return (
          <MainMenu
            isAdmin={isAdmin}
            disabled={isMenuFreezed}
            sendWebSocketMessage={sendWebSocketMessage}
            downloadSumUp={downloadSumUp}
            downloadRoundsData={downloadRoundsData}
            shuffleType={shuffleType}
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
            confirmNewGame={async (confirm: boolean, download: boolean) => {
              if (download) {
                await downloadSumUp();
                await downloadRoundsData();
              }
              sendWebSocketMessage('create_game', 'confirm', {
                confirm: confirm,
              } as ConfirmData);
            }}
            currentStep={gameCreationStep}
            serverError={appError}
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
      case 'restore_player':
        return (
          <RestorePlayerDialog
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
              returnToMain();
              setAddResultsTables([]);
              setAddResultsTableInfo(null);
              setAddResultsStep('');
            }}
            sendMessage={sendWebSocketMessage}
            step={addResultsStep}
            tables={addResultsTables}
            tableInfo={addResultsTableInfo}
            extrenalError={appError}
          />
        );
      case 'edit_history':
        return (
          <EditHistoryDialog
            onClose={() => {
              returnToMain();
              setEditHistoryEntries([]);
              setEditHistoryRecordInfo(null);
              setEditHistoryStep('');
            }}
            sendMessage={sendWebSocketMessage}
            step={editHistoryStep}
            entries={editHistoryEntries}
            recordInfo={editHistoryRecordInfo}
            externalError={appError}
          />
        );
      default:
        return null;
    }
  };

  const renderTopPanel = () => {
    return (
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-6 py-3">
        <Title />
        <button
          className="rounded bg-[#324ab2] px-4 py-2 text-gray-200 transition-colors hover:bg-[#3b56c4]"
          onClick={onLogout}
        >
          Выйти
        </button>
      </div>
    );
  };

  const renderAuthForm = () => {
    if (isAuth) {
      return;
    }
    if (!isConnected) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-800">
          <p className="text-2xl text-gray-300">Идёт подключение к серверу...</p>
        </div>
      );
    }
    return (
      <Auth
        onSubmit={(name, pass) => {
          sendAuthMessage(name, pass);
          setClientName(name);
        }}
        authError={authError}
        isWaitingData={isWaitingAuth}
        isAdmin={isAdmin}
        isPassRequired={isPassRequired}
      />
    );
  };

  const renderSubTopPanel = () => {
    return (
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-6 py-2">
        <div className="text-sm">
          {isConnected ? (
            <span className="text-green-400">● Подключено к серверу</span>
          ) : (
            <span className="text-red-400">○ Нет подключения к серверу</span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          ID: {clientName} ({isAdmin ? 'Администратор' : 'Судья'})
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return (
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
    );
  };

  const renderMenu = () => {
    return <div className="border-t border-gray-700 bg-gray-900 p-4">{renderLayout()}</div>;
  };

  const renderControlPanel = () => {
    if (!isAuth) {
      return null;
    }
    return (
      <>
        {renderSubTopPanel()}
        {renderChat()}
        {renderMenu()}
      </>
    );
  };

  return (
    <div className="flex h-[100vh] w-[100wh] flex-col bg-gray-800">
      {renderTopPanel()}
      {renderAuthForm()}
      {renderControlPanel()}
    </div>
  );
};
