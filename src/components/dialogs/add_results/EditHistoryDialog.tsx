// TODO: реализовать общий компонент для AddResults и EditHistory
import React, { useEffect, useState } from 'react';
import { ResultState, Table } from './GameResult';

interface EditHistoryDialogProps {
  onClose: () => void;
  sendMessage: (type: string, subtype: string, content?: any) => void;
  step?: string;
  entries?: Array<Array<Table>>;
  recordInfo?: {
    table: string;
    player1: string;
    player2: string;
    tour: number;
    hasFines?: boolean;
  } | null;
  externalError: string | null;
}
const operation_type = 'edit_history';

export const EditHistoryDialog: React.FC<EditHistoryDialogProps> = ({
  onClose,
  sendMessage,
  step,
  entries = [],
  recordInfo = null,
  externalError,
}) => {
  const [selectedTour, setSelectedTour] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [resultState, setResultState] = useState<ResultState>('completed');
  const [winner, setWinner] = useState<string>('');
  const [hasFines1, setHasFines1] = useState<boolean>(false);
  const [hasFines2, setHasFines2] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  useEffect(() => {
    setError(externalError);
  }, [externalError]);

  // Отдельный эффект для обработки завершения
  useEffect(() => {
    if (step === 'finish' && !hasFinished) {
      setHasFinished(true);
      handleClose();
    }
  }, [step]);

  const handleSelectEntry = () => {
    if (selectedTour === null) {
      setError('Выберите тур');
      return;
    }
    if (!selectedTable) {
      setError('Выберите стол');
      return;
    }
    setError(null);
    sendMessage(operation_type, 'select_entry', {
      tour: selectedTour,
      table: selectedTable,
    });
  };

  const handleSubmitResult = () => {
    if (resultState === 'completed' && !winner) {
      setError('Выберите победителя');
      return;
    }

    const player1 = recordInfo?.player1;
    const player2 = recordInfo?.player2;

    if (!player1 || !player2) {
      setError('Ошибка: данные игроков не найдены');
      return;
    }

    const content: any = {
      state: resultState,
      player1: player1,
      player2: player2,
      has_fines1: hasFines1,
      has_fines2: hasFines2,
    };

    if (resultState === 'completed') {
      content.winner = winner;
    }

    sendMessage(operation_type, 'set_status', content);
    handleClose();
  };

  const handleClose = () => {
    setSelectedTour(null);
    setSelectedTable('');
    setWinner('');
    setResultState('completed');
    setHasFines1(false);
    setHasFines2(false);
    setError(null);
    setHasFinished(false);
    onClose();
  };

  const handleCancel = () => {
    sendMessage(operation_type, 'cancel');
    handleClose();
  };

  const renderLoad = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
      <p className="text-center text-gray-300">Загрузка списка записей...</p>
      <button
        onClick={handleCancel}
        className="w-full rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
      >
        Отмена
      </button>
    </div>
  );

  const renderSelectEntryStep = () => {
    // Группируем записи по турам
    const toursData = entries.map((tourEntries, tourIndex) => ({
      tourNumber: tourIndex + 1,
      entries: tourEntries,
    }));

    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-700 p-4 text-center">
          <h3 className="text-xl font-semibold text-blue-400">Редактирование истории</h3>
          <p className="mt-1 text-sm text-gray-400">Выберите тур и стол для редактирования</p>
        </div>

        {/* Выбор тура */}
        <div>
          <h4 className="text-md mb-2 font-medium text-gray-300">Выберите тур:</h4>
          <div className="flex flex-wrap gap-2">
            {toursData.map((tour) => (
              <button
                key={tour.tourNumber}
                onClick={() => {
                  setSelectedTour(tour.tourNumber);
                  setSelectedTable('');
                }}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  selectedTour === tour.tourNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Тур {tour.tourNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Выбор стола (отображается только если выбран тур) */}
        {selectedTour !== null && (
          <div>
            <h4 className="text-md mb-2 font-medium text-gray-300">
              Тур {selectedTour}: выберите стол:
            </h4>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {toursData[selectedTour - 1]?.entries.map((entry, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedTable(entry.number)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
                    selectedTable === entry.number
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                >
                  <span className="text-lg font-medium">Стол №{entry.number}</span>
                  <span className="text-sm opacity-75">
                    {entry.players[0].number} vs {entry.players[1].number}
                  </span>
                </div>
              ))}
            </div>
            {toursData[selectedTour - 1]?.entries.length === 0 && (
              <p className="text-center text-gray-400">
                В этом туре нет записей для редактирования
              </p>
            )}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
          >
            Отмена
          </button>
          <button
            onClick={handleSelectEntry}
            disabled={!selectedTable}
            className={`flex-1 rounded-lg px-4 py-2 font-medium text-white transition-colors ${
              selectedTable ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-gray-600'
            }`}
          >
            Далее
          </button>
        </div>
      </div>
    );
  };

  const renderEditResultStep = () => (
    <div className="space-y-4">
      {/* Информация о столе */}
      <div className="rounded-lg bg-gray-700 p-4 text-center">
        <h3 className="text-xl font-semibold text-blue-400">
          Тур {recordInfo?.tour}, Стол №{recordInfo?.table}
        </h3>
        <p className="mt-1 text-sm text-gray-300">
          Игроки: <strong>{recordInfo?.player1}</strong> vs <strong>{recordInfo?.player2}</strong>
        </p>
      </div>

      {/* Выбор победителя / результата */}
      <h4 className="text-md font-medium text-gray-300">Выберите результат:</h4>
      <div className="space-y-2">
        {/* Игрок 1 */}
        <div
          onClick={() => {
            setWinner(recordInfo?.player1 || '');
            setResultState('completed');
          }}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
            winner === recordInfo?.player1 && resultState === 'completed'
              ? 'border-blue-500 bg-blue-600 text-white'
              : 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          <span className="text-xl font-bold">#{recordInfo?.player1}</span>
        </div>

        {/* Игрок 2 */}
        <div
          onClick={() => {
            setWinner(recordInfo?.player2 || '');
            setResultState('completed');
          }}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
            winner === recordInfo?.player2 && resultState === 'completed'
              ? 'border-blue-500 bg-blue-600 text-white'
              : 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          <span className="text-xl font-bold">#{recordInfo?.player2}</span>
        </div>

        {/* Ничья */}
        <div
          onClick={() => {
            setWinner('');
            setResultState('draw');
          }}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
            resultState === 'draw'
              ? 'border-blue-500 bg-blue-600 text-white'
              : 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          <span className="text-md">🤝 Ничья</span>
        </div>

        {/* Недоиграно */}
        <div
          onClick={() => {
            setWinner('');
            setResultState('underplayed');
          }}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
            resultState === 'underplayed'
              ? 'border-blue-500 bg-blue-600 text-white'
              : 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          <span className="text-md">⏸️ Недоиграно</span>
        </div>
      </div>

      {/* Штрафы */}
      {recordInfo?.hasFines && (
        <div className="mt-4 space-y-2 rounded-lg bg-gray-700/50 p-3">
          <h5 className="text-sm font-semibold text-gray-300">Штрафы</h5>
          <label className="flex cursor-pointer items-center space-x-3">
            <input
              type="checkbox"
              checked={hasFines1}
              onChange={(e) => setHasFines1(e.target.checked)}
              className="form-checkbox h-4 w-4 rounded border-gray-500 bg-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Штраф игроку #{recordInfo?.player1}</span>
          </label>
          <label className="flex cursor-pointer items-center space-x-3">
            <input
              type="checkbox"
              checked={hasFines2}
              onChange={(e) => setHasFines2(e.target.checked)}
              className="form-checkbox h-4 w-4 rounded border-gray-500 bg-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Штраф игроку #{recordInfo?.player2}</span>
          </label>
        </div>
      )}

      {/* Кнопки действий */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={handleCancel}
          className="flex-1 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
        >
          Отмена
        </button>
        <button
          onClick={handleSubmitResult}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Сохранить изменения
        </button>
      </div>
    </div>
  );

  const renderNoRecordsStep = () => (
    <div className="space-y-4">
      <div className="rounded-lg bg-yellow-600/20 p-4 text-center">
        <h3 className="text-xl font-semibold text-yellow-400">Нет записей</h3>
        <p className="mt-1 text-gray-300">Нет результатов для редактирования</p>
      </div>
      <button
        onClick={handleCancel}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
      >
        Закрыть
      </button>
    </div>
  );

  // Определяем, какой шаг рендерить
  const renderStepContent = () => {
    if (step === 'start' && entries.length === 0) {
      // Если нет записей для редактирования
      if (entries.length === 0) {
        return renderNoRecordsStep();
      }
      return renderLoad();
    }
    switch (step) {
      case 'start':
        return renderSelectEntryStep();
      case 'entry_player_result':
        return renderEditResultStep();
      case 'no_records':
        return renderNoRecordsStep();
      default:
        return renderLoad();
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl">
        {renderStepContent()}
        {error && (
          <div className="mt-4 rounded-lg bg-red-900/50 p-3 text-sm text-red-200">{error}</div>
        )}
      </div>
    </div>
  );
};
