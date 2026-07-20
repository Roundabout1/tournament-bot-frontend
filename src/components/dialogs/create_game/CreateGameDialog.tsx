import React, { useState, useEffect } from 'react';
import { CreateGameState, ShuffleType } from './types';
import { ConfirmNewGame } from './ConfirmNewGame';

interface CreateGameDialogProps {
  onClose: () => void;
  sendMessage: (type: string, subtype: string, content?: any) => void;
  confirmNewGame: (confirm: boolean, download: boolean) => void;
  currentStep: CreateGameState | null;
  serverError: string | null;
}

export const CreateGameDialog: React.FC<CreateGameDialogProps> = ({
  onClose,
  sendMessage,
  confirmNewGame,
  currentStep,
  serverError,
}) => {
  const [numPlayers, setNumPlayers] = useState<number | undefined>(4);
  const [shuffleType, setShuffleType] = useState<ShuffleType>(ShuffleType.Round);
  const [numTours, setNumTours] = useState<number>(2);
  const [suggestedTours, setSuggestedTours] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [groupSize, setGroupSize] = useState<number>(3);
  const [isAsymmetric, setIsAsymmetric] = useState<boolean>(false);
  const [hasFines, setHasFines] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isShuffleMulti = shuffleType === ShuffleType.MultiTournament;
  const isShuffleRound = shuffleType === ShuffleType.Round;
  const hasToursField = shuffleType === ShuffleType.Random || shuffleType === ShuffleType.Rating;

  // Получение делителей числа (для размера группы)
  const getDivisors = (num: number): number[] => {
    if (num < 3) {
      return [];
    }
    const divisors: number[] = [];
    const isEven = num % 2 === 0;
    for (let i = 3; i <= num / 2; i += isEven ? 1 : 2) {
      if (num % i === 0) {
        divisors.push(i);
      }
    }
    divisors.push(num);
    return divisors;
  };

  useEffect(() => {
    if (!serverError) {
      return;
    }
    setError(serverError);
  }, [serverError]);

  const getMaxTours = (players: number) => {
    return Math.floor(players / 2);
  };

  useEffect(() => {
    if (hasToursField) {
      if (numPlayers) {
        setSuggestedTours(getMaxTours(numPlayers));
      } else {
        setSuggestedTours(null);
      }
    }
  }, [shuffleType, numPlayers]);

  // Обновляем размер группы при изменении количества игроков
  useEffect(() => {
    if (isShuffleMulti) {
      if (numPlayers) {
        const divisors = getDivisors(numPlayers);
        if (divisors.length > 0) {
          setGroupSize(divisors[0]);
        }
      } else {
        setGroupSize(0);
      }
    }
  }, [numPlayers, isShuffleMulti]);

  const handleSubmit = () => {
    // Валидация
    if (!numPlayers) {
      setError('Укажите количество игроков');
      return;
    }
    if (numPlayers < 2) {
      setError('Минимальное количество игроков - 2');
      return;
    }

    if (isShuffleMulti) {
      const divisors = getDivisors(numPlayers);
      if (divisors.length === 0) {
        setError('Нет подходящего размера группы для данного количества игроков');
        return;
      }
      if (!divisors.includes(groupSize)) {
        setError('Выберите корректный размер группы');
        return;
      }
    }

    if (isShuffleRound && multiplier < 1) {
      setError('Множитель должен быть больше 0');
      return;
    }

    if (hasToursField && numTours > getMaxTours(numPlayers)) {
      setError(
        `В игре типа "${shuffleType}" количество турниров не должно превышать половину от количества игроков`,
      );
      return;
    }

    if (numTours < 1) {
      setError('Количество туров должно быть не менее 1');
      return;
    }

    // Отправляем все данные одной командой
    sendMessage('create_game', 'make', {
      num_players: numPlayers,
      shuffle: shuffleType,
      num_tours: hasToursField ? numTours : null,
      multiplier: isShuffleRound ? multiplier : null,
      size_group: isShuffleMulti ? groupSize : null,
      is_asymmetric: isAsymmetric,
      has_fines: hasFines,
    });
  };

  const handleCancel = () => {
    setError(null);
    sendMessage('create_game', 'cancel');
    onClose();
  };

  const renderConfirm = () => {
    return (
      <ConfirmNewGame
        onConfirm={(d) => confirmNewGame(true, d)}
        onCancel={() => confirmNewGame(false, false)}
      />
    );
  };

  const renderLoading = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center text-gray-300">Загрузка...</p>
        <button
          onClick={handleCancel}
          className="flex-1 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
        >
          Отмена
        </button>
      </div>
    );
  };

  const renderCreate = () => {
    const divisors = isShuffleMulti && numPlayers ? getDivisors(numPlayers) : [];
    const hasValidDivisors = divisors.length > 0;

    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-700 p-3 text-center">
          <h3 className="text-xl font-semibold text-blue-400">Создание игры</h3>
        </div>

        {/* Количество игроков */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">
            Количество игроков:
          </label>
          <input
            type="number"
            value={numPlayers}
            onChange={(e) => setNumPlayers(parseInt(e.target.value))}
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            required={true}
          />
        </div>

        {/* Тип жеребьёвки */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Тип жеребьёвки:</label>
          <select
            value={shuffleType}
            onChange={(e) => setShuffleType(e.target.value as ShuffleType)}
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          >
            {Object.entries(ShuffleType).map(([key, value]) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Количество туров*/}
        {hasToursField && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Количество туров:
            </label>
            <input
              type="number"
              value={numTours}
              onChange={(e) => setNumTours(parseInt(e.target.value))}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
            {suggestedTours && (
              <p className="mt-1 text-xs text-gray-400">
                Рекомендуемое количество: {suggestedTours}
              </p>
            )}
          </div>
        )}

        {/* Множитель туров (только для круговой) */}
        {isShuffleRound && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Множитель туров:</label>
            <input
              type="number"
              value={multiplier}
              onChange={(e) => setMultiplier(parseInt(e.target.value))}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">
              Количество туров = (количество игроков - 1) × множитель
            </p>
          </div>
        )}

        {/* Размер группы (только для мульти-турнира) */}
        {isShuffleMulti && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">
              Размер группы:
              {!hasValidDivisors && (
                <span className="ml-2 text-xs text-red-400">
                  (нет подходящих размеров для {numPlayers} игроков)
                </span>
              )}
            </label>
            <select
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value))}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              disabled={!hasValidDivisors}
            >
              {divisors.map((divisor) => (
                <option key={divisor} value={divisor}>
                  {divisor}
                </option>
              ))}
            </select>
            {hasValidDivisors && numPlayers && (
              <p className="mt-1 text-xs text-gray-400">
                Количество групп: {numPlayers / groupSize}
              </p>
            )}
          </div>
        )}

        {/* Асимметричная */}
        <div>
          <label className="flex cursor-pointer items-center space-x-3">
            <input
              type="checkbox"
              checked={isAsymmetric}
              onChange={(e) => setIsAsymmetric(e.target.checked)}
              className="form-checkbox h-4 w-4 rounded border-gray-500 bg-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Асимметричная игра</span>
          </label>
        </div>

        {/* Штрафы */}
        <div>
          <label className="flex cursor-pointer items-center space-x-3">
            <input
              type="checkbox"
              checked={hasFines}
              onChange={(e) => setHasFines(e.target.checked)}
              className="form-checkbox h-4 w-4 rounded border-gray-500 bg-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Штрафы</span>
          </label>
        </div>

        {error && <div className="rounded-lg bg-red-900/50 p-3 text-sm text-red-200">{error}</div>}

        {/* Кнопки */}
        <div className="flex gap-4 pt-2">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            Создать
          </button>
        </div>
      </div>
    );
  };

  const render = () => {
    switch (currentStep) {
      case 'start':
        return renderCreate();
      case 'confirm':
        return renderConfirm();
      case 'finish':
        onClose();
        return;
      default:
        renderLoading();
    }
  };

  if (currentStep === 'cancel') {
    onClose();
  }

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl">{render()}</div>
    </div>
  );
};
