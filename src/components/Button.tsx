import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  text: string;
}

export const Button: React.FC<ButtonProps> = ({ text, className, ...other }) => {
  return (
    <button
      {...other}
      className={twMerge(
        'flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700',
        //'hover:scale-105', // увеличение размера
        'transition-all duration-200', // плавная анимация
        className && className,
      )}
    >
      {text}
    </button>
  );
};