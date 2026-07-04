interface LabelProps {
  text: string;
  inputId: string;
}

export default function Label({ text, inputId }: LabelProps) {
  return (
    <label
      className="uppercase text-sm font-medium text-foreground-muted"
      htmlFor={`${inputId}`}
    >
      {text}
    </label>
  );
}
