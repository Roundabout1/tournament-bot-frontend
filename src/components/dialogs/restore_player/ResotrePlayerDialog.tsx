import React, { useState } from 'react';
import { DialogForm } from '../DialogForm';
import { RejectButton } from '../RejectButton';
import { ButtonsList } from '../../ButtonsList';
import { ConfirmationForm } from '../ConfirmationForm';

interface RestorePlayerDialogProps {
  onClose: () => void;
  sendMessage: (type: string, subtype: string, content?: any) => void;
  players: string[];
}

export const RestorePlayerDialog: React.FC<RestorePlayerDialogProps> = ({
  players,
  onClose,
  sendMessage,
}) => {
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

  const handleSendMessage = (subtype: string, content?: any) => {
    sendMessage('restore_player', subtype, content);
    onClose();
  };

  const handleDeleteClick = (player: string) => {
    setConfirmTarget(player);
  };

  const handleConfirm = () => {
    if (confirmTarget) {
      handleSendMessage('select', { player: confirmTarget });
    }
    setConfirmTarget(null);
  };

  const handleCancel = () => {
    setConfirmTarget(null);
  };

  const buttons = players.map((x) => ({
    text: `Вернуть игрока ${x}`,
    action: () => handleDeleteClick(x),
  }));

  const render = () => {
    if (confirmTarget) {
      return (
        <DialogForm header={`Вы уверены, что хотите вернуть игрока ${confirmTarget}}?`}>
          <ConfirmationForm
            handleAccept={handleConfirm}
            acceptText="Да"
            handleReject={handleCancel}
            rejectText="Нет"
          />
        </DialogForm>
      );
    }
    return (
      <DialogForm header={'Возвращение игроков'}>
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
