import React, { useState } from 'react';
import { StepProps, ShuffleTypeData } from '../types';
import { DialogForm } from '../../DialogForm';
import { RejectButton } from '../../RejectButton';
import { ButtonsList } from '../../../ButtonsList';

const SHUFFLE_TYPES = ['Круговая', 'Рейтинговая', 'Случайная', 'Мульти-турнир'];

export const ShuffleType: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (shuffleType: string) => {
    if (!shuffleType) {
      setError('Выберите тип жеребьёвки');
      return;
    }
    setError(null);
    onNext({ shuffle: shuffleType } as ShuffleTypeData);
  };

  const buttons = SHUFFLE_TYPES.map((x) => {
    return { text: x, action: () => handleSubmit(x) };
  });

  return (
    <DialogForm header="Тип жеребьёвки">
      <ButtonsList buttons={buttons} direction="horizontal" />
      <RejectButton handle={onCancel} />
      {error && <div className="text-sm text-red-400">{error}</div>}
    </DialogForm>
  );
};
