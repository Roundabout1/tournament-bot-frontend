import { Layout } from '../types/Layout';
import { ButtonsList } from './ButtonsList';

interface MainMenuProps {
  //onClose: () => void;
  sendWebSocketMessage: (type: string, subtype: string, content?: any) => void;
  addLog: (msg: string, fromServer: boolean) => void;
  switchLayout: (layout: Layout) => void;
  isAdmin: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  sendWebSocketMessage,
  addLog,
  switchLayout,
  isAdmin,
}) => {
  const handleCreateGame = () => {
    sendWebSocketMessage('create_game', 'create_game');
    switchLayout('create_game');
  };

  const handleSumUpResults = () => {
    sendWebSocketMessage('sum_up_results', 'sum_up');
    addLog('📊 Подведение итогов...', false);
  };

  const handleEnterResults = () => {
    sendWebSocketMessage('enter_results', 'enter');
    addLog('✏️ Ввод результатов...', false);
  };

  const handleEdit = () => {
    sendWebSocketMessage('edit', 'edit');
    addLog('📝 Редактирование...', false);
  };

  const handleStatus = () => {
    sendWebSocketMessage('status', 'status');
    addLog('ℹ️ Запрос статуса...', false);
  };

  const handleRemovePlayer = () => {
    sendWebSocketMessage('remove_player', 'remove');
    addLog('🗑️ Удаление игрока...', false);
  };

  const handleDraw = () => {
    sendWebSocketMessage('draw', 'draw');
    addLog('🎲 Жеребьёвка...', false);
  };

  const handleRoundsData = () => {
    sendWebSocketMessage('rounds_data', 'get_rounds');
    addLog('📋 Запрос данных туров...', false);
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
  return <ButtonsList buttonClassName="w-74 py-2 h-auto" buttons={buttons} />;
};
