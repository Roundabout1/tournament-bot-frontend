import React, { useState } from 'react';
import { StepProps, GroupSizeData } from '../types';
import { DigitInputForm } from '../../DigitInputForm';
import { DialogForm } from '../../DialogForm';
import { ConfirmationForm } from '../../ConfirmationForm';

export const GroupSize: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const [groupSize, setGroupSize] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (groupSize < 2) {
      setError('Размер группы должен быть не менее 2');
      return;
    }
    setError(null);
    onNext({ count: groupSize } as GroupSizeData);
  };

  return (
    <DialogForm header="Размер группы">
      <DigitInputForm value={groupSize} onChange={(v) => setGroupSize(v)} />
      <ConfirmationForm handleAccept={handleSubmit} handleReject={onCancel} />
      {error && <div className="text-sm text-red-400">{error}</div>}
    </DialogForm>
  );
};
