import React, { useState } from 'react';
import { DialogForm } from '../DialogForm';
import { RejectButton } from '../RejectButton';
import { ButtonsList } from '../../ButtonsList';
import { ConfirmationForm } from '../ConfirmationForm';

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
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);
  const [isIdleDelete, setIsIdleDelete] = useState(false);

  const handleSendMessage = (subtype: string, content?: any) => {
    sendMessage('delete_player', subtype, content);
    onClose();
  };

  const handleDeleteClick = (player: string) => {
    setConfirmTarget(player);
    setIsIdleDelete(false);
  };

  const handleDeleteIdleClick = () => {
    setConfirmTarget('неактивных');
    setIsIdleDelete(true);
  };

  const handleConfirm = () => {
    if (isIdleDelete) {
      handleSendMessage('idle');
    } else if (confirmTarget) {
      handleSendMessage('select', { player: confirmTarget });
    }
    setConfirmTarget(null);
    setIsIdleDelete(false);
  };

  const handleCancel = () => {
    setConfirmTarget(null);
    setIsIdleDelete(false);
  };

  const buttons = players
    .map((x) => ({
      text: `Удалить игрока ${x}`,
      action: () => handleDeleteClick(x),
    }))
    .concat([
      {
        text: 'Удалить неактивных',
        action: handleDeleteIdleClick,
      },
    ]);

  const render = () => {
    if (confirmTarget) {
      return (
        <DialogForm header={`Вы уверены, что хотите удалить ${isIdleDelete ? 'всех неактивных игроков' : `игрока ${confirmTarget}`}?`}>
          <ConfirmationForm
            handleAccept={handleConfirm}
            acceptText='Да'
            handleReject={handleCancel}
            rejectText='Нет'
          />
        </DialogForm>
      );
    }
    return (
      <DialogForm header={'Удаление игроков'}>
        <ButtonsList buttons={buttons} alignment="center" direction="vertical" />
        <RejectButton handle={onClose} />
      </DialogForm>
    );
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl">{render()}</div>
    </div>
  );
};
