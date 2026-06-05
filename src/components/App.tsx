import { useState } from 'react';
import { Control } from './Control';
import { Observer } from './Observer';
import { ModeSelect } from './ModeSelect';
import { AppMode } from '../types/Modes';
import { Auth } from './Auth';

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
    return (
      <Auth>
        <Control isAdmin={true} />
      </Auth>
    );
  }

  if (mode === 'judge') {
    return (
      <Auth>
        <Control isAdmin={false} />
      </Auth>
    );
  }

  if (mode === 'observer') {
    return <Observer />;
  }

  return <ModeSelect onSelectMode={handleSelectMode} />;
};
