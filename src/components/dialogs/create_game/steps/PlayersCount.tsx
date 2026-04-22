import React, { useState } from 'react';
import { StepProps, PlayersCountData } from '../types';

export const PlayersCount: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const [playersCount, setPlayersCount] = useState<number>(4);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (playersCount < 2) {
      setError('Минимальное количество игроков - 2');
      return;
    }
    if (playersCount > 32) {
      setError('Максимальное количество игроков - 32');
      return;
    }
    setError(null);
    onNext({ count: playersCount } as PlayersCountData);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Количество игроков</h3>
      <input
        type="number"
        min="2"
        max="32"
        value={playersCount}
        onChange={(e) => setPlayersCount(parseInt(e.target.value) || 2)}
        className="w-full rounded border border-gray-500 bg-gray-600 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
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