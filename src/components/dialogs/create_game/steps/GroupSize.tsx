import React, { useState } from 'react';
import { StepProps, GroupSizeData } from '../types';

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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Размер группы</h3>
      <input
        type="number"
        min="2"
        value={groupSize}
        onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
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