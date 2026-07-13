import React, { useState } from 'react';
import { DialogForm } from '../DialogForm';
import { ConfirmationForm } from '../ConfirmationForm';

interface ConfirmNewGameProps {
  onConfirm: (download: boolean) => void;
  onCancel: () => void;
}

export const ConfirmNewGame: React.FC<ConfirmNewGameProps> = ({ onConfirm, onCancel }) => {
  const [confirmNewGame, setConfirmNewGame] = useState<boolean>(false);

  const handleConfirm = (confirm: boolean, download: boolean) => {
    if (!confirm) {
      onCancel();
      return;
    }
    onConfirm(download);
  };

  const render = () => {
    if (confirmNewGame) {
      return (
        <DialogForm header={`Вы хотите сохранить таблицы с результатами завершённой игры?`}>
          <ConfirmationForm
            handleAccept={() => handleConfirm(true, true)}
            acceptText="Да"
            handleReject={() => handleConfirm(true, false)}
            rejectText="Нет"
          />
        </DialogForm>
      );
    }
    return (
      <DialogForm header={'Создать новую игру?'}>
        <ConfirmationForm
          acceptText="Создать новую"
          handleAccept={() => setConfirmNewGame(true)}
          rejectText="Отмена"
          handleReject={() => handleConfirm(false, false)}
        />
      </DialogForm>
    );
  };

  return render();
};
