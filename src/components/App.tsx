// App.tsx (упрощённая версия)
import { useState } from 'react';
import { Main } from './Main';
import { Observer } from './Observer';
import { ModeSelect } from './ModeSelect';

type AppMode = 'select' | 'judge' | 'observer';

export const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('select');

  const handleSelectMode = (selectedMode: 'judge' | 'observer') => {
    setMode(selectedMode);
  };

  if (mode === 'judge') {
    return <Main />;
  }

  if (mode === 'observer') {
    return <Observer />;
  }

  return <ModeSelect onSelectMode={handleSelectMode} />;
};