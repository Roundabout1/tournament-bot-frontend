import React, { useState } from 'react';
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
}

export const AddResultsDialog: React.FC<AddResultsDialogProps> = ({
  onClose,
  sendMessage,
  step,
  tables = [],
  tableInfo = null,
}) => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [resultState, setResultState] = useState<ResultState>('completed');
  const [winner, setWinner] = useState<string>('');
  const [hasFines1, setHasFines1] = useState<boolean>(false);
  const [hasFines2, setHasFines2] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
  };

  const handleCancel = () => {
    onClose();
  };

  const renderLoad = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Ввод результатов</h3>
      <p className="text-gray-300">Загрузка списка столов...</p>
    </div>
  );

  const renderSelectTableStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Выберите стол</h3>
      <div className="space-y-2">
        {tables.map((table) => (
          <label key={table} className="flex items-center space-x-3">
            <input
              type="radio"
              value={table}
              checked={selectedTable === table}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="form-radio text-blue-600"
            />
            <span className="text-gray-300">Стол №{table}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleSelectTable}
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

  const renderEnterResultStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-200">Стол №{tableInfo?.table}</h3>
      <p className="text-gray-300">
        Игроки: <strong>{tableInfo?.player1}</strong> vs <strong>{tableInfo?.player2}</strong>
      </p>

      {/* Результат игры */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Результат:</label>
        <div className="space-y-2">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              checked={resultState === 'completed'}
              onChange={() => setResultState('completed')}
              className="form-radio text-blue-600"
            />
            <span className="text-gray-300">Победа/Поражение</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              checked={resultState === 'draw'}
              onChange={() => setResultState('draw')}
              className="form-radio text-blue-600"
            />
            <span className="text-gray-300">Ничья</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              checked={resultState === 'underplayed'}
              onChange={() => setResultState('underplayed')}
              className="form-radio text-blue-600"
            />
            <span className="text-gray-300">Недоиграно</span>
          </label>
        </div>
      </div>

      {/* Выбор победителя (только для completed) */}
      {resultState === 'completed' && (
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Победитель:</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value={tableInfo?.player1}
                checked={winner === tableInfo?.player1}
                onChange={(e) => setWinner(e.target.value)}
                className="form-radio text-blue-600"
              />
              <span className="text-gray-300">Игрок {tableInfo?.player1}</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                value={tableInfo?.player2}
                checked={winner === tableInfo?.player2}
                onChange={(e) => setWinner(e.target.value)}
                className="form-radio text-blue-600"
              />
              <span className="text-gray-300">Игрок {tableInfo?.player2}</span>
            </label>
          </div>
        </div>
      )}

      {/* Штрафы (только если игра их поддерживает) */}
      {tableInfo?.hasFines && (
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Штрафы:</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={hasFines1}
                onChange={(e) => setHasFines1(e.target.checked)}
                className="form-checkbox text-blue-600"
              />
              <span className="text-gray-300">Штраф игроку {tableInfo?.player1}</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={hasFines2}
                onChange={(e) => setHasFines2(e.target.checked)}
                className="form-checkbox text-blue-600"
              />
              <span className="text-gray-300">Штраф игроку {tableInfo?.player2}</span>
            </label>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleSubmitResult}
          className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Подтвердить
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

  const renderStep = () => {
    switch (step) {
      case 'start':
        return renderSelectTableStep();
      case 'entry_player_result':
        return renderEnterResultStep();
      case 'finish':
        handleCancel();
        return;
      default:
        return renderLoad();
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-96 max-w-full rounded-lg bg-gray-800 p-6">
        {renderStep()}
        {error && <div className="mt-4 rounded bg-red-900 p-2 text-sm text-red-200">{error}</div>}
      </div>
    </div>
  );
};
