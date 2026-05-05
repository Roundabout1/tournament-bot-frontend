import React, { useState } from 'react';
import { CreateGameStep } from "./types";
import { ConfirmNewGame } from './steps/ConfirmNewGame';
import { PlayersCount } from './steps/PlayersCount';
import { ShuffleType } from './steps/ShuffleType';
import { GroupSize } from './steps/GroupSize';
import { Multiplier } from './steps/Multiplier';
import { ToursCount } from './steps/ToursCount';
import { Asymmetric } from './steps/Asymmetric';
import { Fines } from './steps/Fines';
import { GameFinish } from './steps/GameFinish';
import { Error } from './steps/Error';

interface CreateGameDialogProps {
  onClose: () => void;
  sendMessage: (type: string, subtype: string, content?: any) => void;
  currentStep: CreateGameStep | null;
  suggestedTours: number | null;
}

export const CreateGameDialog: React.FC<CreateGameDialogProps> = ({
  onClose,
  sendMessage,
  currentStep,
  suggestedTours,
}) => {
  // FIXME: no set?
  const [error] = useState<string | null>(null);

  const handleSendMessage = (subtype: string, content?: any) => {
    sendMessage('create_game', subtype, content);
  };

  const handleCancel = () => {
    handleSendMessage('cancel_create_game');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'confirm_new_game':
        return (
          <ConfirmNewGame
            onNext={(data) => handleSendMessage('confirm_new_game', data)}
            // FIXME: костыль, иначе придёт двойное сообщение об отмене с сервера
            onCancel={() => console.log('on cancel')}
          />
        );

      case 'entry_players_count':
        return (
          <PlayersCount
            onNext={(data) => handleSendMessage('player_count', data)}
            onCancel={handleCancel}
          />
        );

      case 'entry_shuffle_type':
        return (
          <ShuffleType
            onNext={(data) => handleSendMessage('shuffle_type', data)}
            onCancel={handleCancel}
          />
        );

      case 'set_multi_tour_group_size':
        return (
          <GroupSize
            onNext={(data) => handleSendMessage('set_multi_tour_group_size', data)}
            onCancel={handleCancel}
          />
        );

      case 'set_multiplier':
        return (
          <Multiplier
            onNext={(data) => handleSendMessage('set_multiplier', data)}
            onCancel={handleCancel}
          />
        );

      case 'entry_tours_count':
        return (
          <ToursCount
            onNext={(data) => handleSendMessage('tour_count', data)}
            onCancel={handleCancel}
            suggestedTours={suggestedTours ?? 3}
          />
        );

      case 'entry_is_asymmetric':
        return (
          <Asymmetric
            onNext={(data) => handleSendMessage('asymmetric', data)}
            onCancel={handleCancel}
          />
        );

      case 'entry_has_game_fine':
        return (
          <Fines onNext={(data) => handleSendMessage('fines', data)} onCancel={handleCancel} />
        );

      case 'create_game_finish':
        return <GameFinish onClose={onClose} />;

      case 'entry_error':
        return <Error onClose={onClose} />;

      case 'cancel_game_creation':
        onClose();
        return;

      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-300">Загрузка...</p>
          </div>
        );
    }
  };

  return (
    <div>
      {renderStep()}
      {error && <div className="mt-4 rounded bg-red-900 p-2 text-sm text-red-200">{error}</div>}
    </div>
  );
};
