import React, { useState } from 'react';
import { StepProps, ToursCountData } from '../types';

interface ToursCountProps extends StepProps {
  suggestedTours?: number;
}

export const ToursCount: React.FC<ToursCountProps> = ({ 
  onNext, 
  onCancel, 
  suggestedTours = 3 
}) => {
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Количество туров</h3>
      <p className="text-sm text-gray-400">Рекомендуемое количество: {suggestedTours}</p>
      <input
        type="number"
        min="1"
        value={toursCount}
        onChange={(e) => setToursCount(parseInt(e.target.value) || 1)}
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