import { useEffect, useState } from 'react';
import { Input } from './Input';
import { Title } from './Title';
import { twMerge } from 'tailwind-merge';

interface AuthProps {
  onSubmit(username: string, password: string): void;
  authError: boolean;
  isWaitingData: boolean;
}

export const Auth: React.FC<AuthProps> = ({ onSubmit, authError, isWaitingData}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const savedLogin = sessionStorage.getItem('tournament_bot_login') as string;
    setLogin(savedLogin);
    const savedPassword = sessionStorage.getItem('tournament_bot_password') as string;
    setPassword(savedPassword);
  }, []);

  useEffect(()=>{
    if (authError){
      setError('Неверный пароль');
    }
  }, [authError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.target.reset();

    if (!login) return;

    sessionStorage.setItem('tournament_bot_login', login);
    sessionStorage.setItem('tournament_bot_password', password);
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
          <Title />
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
