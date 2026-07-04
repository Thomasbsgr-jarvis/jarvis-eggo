interface TextareaProps {
  id: string;
  name: string;
  disabled?: boolean;
  autoComplete?: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
}

export default function Textarea({
  id,
  name,
  disabled = false,
  autoComplete = "",
  placeholder,
  value,
  onChange,
  onFocus,
  className,
  rows = 4,
}: TextareaProps) {
  return (
    <textarea
      className={`mt-2 py-3 px-5 rounded-xl border border-border bg-card outline-0 resize-none ${className ?? ""}`}
      id={id}
      name={name}
      disabled={disabled}
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      rows={rows}
      {...(onChange && { onChange })}
      {...(onFocus && { onFocus })}
      suppressHydrationWarning
    />
  );
}
