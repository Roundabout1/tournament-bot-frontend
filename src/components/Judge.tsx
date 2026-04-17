import { ButtonsList } from './ButtonsList';
import { Title } from './Title';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
('file-saver');

export const Judge: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  const saveFile = (blob: Blob, name: string) => {
    const blobURL = URL.createObjectURL(blob);
    // Сделать невидимый HTML-элемент `<a download>`
    // и включить его в документ
    const a = document.createElement('a');
    a.href = blobURL;
    a.download = name;
    a.style.display = 'none';
    document.body.append(a);
    // Программно кликнуть по ссылке.
    a.click();
    // Уничтожить большой blob URL
    // и удалить ссылку из документа
    // после клика по ней
    setTimeout(() => {
      URL.revokeObjectURL(blobURL);
      a.remove();
    }, 1000);
  };

  const handleCreateGame = () => {
    // TODO
  };

  const handleSumUpResults = () => {
    // TODO
  };

  const handleEnterResults = () => {
    // TODO
  };

  const handleEdit = () => {
    // TODO
  };

  const handleStatus = () => {
    // TODO
  };

  const handleRemovePlayer = () => {
    // TODO
  };

  // жеребьёвка
  const handleDraw = () => {
    // TODO
  };

  const handleRoundsData = () => {
    // TODO
  };

  const buttons = [
    {
      text: 'Создать игру',
      action: handleCreateGame,
    },
    {
      text: 'Подвести итоги',
      action: handleSumUpResults,
    },
    {
      text: 'Ввести результат',
      action: handleEnterResults,
    },
    {
      text: 'Ред.',
      action: handleEdit,
    },
    {
      text: 'Статус',
      action: handleStatus,
    },
    {
      text: 'Удалить игрока',
      action: handleRemovePlayer,
    },
    {
      text: 'Жеребьёвка',
      action: handleDraw,
    },
    {
      text: 'Данные туров',
      action: handleRoundsData,
    },
  ];

  const logout = () => {
    sessionStorage.clear();
  };

  return (
    <div className="flex h-[100vh] w-[100wh] flex-col place-content-center items-center gap-2 bg-gray-700">
      <button
        className="absolute top-3 right-7 h-8 w-24 cursor-pointer rounded border border-none bg-[#324ab2] text-gray-200"
        onClick={logout}
      >
        Выйти
      </button>
      <Title />
      <div
        className={twMerge(
          'h-32 w-74 rounded border border-gray-400 px-2 py-1 text-left text-gray-200',
          message === null && 'text-gray-500',
        )}
      >
        {message === null ? 'Ответ от сервера...' : message}
      </div>
      <ButtonsList buttonClassName="w-74 py-2 h-auto" buttons={buttons} />
    </div>
  );
};
