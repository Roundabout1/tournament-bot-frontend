import React from 'react';
import { StepProps, ConfirmData } from '../types';

export const ConfirmNewGame: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const handleConfirm = (confirm: boolean) => {
    onNext({ confirm } as ConfirmData);
    if (!confirm) {
      onCancel();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Создать новую игру?</h3>
      <div className="flex gap-4">
        <button
          onClick={() => handleConfirm(true)}
          className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Создать новую
        </button>
        <button
          onClick={() => handleConfirm(false)}
          className="flex-1 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          Отмена
        </button>
      </div>
    </div>
  );
};
