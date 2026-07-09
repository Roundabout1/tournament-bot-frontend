import { useEffect, useState } from 'react';
import { Observer } from './Observer';
import { ModeSelect } from './ModeSelect';
import { AppMode } from '../types/Modes';
import { Control } from './Control';
import { MODE_STORAGE_KEY } from '../consts/StorageKeys';

export const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('select');

  useEffect(() => {
    const savedMode = sessionStorage.getItem(MODE_STORAGE_KEY) as AppMode;
    setMode(savedMode);
  }, []);

  const handleSelectMode = (selectedMode: AppMode) => {
    sessionStorage.setItem('app_mode', selectedMode);
    setMode(selectedMode);
  };

  if (mode === 'admin') {
    return <Control isAdmin={true} />;
  }

  if (mode === 'judge') {
    return <Control isAdmin={false} />;
  }

  if (mode === 'observer') {
    return <Observer />;
  }

  return <ModeSelect onSelectMode={handleSelectMode} />;
};
