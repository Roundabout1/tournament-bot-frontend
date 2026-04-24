import React, { useEffect, useState } from 'react';
import { ResultState } from './GameResult';

interface AddResultsDialogProps {
  onClose: () => void;
  sendMessage: (type: string, subtype: string, content?: any) => void;
  step?: string;
  tables?: string[];
  tableInfo?: {
    table: string;
    player1: string;
    player2: string;
    hasFines: boolean;
  } | null;
  extrenalError: string | null;
}

export const AddResultsDialog: React.FC<AddResultsDialogProps> = ({
  onClose,
  sendMessage,
  step,
  tables = [],
  tableInfo = null,
  extrenalError,
}) => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [resultState, setResultState] = useState<ResultState>('completed');
  const [winner, setWinner] = useState<string>('');
  const [hasFines1, setHasFines1] = useState<boolean>(false);
  const [hasFines2, setHasFines2] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(extrenalError);
  }, [extrenalError]);

  const handleSelectTable = () => {
    if (!selectedTable) {
      setError('Выберите стол');
      return;
    }
    setError(null);
    sendMessage('add_results', 'select_table', { table: selectedTable });
  };

  const handleSubmitResult = () => {
    if (resultState === 'completed' && !winner) {
      setError('Выберите победителя');
      return;
    }

    const player1 = tableInfo?.player1;
    const player2 = tableInfo?.player2;

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

    sendMessage('add_results', 'set_status_handler', content);
    handleClose();
  };

  const handleClose = () => {
    setSelectedTable('');
    setWinner('');
    setResultState('completed');
    setHasFines1(false);
    setHasFines2(false);
    setError(null);
    onClose();
  };

  const handleCancel = () => {
    sendMessage('add_results', 'cancel');
  };

  const renderLoad = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
      <p className="text-center text-gray-300">Загрузка списка столов...</p>
      <button
        onClick={handleCancel}
        className="flex-1 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
      >
        Отмена
      </button>
    </div>
  );

  const renderSelectTableStep = () => (
    <div className="space-y-4">
      <div className="rounded-lg bg-gray-700 p-4 text-center">
        <h3 className="text-xl font-semibold text-blue-400">Ввод результатов</h3>
      </div>
      <h4 className="text-md font-medium text-gray-300">Выберите стол:</h4>
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {tables.map((table) => (
          <div
            key={table}
            onClick={() => setSelectedTable(table)}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
              selectedTable === table
                ? 'border-blue-500 bg-blue-600 text-white'
                : 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
          >
            <span className="text-lg font-medium">Стол №{table}</span>
          </div>
        ))}
      </div>
      {tables.length === 0 && <p className="text-center text-gray-400">Нет доступных столов</p>}
      <div className="flex gap-4 pt-4">
        <button
          onClick={handleSelectTable}
          disabled={!selectedTable}
          className={`flex-1 rounded-lg px-4 py-2 font-medium text-white transition-colors ${
            selectedTable ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-gray-600'
          }`}
        >
          Далее
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
        >
          Отмена
        </button>
      </div>
    </div>
  );

  const renderEnterResultStep = () => (
    <div className="space-y-4">
      {/* Информация о столе */}
      <div className="rounded-lg bg-gray-700 p-4 text-center">
        <h3 className="text-xl font-semibold text-blue-400">Стол №{tableInfo?.table}</h3>
      </div>

      {/* Выбор победителя / результата */}
      <h4 className="text-md font-medium text-gray-300">Выберите победителя:</h4>
      <div className="space-y-2">
        {/* Игрок 1 */}
        <div
          onClick={() => {
            setWinner(tableInfo?.player1 || '');
            setResultState('completed');
          }}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
            winner === tableInfo?.player1 && resultState === 'completed'
              ? 'border-blue-500 bg-blue-600 text-white'
              : 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          <span className="text-xl font-bold">#{tableInfo?.player1}</span>
        </div>

        {/* Игрок 2 */}
        <div
          onClick={() => {
            setWinner(tableInfo?.player2 || '');
            setResultState('completed');
          }}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
            winner === tableInfo?.player2 && resultState === 'completed'
              ? 'border-blue-500 bg-blue-600 text-white'
              : 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          <span className="text-xl font-bold">#{tableInfo?.player2}</span>
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

      {/* Штрафы (только если игра их поддерживает) */}
      {tableInfo?.hasFines && (
        <div className="mt-4 space-y-2 rounded-lg bg-gray-700/50 p-3">
          <h5 className="text-sm font-semibold text-gray-300">Штрафы</h5>
          <label className="flex cursor-pointer items-center space-x-3">
            <input
              type="checkbox"
              checked={hasFines1}
              onChange={(e) => setHasFines1(e.target.checked)}
              className="form-checkbox h-4 w-4 rounded border-gray-500 bg-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Штраф игроку #{tableInfo?.player1}</span>
          </label>
          <label className="flex cursor-pointer items-center space-x-3">
            <input
              type="checkbox"
              checked={hasFines2}
              onChange={(e) => setHasFines2(e.target.checked)}
              className="form-checkbox h-4 w-4 rounded border-gray-500 bg-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Штраф игроку #{tableInfo?.player2}</span>
          </label>
        </div>
      )}

      {/* Кнопки действий */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={handleSubmitResult}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Отправить результат
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
        >
          Отмена
        </button>
      </div>
    </div>
  );

  const renderStep = () => {
    if (step === 'start' && tables.length === 0) {
      return renderLoad();
    }
    switch (step) {
      case 'start':
        return renderSelectTableStep();
      case 'entry_player_result':
        return renderEnterResultStep();
      case 'finish':
        handleClose();
        return null;
      default:
        return renderLoad();
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl">
        {renderStep()}
        {error && (
          <div className="mt-4 rounded-lg bg-red-900/50 p-3 text-sm text-red-200">{error}</div>
        )}
      </div>
    </div>
  );
};
