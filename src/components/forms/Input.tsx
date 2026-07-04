interface InputProps {
  id: string;
  name: string;
  type?: string;
  disabled?: boolean;
  autoComplete?: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function Input({
  id,
  name,
  type = "text",
  disabled = false,
  autoComplete = "",
  placeholder,
  value,
  onChange,
  onFocus,
  className,
}: InputProps) {
  return (
    <input
      className={`mt-2 py-3 px-5 rounded-xl border border-border bg-card outline-0 ${className ?? ""}`}
      id={id}
      name={name}
      type={type}
      disabled={disabled}
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      {...(onChange && { onChange })}
      {...(onFocus && { onFocus })}
      suppressHydrationWarning
    />
  );
}
