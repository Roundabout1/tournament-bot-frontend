import { Input } from "../Input";

interface DigitInputFormProps {
  value: number;
  onChange: (v: number) => void;
}

export const DigitInputForm: React.FC<DigitInputFormProps> = ({
  value,
  onChange,
}) => {
  return (
    <Input 
       type="number"
       value={value}
       onChange={(e) => onChange(parseInt(e.target.value))}
       className='w-full rounded border border-gray-500 bg-gray-600 px-3 py-2 text-white focus:border-blue-500 focus:outline-none'
      />
  );
};
