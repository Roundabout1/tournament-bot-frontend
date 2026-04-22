import { Button } from "../Button";

interface AcceptButtonProps {
  text?: string;
  handle: () => void;
}

export const AcceptButton: React.FC<AcceptButtonProps> = ({ text, handle }) => {
  return (
    <Button
      onClick={handle}
      text={text ?? 'Далее'}
    />
  );
};
