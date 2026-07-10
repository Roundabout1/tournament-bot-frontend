import { useEffect, useState } from 'react';
import { Input } from './Input';
import { twMerge } from 'tailwind-merge';
import { ADMIN_AUTH_KEYS, JUDGE_AUTH_KEYS } from '../consts/StorageKeys';
import { AuthInfo } from '../types/Auth';

interface AuthProps {
  onSubmit(username: string, password: string): void;
  authError: boolean;
  isWaitingData: boolean;
  isAdmin: boolean;
}

export const Auth: React.FC<AuthProps> = ({ onSubmit, authError, isWaitingData, isAdmin }) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const getAuthStorage = (keys: AuthInfo): AuthInfo => {
    return {
      login: sessionStorage.getItem(keys.login ?? ''),
      pass: sessionStorage.getItem(keys.pass ?? ''),
    };
  };

  const setAuthStorage = (keys: AuthInfo) => {
    if (!keys.login || !keys.pass) {
      return;
    }
    sessionStorage.setItem(keys.login, login);
    sessionStorage.setItem(keys.pass, password);
  };

  useEffect(() => {
    const savedAuth: AuthInfo = isAdmin
      ? getAuthStorage(ADMIN_AUTH_KEYS)
      : getAuthStorage(JUDGE_AUTH_KEYS);
    if (savedAuth.login !== null && savedAuth.pass !== null) {
      onSubmit(savedAuth.login, savedAuth.pass);
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

    if (isAdmin) {
      setAuthStorage(ADMIN_AUTH_KEYS);
    } else {
      setAuthStorage(JUDGE_AUTH_KEYS);
    }
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
          <h1 className="text-gradient text-4xl">Вход</h1>
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
