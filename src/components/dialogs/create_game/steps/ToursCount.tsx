import React, { useState } from 'react';
import { StepProps, ToursCountData } from '../types';
import { DigitInputForm } from '../../DigitInputForm';
import { DialogForm } from '../../DialogForm';
import { ConfirmationForm } from '../../ConfirmationForm';

interface ToursCountProps extends StepProps {
  suggestedTours?: number;
}

export const ToursCount: React.FC<ToursCountProps> = ({ onNext, onCancel, suggestedTours = 3 }) => {
  const [toursCount, setToursCount] = useState<number>(suggestedTours);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (toursCount < 1) {
      setError('Количество туров должно быть не менее 1');
      return;
    }
    setError(null);
    onNext({ count: toursCount } as ToursCountData);
  };

  return (
    <DialogForm header="Количество туров">
      <p className="text-sm text-gray-400">Рекомендуемое количество: {suggestedTours}</p>
      <DigitInputForm value={toursCount} onChange={(v) => setToursCount(v)} />
      <ConfirmationForm handleAccept={handleSubmit} handleReject={onCancel} />
      {error && <div className="text-sm text-red-400">{error}</div>}
    </DialogForm>
  );
};
