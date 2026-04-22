import React, { useState } from 'react';
import { StepProps, FinesData } from '../types';

export const Fines: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const [hasFines, setHasFines] = useState<boolean>(false);

  const handleSubmit = (value: boolean) => {
    setHasFines(value);
    onNext({ has_fines: value } as FinesData);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Есть ли штрафы в игре?</h3>
      <div className="space-y-2">
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            checked={hasFines === true}
            onChange={() => handleSubmit(true)}
            className="form-radio text-blue-600"
          />
          <span className="text-gray-300">Да</span>
        </label>
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            checked={hasFines === false}
            onChange={() => handleSubmit(false)}
            className="form-radio text-blue-600"
          />
          <span className="text-gray-300">Нет</span>
        </label>
      </div>
      <button
        onClick={onCancel}
        className="w-full rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
      >
        Отмена
      </button>
    </div>
  );
};