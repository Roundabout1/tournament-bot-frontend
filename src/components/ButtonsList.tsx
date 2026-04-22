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
}

export const ButtonsList: React.FC<ButtonsListProps> = ({ 
  buttons, 
  buttonClassName, 
  alignment = 'center',
  direction = 'horizontal'
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
      "flex gap-2",
      directionClass,
      alignmentClasses[alignment],
    )}>
      {visibleButtons.map((button, index) => (
        <Button
          key={index}
          className={buttonClassName}
          onClick={button.action}
          text={button.text}
        />
      ))}
    </div>
  );
};