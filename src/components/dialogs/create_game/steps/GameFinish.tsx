import React from 'react';

interface GameFinishProps {
  onClose: () => void;
}

export const GameFinish: React.FC<GameFinishProps> = ({ onClose }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-green-500">✓ Игра успешно создана!</h3>
      <button
        onClick={onClose}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Закрыть
      </button>
    </div>
  );
};