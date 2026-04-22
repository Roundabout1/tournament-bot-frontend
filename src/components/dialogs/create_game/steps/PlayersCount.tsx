import React, { useState } from 'react';
import { StepProps, PlayersCountData } from '../types';
import { DigitInputForm } from '../../DigitInputForm';
import { DialogForm } from '../../DialogForm';
import { ConfirmationForm } from '../../ConfirmationForm';

export const PlayersCount: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const [playersCount, setPlayersCount] = useState<number>(4);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    // FIXME: это проверяется на сервере
    if (playersCount < 2) {
      setError('Минимальное количество игроков - 2');
      return;
    }
    setError(null);
    onNext({ count: playersCount } as PlayersCountData);
  };

  return (
    <DialogForm header="Количество игроков">
      <DigitInputForm value={playersCount} onChange={(v) => setPlayersCount(v)} />
      <ConfirmationForm
        handleAccept={handleSubmit}
        handleReject={onCancel}
      />
      {error && <div className="text-sm text-red-400">{error}</div>}
    </DialogForm>
  );
};
