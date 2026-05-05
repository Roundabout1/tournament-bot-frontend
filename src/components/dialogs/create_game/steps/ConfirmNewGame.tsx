import React from 'react';
import { StepProps, ConfirmData } from '../types';
import { DialogForm } from '../../DialogForm';
import { ConfirmationForm } from '../../ConfirmationForm';

export const ConfirmNewGame: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const handleConfirm = (confirm: boolean) => {
    onNext({ confirm } as ConfirmData);
    if (!confirm) {
      onCancel();
    }
  };

  return (
    <DialogForm header={'Создать новую игру?'}>
      <ConfirmationForm
        acceptText="Создать новую"
        handleAccept={() => handleConfirm(true)}
        rejectText="Отмена"
        handleReject={() => handleConfirm(false)}
      />
    </DialogForm>
  );
};
