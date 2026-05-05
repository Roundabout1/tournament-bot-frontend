import React from 'react';

interface ErrorProps {
  onClose: () => void;
}

export const Error: React.FC<ErrorProps> = ({ onClose }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-red-500">Ошибка</h3>
      <p className="text-gray-300">Произошла ошибка при создании игры. Попробуйте снова.</p>
      <button
        onClick={onClose}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Закрыть
      </button>
    </div>
  );
};