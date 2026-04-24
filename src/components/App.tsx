import { useState, useEffect } from 'react';
import { Main } from './Main';
import { Observer } from './Observer';
import { ModeSelect } from './ModeSelect';

type AppMode = 'select' | 'judge' | 'observer';

export const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('select');

  useEffect(() => {
    const savedMode = sessionStorage.getItem('app_mode') as AppMode;
    if (savedMode === 'judge' || savedMode === 'observer') {
      setMode(savedMode);
    }
  }, []);

  const handleSelectMode = (selectedMode: 'judge' | 'observer') => {
    sessionStorage.setItem('app_mode', selectedMode);
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