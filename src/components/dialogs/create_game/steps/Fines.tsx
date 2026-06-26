import React from 'react';
import { StepProps, FinesData } from '../types';
import { DialogForm } from '../../DialogForm';
import { RejectButton } from '../../RejectButton';
import { ButtonsList } from '../../../ButtonsList';

export const Fines: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const handleSubmit = (value: boolean) => {
    onNext({ has_fines: value } as FinesData);
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
    <DialogForm header="Есть ли штрафы в игре?">
      <ButtonsList buttons={buttons} direction="horizontal" />
      <RejectButton handle={onCancel} />
    </DialogForm>
  );
};
