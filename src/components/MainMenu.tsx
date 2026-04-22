import { Layout } from '../types/Layout';
import { MessageType } from '../types/Message';
import { ButtonsList } from './ButtonsList';

interface MainMenuProps {
  //onClose: () => void;
  sendWebSocketMessage: (type: string, subtype: string, content?: any) => void;
  addChatMessage: (text: string, type: MessageType, sender?: string) => void;
  switchLayout: (layout: Layout) => void;
  isAdmin: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  sendWebSocketMessage,
  addChatMessage,
  switchLayout,
  isAdmin,
}) => {
  const handleCreateGame = () => {
    sendWebSocketMessage('create_game', 'create_game');
    switchLayout('create_game');
  };

  const handleSumUpResults = () => {
    sendWebSocketMessage('sum_up_results', 'sum_up');
    addChatMessage('📊 Подведение итогов...', "user");
  };

  const handleEnterResults = () => {
    sendWebSocketMessage('enter_results', 'enter');
    addChatMessage('✏️ Ввод результатов...', "user");
  };

  const handleEdit = () => {
    sendWebSocketMessage('edit', 'edit');
    addChatMessage('📝 Редактирование...', "user");
  };

  const handleStatus = () => {
    sendWebSocketMessage('status', 'status');
    addChatMessage('ℹ️ Запрос статуса...', "user");
  };

  const handleRemovePlayer = () => {
    sendWebSocketMessage('remove_player', 'remove');
    addChatMessage('🗑️ Удаление игрока...', "user");
  };

  const handleDraw = () => {
    sendWebSocketMessage('draw', 'draw');
    addChatMessage('🎲 Жеребьёвка...', "user");
  };

  const handleRoundsData = () => {
    sendWebSocketMessage('rounds_data', 'get_rounds');
    addChatMessage('📋 Запрос данных туров...', "user");
  };

  const buttons = [
    {
      text: 'Создать игру',
      action: handleCreateGame,
      hidden: !isAdmin,
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
  return <ButtonsList buttonClassName="w-96 py-2 h-auto" buttons={buttons} />;
};
