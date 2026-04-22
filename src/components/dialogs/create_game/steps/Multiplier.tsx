import React, { useState } from 'react';
import { StepProps, MultiplierData } from '../types';

export const Multiplier: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const [multiplier, setMultiplier] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (multiplier < 1) {
      setError('Множитель должен быть больше 0');
      return;
    }
    setError(null);
    onNext({ count: multiplier } as MultiplierData);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Множитель туров</h3>
      <p className="text-sm text-gray-400">
        Количество туров = (количество игроков - 1) × множитель
      </p>
      <input
        type="number"
        min="1"
        value={multiplier}
        onChange={(e) => setMultiplier(parseInt(e.target.value) || 1)}
        className="w-full rounded border border-gray-500 bg-gray-600 px-3 py-2 text-white"
      />
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Далее
        </button>
        <button
          onClick={onCancel}
          className="flex-1 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
        >
          Отмена
        </button>
      </div>
      {error && <div className="text-sm text-red-400">{error}</div>}
    </div>
  );
};