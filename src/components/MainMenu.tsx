import { ButtonsList } from './ButtonsList';

interface MainMenuProps {
  sendWebSocketMessage: (type: string, subtype: string, content?: any) => void;
  downloadSumUp: () => void;
  downloadRoundsData: () => void;
  isAdmin: boolean;
  disabled?: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  sendWebSocketMessage,
  downloadSumUp,
  downloadRoundsData,
  isAdmin,
  disabled = false,
}) => {
  const handleCreateGame = () => {
    sendWebSocketMessage('create_game', 'start');
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
      text: 'Вернуть игрока',
      action: handleRestorePlayer,
      hidden: !isAdmin, // TODO: если удалённых игроков нет, то кнопка спрятана
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
