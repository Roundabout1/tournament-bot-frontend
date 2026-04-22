import React, { useState } from 'react';
import { StepProps, AsymmetricData } from '../types';

export const Asymmetric: React.FC<StepProps> = ({ onNext, onCancel }) => {
  const [isAsymmetric, setIsAsymmetric] = useState<boolean>(false);

  const handleSubmit = (value: boolean) => {
    setIsAsymmetric(value);
    onNext({ is_asymmetric: value } as AsymmetricData);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Асимметричная игра?</h3>
      <div className="space-y-2">
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            checked={isAsymmetric === true}
            onChange={() => handleSubmit(true)}
            className="form-radio text-blue-600"
          />
          <span className="text-gray-300">Да</span>
        </label>
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            checked={isAsymmetric === false}
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