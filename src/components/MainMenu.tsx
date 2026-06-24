import { Layout } from '../types/Layout';
import { ButtonsList } from './ButtonsList';

interface MainMenuProps {
  sendWebSocketMessage: (type: string, subtype: string, content?: any) => void;
  switchLayout: (layout: Layout) => void;
  downloadFile: (filetype: string, filename: string) => void;
  isAdmin: boolean;
  disabled?: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  sendWebSocketMessage,
  switchLayout,
  downloadFile,
  isAdmin,
  disabled = false,
}) => {
  const handleCreateGame = () => {
    sendWebSocketMessage('create_game', 'create_game');
    switchLayout('create_game');
  };

  const handleAddResults = () => {
    sendWebSocketMessage('add_results', 'start');
  };

  const handleEdit = () => {
    sendWebSocketMessage('edit_history', 'start');
    switchLayout('edit_history');
  };

  const handleStatus = () => {
    sendWebSocketMessage('game_info', 'status');
  };

  const handleRemovePlayer = () => {
    sendWebSocketMessage('delete_player', 'list');
  };

  const handleDraw = () => {
    sendWebSocketMessage('game_info', 'shuffle');
  };

  const handleSumUpResults = () => {
    downloadFile('sum_up_results', 'Распределение мест');
  };

  const handleRoundsData = () => {
    downloadFile('rounds_data', 'Данные туров');
  };

  const buttons = [
    {
      text: 'Создать игру',
      action: handleCreateGame,
      hidden: !isAdmin,
    },
    {
      text: 'Ввести результат',
      action: handleAddResults,
    },
    {
      text: 'Ред.',
      action: handleEdit,
      hidden: !isAdmin,
    },
    {
      text: 'Статус',
      action: handleStatus,
    },
    {
      text: 'Жеребьёвка',
      action: handleDraw,
    },
    {
      text: 'Удалить игрока',
      action: handleRemovePlayer,
      hidden: !isAdmin,
    },
    {
      text: 'Подвести итоги',
      action: handleSumUpResults,
      hidden: !isAdmin,
    },
    {
      text: 'Данные туров',
      action: handleRoundsData,
      hidden: !isAdmin,
    },
  ];
  return <ButtonsList buttonClassName="w-96 py-2 h-auto" buttons={buttons} disabled={disabled} />;
};
