import React, { useState } from 'react';
import { DialogForm } from '../DialogForm';
import { ConfirmationForm } from '../ConfirmationForm';

interface ConfirmNewGameProps {
  onConfirm: (download: boolean) => void;
  onCancel: () => void;
}

export const ConfirmNewGame: React.FC<ConfirmNewGameProps> = ({ onConfirm, onCancel }) => {
  const [confirmDownload, setConfirmDownload] = useState<boolean>(true);

  const handleConfirm = (confirm: boolean, download: boolean) => {
    if (!confirm) {
      onCancel();
      return;
    }
    onConfirm(download);
  };

  return (
    <DialogForm header={'Создать новую игру?'}>
      <ConfirmationForm
        acceptText="Создать новую"
        handleAccept={() => handleConfirm(true, confirmDownload)}
        rejectText="Отмена"
        handleReject={() => handleConfirm(false, false)}
      />
      <label className="flex cursor-pointer items-center space-x-3">
        <input
          type="checkbox"
          checked={confirmDownload}
          onChange={(e) => setConfirmDownload(e.target.checked)}
          className="form-checkbox h-4 w-4 rounded border-gray-500 bg-gray-600 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-300">
          Сохранить таблицы с результатами завершённой игры
        </span>
      </label>
    </DialogForm>
  );
};
