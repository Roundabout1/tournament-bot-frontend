import { useState } from 'react';
import { Control } from './Control';
import { Observer } from './Observer';
import { ModeSelect } from './ModeSelect';
import { AppMode } from '../types/Modes';

export const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('select');

  // useEffect(() => {
  //   //const savedMode = sessionStorage.getItem('app_mode') as AppMode;
  //   if (savedMode === 'control' || savedMode === 'observer') {
  //     setMode(savedMode);
  //   }
  // }, []);

  const handleSelectMode = (selectedMode: AppMode) => {
    //sessionStorage.setItem('app_mode', selectedMode);
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
