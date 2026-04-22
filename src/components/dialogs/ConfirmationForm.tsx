import { AcceptButton } from './AcceptButton';
import { RejectButton } from './RejectButton';

interface ConfirmationFormProps {
  handleAccept: () => void;
  handleReject: () => void;
  acceptText?: string;
  rejectText?: string;
}

export const ConfirmationForm: React.FC<ConfirmationFormProps> = ({
  handleAccept,
  handleReject,
  acceptText,
  rejectText,
}) => {
  return (
    <div className="flex gap-4">
      <AcceptButton text={acceptText} handle={handleAccept} />
      <RejectButton text={rejectText} handle={handleReject} />
    </div>
  );
};
