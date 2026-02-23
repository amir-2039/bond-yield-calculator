interface InputFieldProps {
  id: string;
  label: string;
  type?: 'number' | 'text';
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function InputField({
  id,
  label,
  type = 'number',
  value,
  onChange,
  error,
  min,
  max,
  step,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className="input-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
