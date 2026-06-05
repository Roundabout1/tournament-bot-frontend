import { useEffect, useState } from 'react';
import { Input } from './Input';
import { Title } from './Title';
import { twMerge } from 'tailwind-merge';
import { Control } from './Control';

interface AuthProps {
  isAdmin: boolean;
}

export const Auth: React.FC<AuthProps> = ({ isAdmin }) => {
  const [error] = useState<string | undefined>(undefined);
  const [login, setLogin] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [isWaitingData, setIsWaitingData] = useState<boolean>(false);
  const [successfulSubmit, setSuccessfulSubmit] = useState<boolean>(false);

  useEffect(() => {
    const savedLogin = sessionStorage.getItem('tournament_bot_login') as string;
    setLogin(savedLogin);
    const savedPassword = sessionStorage.getItem('tournament_bot_password') as string;
    setPassword(savedPassword);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.target.reset();

    if (!password || !login) return;

    setIsWaitingData(true);

    // TODO: послать ws-сообщение с логином и паролём
    console.log(`${password} | ${login}`);
    sessionStorage.setItem('tournament_bot_login', login);
    sessionStorage.setItem('tournament_bot_password', password);
    setSuccessfulSubmit(true);
  };
  const onLoginChange = (value: string) => {
    setLogin(value);
  };
  const onPasswordChange = (value: string) => {
    setPassword(value);
  };
  if (successfulSubmit) {
    return <Control isAdmin={isAdmin} clientName={login ??  `user_${Math.random().toString(36).substr(2, 9)}`} />;
  }
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
            required={true}
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
