'use client';

interface Props<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

export default function FilterChips<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="chips">
      {options.map((o) => (
        <button
          key={o.value}
          className={`chip ${o.value === value ? 'on' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
