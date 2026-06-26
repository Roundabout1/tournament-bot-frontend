import React from 'react';
import { StepProps, AsymmetricData } from '../types';
import { DialogForm } from '../../DialogForm';
import { RejectButton } from '../../RejectButton';
import { ButtonsList } from '../../../ButtonsList';

export const Asymmetric: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const handleSubmit = (value: boolean) => {
    onNext({ is_asymmetric: value } as AsymmetricData);
  };

  const buttons = [
    {
      text: 'Нет',
      action: () => handleSubmit(false),
    },
    {
      text: 'Да',
      action: () => handleSubmit(true),
    },
  ];

  return (
    <DialogForm header="Асимметричная игра?">
      <ButtonsList buttons={buttons} direction="horizontal" />
      <RejectButton handle={onCancel} />
    </DialogForm>
  );
};
