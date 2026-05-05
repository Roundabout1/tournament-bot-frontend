import React, { useState } from 'react';
import { StepProps, MultiplierData } from '../types';
import { DigitInputForm } from '../../DigitInputForm';
import { DialogForm } from '../../DialogForm';
import { ConfirmationForm } from '../../ConfirmationForm';

export const Multiplier: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const [multiplier, setMultiplier] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (multiplier < 0) {
      setError('Множитель должен быть больше 0');
      return;
    }
    setError(null);
    onNext({ count: multiplier } as MultiplierData);
  };

  return (
    <DialogForm header="Множитель туров">
      <p className="text-sm text-gray-400">
        Количество туров = (количество игроков - 1) × множитель
      </p>
      <DigitInputForm value={multiplier} onChange={(v) => setMultiplier(v)} />
      <ConfirmationForm handleAccept={handleSubmit} handleReject={onCancel} />
      {error && <div className="text-sm text-red-400">{error}</div>}
    </DialogForm>
  );
};
