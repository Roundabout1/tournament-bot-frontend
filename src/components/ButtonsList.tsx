import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

type ButtonData = {
  text: string;
  action: () => void;
  hidden?: boolean;
};

type Alignment = 'left' | 'center' | 'right';

type Direction = 'horizontal' | 'vertical';

interface ButtonsListProps {
  buttons: ButtonData[];
  buttonClassName?: string;
  alignment?: Alignment;
  direction?: Direction;
  disabled?: boolean;
}

export const ButtonsList: React.FC<ButtonsListProps> = ({ 
  buttons, 
  buttonClassName, 
  alignment = 'center',
  direction = 'horizontal',
  disabled = false,
}) => {
  const visibleButtons = buttons.filter(button => !button.hidden);

  const alignmentClasses = {
    left: direction === 'horizontal' ? 'justify-start' : 'items-start',
    center: direction === 'horizontal' ? 'justify-center' : 'items-center',
    right: direction === 'horizontal' ? 'justify-end' : 'items-end'
  };
  
  const directionClass = direction === 'horizontal' ? 'flex-row' : 'flex-col';
  
  return (
    <div className={twMerge(
      "flex gap-2 disabled:opacity-50 overflow-auto",
      directionClass,
      alignmentClasses[alignment],
    )}>
      {visibleButtons.map((button) => (
        <Button
          className={buttonClassName ?? 'w-96 py-2 h-auto'}
          onClick={button.action}
          text={button.text}
          disabled={disabled}
        />
      ))}
    </div>
  );
};