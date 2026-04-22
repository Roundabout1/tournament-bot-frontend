import React, { useState } from 'react';
import { CreateGameStep } from '../types/CreateGameStep';

interface CreateGameDialogProps {
  onClose: () => void;
  sendMessage: (type: string, subtype: string, content?: any) => void;
  currentStep: CreateGameStep | null;
}

export const CreateGameDialog: React.FC<CreateGameDialogProps> = ({
  onClose,
  sendMessage,
  currentStep,
}) => {
  const [playersCount, setPlayersCount] = useState<number>(4);
  const [shuffleType, setShuffleType] = useState<string>('');
  const [groupSize, setGroupSize] = useState<number>(2);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [toursCount, setToursCount] = useState<number>(3);
  const [isAsymmetric, setIsAsymmetric] = useState<boolean>(false);
  const [hasFines, setHasFines] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedTours] = useState<number>(3);

  const handleCancel = () => {
    sendMessage('create_game', 'cancel_create_game');
    onClose();
  };

  const handlePlayersCountSubmit = () => {
    if (playersCount < 2) {
      setError('Минимальное количество игроков - 2');
      return;
    }
    if (playersCount > 32) {
      setError('Максимальное количество игроков - 32');
      return;
    }
    setError(null);
    sendMessage('create_game', 'player_count', { count: playersCount });
  };

  const handleShuffleTypeSubmit = () => {
    if (!shuffleType) {
      setError('Выберите тип жеребьёвки');
      return;
    }
    setError(null);
    sendMessage('create_game', 'shuffle_type', { shuffle: shuffleType });
  };

  const handleGroupSizeSubmit = () => {
    if (groupSize < 2) {
      setError('Размер группы должен быть не менее 2');
      return;
    }
    setError(null);
    sendMessage('create_game', 'set_multi_tour_group_size', { count: groupSize });
  };

  const handleMultiplierSubmit = () => {
    if (multiplier < 1) {
      setError('Множитель должен быть больше 0');
      return;
    }
    setError(null);
    sendMessage('create_game', 'set_multiplier', { count: multiplier });
  };

  const handleToursCountSubmit = () => {
    if (toursCount < 1) {
      setError('Количество туров должно быть не менее 1');
      return;
    }
    setError(null);
    sendMessage('create_game', 'tour_count', { count: toursCount });
  };

  const handleAsymmetricSubmit = (value: boolean) => {
    setIsAsymmetric(value);
    sendMessage('create_game', 'asymmetric', { is_asymmetric: value });
  };

  const handleFinesSubmit = (value: boolean) => {
    setHasFines(value);
    sendMessage('create_game', 'fines', { has_fines: value });
  };

  const handleConfirmNewGame = (confirm: boolean) => {
    sendMessage('create_game', 'confirm_new_game', { confirm });
    if (!confirm) {
      onClose();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'confirm_new_game':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Подтверждение</h3>
            <p className="text-gray-300">Игра уже существует. Создать новую?</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleConfirmNewGame(true)}
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Да, создать новую
              </button>
              <button
                onClick={() => handleConfirmNewGame(false)}
                className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Отмена
              </button>
            </div>
          </div>
        );

      case 'entry_players_count':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Количество игроков</h3>
            <input
              type="number"
              min="2"
              max="32"
              value={playersCount}
              onChange={(e) => setPlayersCount(parseInt(e.target.value) || 2)}
              className="w-full rounded border border-gray-500 bg-gray-600 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
            <div className="flex gap-4">
              <button
                onClick={handlePlayersCountSubmit}
                className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Далее
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Отмена
              </button>
            </div>
          </div>
        );

      case 'entry_shuffle_type':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Тип жеребьёвки</h3>
            <div className="space-y-2">
              {['Круговая', 'Рейтинговая', 'Случайная', 'Мульти-турнир'].map((type) => (
                <label key={type} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value={type}
                    checked={shuffleType === type}
                    onChange={(e) => setShuffleType(e.target.value)}
                    className="form-radio text-blue-600"
                  />
                  <span className="text-gray-300">{type}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleShuffleTypeSubmit}
                className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Далее
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Отмена
              </button>
            </div>
          </div>
        );

      case 'set_multi_tour_group_size':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Размер группы</h3>
            <input
              type="number"
              min="2"
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
              className="w-full rounded border border-gray-500 bg-gray-600 px-3 py-2 text-white"
            />
            <div className="flex gap-4">
              <button
                onClick={handleGroupSizeSubmit}
                className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Далее
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Отмена
              </button>
            </div>
          </div>
        );

      case 'set_multiplier':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Множитель туров</h3>
            <p className="text-sm text-gray-400">
              Количество туров = (количество игроков - 1) × множитель
            </p>
            <input
              type="number"
              min="1"
              value={multiplier}
              onChange={(e) => setMultiplier(parseInt(e.target.value) || 1)}
              className="w-full rounded border border-gray-500 bg-gray-600 px-3 py-2 text-white"
            />
            <div className="flex gap-4">
              <button
                onClick={handleMultiplierSubmit}
                className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Далее
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Отмена
              </button>
            </div>
          </div>
        );

      case 'entry_tours_count':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Количество туров</h3>
            <p className="text-sm text-gray-400">Рекомендуемое количество: {suggestedTours}</p>
            <input
              type="number"
              min="1"
              value={toursCount}
              onChange={(e) => setToursCount(parseInt(e.target.value) || 1)}
              className="w-full rounded border border-gray-500 bg-gray-600 px-3 py-2 text-white"
            />
            <div className="flex gap-4">
              <button
                onClick={handleToursCountSubmit}
                className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Далее
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
              >
                Отмена
              </button>
            </div>
          </div>
        );

      case 'entry_is_asymmetric':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Асимметричная игра?</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={isAsymmetric === true}
                  onChange={() => handleAsymmetricSubmit(true)}
                  className="form-radio text-blue-600"
                />
                <span className="text-gray-300">Да</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={isAsymmetric === false}
                  onChange={() => handleAsymmetricSubmit(false)}
                  className="form-radio text-blue-600"
                />
                <span className="text-gray-300">Нет</span>
              </label>
            </div>
          </div>
        );

      case 'entry_has_game_fine':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">Есть ли штрафы в игре?</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={hasFines === true}
                  onChange={() => handleFinesSubmit(true)}
                  className="form-radio text-blue-600"
                />
                <span className="text-gray-300">Да</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={hasFines === false}
                  onChange={() => handleFinesSubmit(false)}
                  className="form-radio text-blue-600"
                />
                <span className="text-gray-300">Нет</span>
              </label>
            </div>
          </div>
        );

      case 'create_game_finish':
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

      case 'entry_error':
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

      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-300">Загрузка...</p>
          </div>
        );
    }
  };

  return (
    <div className="w-96 max-w-full rounded-lg bg-gray-800 p-6">
      {renderStep()}
      {error && <div className="mt-4 rounded bg-red-900 p-2 text-sm text-red-200">{error}</div>}
    </div>
  );
};
