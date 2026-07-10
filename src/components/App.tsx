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
    sessionStorage.setItem(MODE_STORAGE_KEY, selectedMode);
    setMode(selectedMode);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  if (mode === 'admin') {
    return <Control isAdmin={true} logout={handleLogout} />;
  }

  if (mode === 'judge') {
    return <Control isAdmin={false} logout={handleLogout} />;
  }

  if (mode === 'observer') {
    return <Observer logout={handleLogout} />;
  }

  return <ModeSelect onSelectMode={handleSelectMode} />;
};
