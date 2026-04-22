import React from 'react';
import { StepProps, ConfirmData } from '../types';
import { ButtonsList } from '../../../ButtonsList';

export const ConfirmNewGame: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const handleConfirm = (confirm: boolean) => {
    onNext({ confirm } as ConfirmData);
    if (!confirm) {
      onCancel();
    }
  };
  const buttons = [
    {
      text: 'Создать новую',
      action: () => handleConfirm(true),
      // className="flex-1 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
    },
    {
      text: 'Отмена',
      action: () => handleConfirm(false),
      // className="flex-1 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
    },
  ];
  return <ButtonsList buttons={buttons} direction="horizontal" />;
};
