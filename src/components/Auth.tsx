import { useEffect, useState } from 'react';
import { Input } from './Input';
import { twMerge } from 'tailwind-merge';
import { LOGIN_STORAGE_KEY, PASS_STORAGE_KEY } from '../consts/StorageKeys';

interface AuthProps {
  onSubmit(username: string, password: string): void;
  authError: boolean;
  isWaitingData: boolean;
}

export const Auth: React.FC<AuthProps> = ({ onSubmit, authError, isWaitingData }) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const savedLogin = sessionStorage.getItem(LOGIN_STORAGE_KEY);
    //setLogin(savedLogin);
    const savedPassword = sessionStorage.getItem(PASS_STORAGE_KEY);
    //setPassword(savedPassword);
    console.log('pass', savedLogin, savedPassword);
    if (savedLogin !== null && savedPassword !== null) {
      onSubmit(savedLogin, savedPassword);
    }
  }, []);

  useEffect(() => {
    if (authError) {
      setError('Неверный пароль');
    }
  }, [authError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.target.reset();

    if (!login) return;

    sessionStorage.setItem(LOGIN_STORAGE_KEY, login);
    sessionStorage.setItem(PASS_STORAGE_KEY, password);
    onSubmit(login, password);
  };
  const onLoginChange = (value: string) => {
    setLogin(value);
  };
  const onPasswordChange = (value: string) => {
    setPassword(value);
  };
  return (
    <div className="flex h-[100vh] w-[100wh] place-content-center items-center bg-gray-700">
      <div className="mb-[5%] flex-col items-center text-center">
        <div className="mb-3">
          <h1 className='text-gradient text-4xl'>Вход</h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <Input
            maxLength={20}
            onChange={(e) => onLoginChange(e.target.value)}
            placeholder="Имя пользователя"
            required={true}
            disabled={isWaitingData}
          />
          <Input
            maxLength={20}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Пароль"
            type={'password'}
            required={false}
            disabled={isWaitingData}
          />
          {error && <span className="text-red-500"> {error} </span>}
          <button
            disabled={isWaitingData}
            className={twMerge(
              'h-8 w-full cursor-pointer rounded border-none bg-[#324ab2] text-gray-200',
              isWaitingData && 'opacity-50',
            )}
            type="submit"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};
