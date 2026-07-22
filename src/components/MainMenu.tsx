import { ButtonsList } from './ButtonsList';
import { ShuffleType } from './dialogs/create_game/types';

interface MainMenuProps {
  sendWebSocketMessage: (type: string, subtype: string, content?: any) => void;
  downloadSumUp: () => void;
  downloadRoundsData: () => void;
  isAdmin: boolean;
  disabled?: boolean;
  shuffleType: ShuffleType | null;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  sendWebSocketMessage,
  downloadSumUp,
  downloadRoundsData,
  isAdmin,
  shuffleType,
  disabled = false,
}) => {
  const handleCreateGame = () => {
    sendWebSocketMessage('create_game', 'start');
  };

  const handleLoadGame = () => {
    sendWebSocketMessage('load_game', 'list');
  };

  const handleAddResults = () => {
    sendWebSocketMessage('add_results', 'start');
  };

  const handleEdit = () => {
    sendWebSocketMessage('edit_history', 'start');
  };

  const handleStatus = () => {
    sendWebSocketMessage('game_info', 'status');
  };

  const handleRemovePlayer = () => {
    sendWebSocketMessage('delete_player', 'list');
  };

  const handleRestorePlayer = () => {
    sendWebSocketMessage('restore_player', 'list');
  };

  const handleDraw = () => {
    sendWebSocketMessage('game_info', 'shuffle');
  };

  const handleSumUpResults = () => {
    downloadSumUp();
  };

  const handleRoundsData = () => {
    downloadRoundsData();
  };

  const buttons = [
    {
      text: 'Создать игру',
      action: handleCreateGame,
      hidden: !isAdmin,
    },
    {
      text: 'Загрузить игру',
      action: handleLoadGame,
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
      hidden: !isAdmin || !shuffleType || shuffleType === ShuffleType.MultiTournament,
    },
    {
      text: 'Вернуть игрока',
      action: handleRestorePlayer,
      hidden: !isAdmin || !shuffleType || shuffleType === ShuffleType.MultiTournament, // TODO: если удалённых игроков нет, то кнопка спрятана
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
  return <ButtonsList buttons={buttons} disabled={disabled} />;
};
