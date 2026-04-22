import React, { useState } from 'react';
import { StepProps, ShuffleTypeData } from '../types';

const SHUFFLE_TYPES = ['Круговая', 'Рейтинговая', 'Случайная', 'Мульти-турнир'];

export const ShuffleType: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const [shuffleType, setShuffleType] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!shuffleType) {
      setError('Выберите тип жеребьёвки');
      return;
    }
    setError(null);
    onNext({ shuffle: shuffleType } as ShuffleTypeData);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Тип жеребьёвки</h3>
      <div className="space-y-2">
        {SHUFFLE_TYPES.map((type) => (
          <label key={type} className="flex items-center space-x-3">
            <input
              type="radio"
              value={type}
              checked={shuffleType === type}
              onChange={(e) => setShuffleType(e.target.value)}
              className="form-radio text-blue-600"
            />
            <span className="text-gray-300">{type}</span>
          </label>
        ))}
      </div>
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