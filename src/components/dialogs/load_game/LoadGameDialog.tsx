import React, { useState } from 'react';
import { DialogForm } from '../DialogForm';
import { RejectButton } from '../RejectButton';
import { ButtonsList } from '../../ButtonsList';
import { ConfirmationForm } from '../ConfirmationForm';

interface LoadGameDialogProps {
  onClose: () => void;
  sendMessage: (type: string, subtype: string, content?: any) => void;
  players: string[];
}

export const LoadGameDialog: React.FC<LoadGameDialogProps> = ({
  players,
  onClose,
  sendMessage,
}) => {
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

  const handleSendMessage = (subtype: string, content?: any) => {
    sendMessage('load_game', subtype, content);
    onClose();
  };

  const handleLoadClick = (save: string) => {
    setConfirmTarget(save);
  };

  const handleConfirm = () => {
    if (confirmTarget) {
      handleSendMessage('load', { save: confirmTarget });
    }
    setConfirmTarget(null);
  };

  const handleCancel = () => {
    setConfirmTarget(null);
  };

  const buttons = players
    .map((x) => ({
      text: x,
      action: () => handleLoadClick(x),
    }));

  const render = () => {
    if (confirmTarget) {
      return (
        <DialogForm
          header={`Вы уверены, что хотите загрузить игру ${confirmTarget}?`}
        >
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
      <DialogForm header={'Загрузка игры'}>
        <ButtonsList buttons={buttons} alignment="center" direction="vertical" />
        <RejectButton handle={onClose} />
      </DialogForm>
    );
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-11/12 w-full max-w-md overflow-y-auto rounded-lg bg-gray-800 p-6 shadow-xl">
        {render()}
      </div>
    </div>
  );
};
