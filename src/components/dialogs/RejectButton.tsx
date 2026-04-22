import { Button } from '../Button';

interface RejectButtonProps {
  text?: string;
  handle: () => void;
}

export const RejectButton: React.FC<RejectButtonProps> = ({ text, handle }) => {
  return (
    <Button
      onClick={handle}
      text={text ?? 'Отмена'}
      className="w-full flex-1 rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
    />
  );
};
