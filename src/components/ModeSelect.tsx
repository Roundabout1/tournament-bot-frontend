import React from 'react';
import { Title } from './Title';

interface ModeSelectProps {
  onSelectMode: (mode: 'control' | 'observer') => void;
}

export const ModeSelect: React.FC<ModeSelectProps> = ({ onSelectMode }) => {
  return (
    <div className="flex h-[100vh] w-[100wh] flex-col items-center justify-center bg-gray-800">
      <div className="mb-12">
        <Title />
      </div>

      <div className="w-80 space-y-4">
        <button
          onClick={() => onSelectMode('control')}
          className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
        >
          👨‍⚖️ Судья / Администратор
        </button>

        <button
          onClick={() => onSelectMode('observer')}
          className="w-full rounded-lg bg-green-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-green-700"
        >
          🔭 Наблюдатель
        </button>
      </div>
    </div>
  );
};
