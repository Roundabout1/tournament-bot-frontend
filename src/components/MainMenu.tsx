import { Layout } from '../types/Layout';
import { ButtonsList } from './ButtonsList';

interface MainMenuProps {
  sendWebSocketMessage: (type: string, subtype: string, content?: any) => void;
  switchLayout: (layout: Layout) => void;
  isAdmin: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  sendWebSocketMessage,
  switchLayout,
  isAdmin,
}) => {
  const handleCreateGame = () => {
    sendWebSocketMessage('create_game', 'create_game');
    switchLayout('create_game');
  };

  const handleSumUpResults = () => {
    sendWebSocketMessage('game_info', 'sum_up_results');
  };

  const handleEnterResults = () => {
    sendWebSocketMessage('add_results', 'start');
  };

  const handleEdit = () => {
    sendWebSocketMessage('edit', 'edit');
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

  const handleRoundsData = () => {
    sendWebSocketMessage('game_info', 'rounds_data');
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
      hidden: !isAdmin,
    },
    {
      text: 'Ввести результат',
      action: handleEnterResults,
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
      text: 'Удалить игрока',
      action: handleRemovePlayer,
      hidden: !isAdmin,
    },
    {
      text: 'Жеребьёвка',
      action: handleDraw,
    },
    {
      text: 'Данные туров',
      action: handleRoundsData,
      hidden: !isAdmin,
    },
  ];
  return <ButtonsList buttonClassName="w-96 py-2 h-auto" buttons={buttons} />;
};
