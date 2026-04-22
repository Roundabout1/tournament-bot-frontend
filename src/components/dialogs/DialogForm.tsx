interface DialogFormProps {
  header: string;
  className?: string;
  headerClassName?: string;
  children?: React.ReactNode;
}

export const DialogForm: React.FC<DialogFormProps> = ({
  header,
  className,
  headerClassName,
  children,
}) => {
  return (
    <div className={className ?? 'space-y-4'}>
      <h3 className={headerClassName ?? 'text-lg font-semibold text-gray-200'}>{header}</h3>
      {children}
    </div>
  );
};
