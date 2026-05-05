import React from 'react';
import { DialogForm } from '../DialogForm';
import { RejectButton } from '../RejectButton';
import { ButtonsList } from '../../ButtonsList';

interface DeletePlayerDialogProps {
  onClose: () => void;
  sendMessage: (type: string, subtype: string, content?: any) => void;
  players: string[];
}

export const DeletePlayerDialog: React.FC<DeletePlayerDialogProps> = ({
  players,
  onClose,
  sendMessage,
}) => {
  const handleSendMessage = (subtype: string, content?: any) => {
    sendMessage('delete_player', subtype, content);
    // // обновление списка игроков
    // sendMessage('delete_player', 'list');
    onClose();
  };

  const buttons = players
    .map((x) => {
      return {
        text: `Удалить игрока ${x}`,
        action: () => handleSendMessage('select', { player: x }),
      };
    })
    .concat([{ text: 'Удалить неактивных', action: () => handleSendMessage('idle') }]);

  return (
    <DialogForm header={'Удаление игроков'}>
      <ButtonsList buttons={buttons} alignment="center" direction="vertical" />
      <RejectButton handle={onClose} />
    </DialogForm>
  );
};
