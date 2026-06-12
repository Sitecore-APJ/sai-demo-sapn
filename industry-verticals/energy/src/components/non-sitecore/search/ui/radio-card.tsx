'use client';

import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

type RadioCardGroupProps = {
  name: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
};

type RadioCardContextValue = {
  name: string;
  value: string;
  onChange: (value: string) => void;
};

const RadioCardContext = createContext<RadioCardContextValue | null>(null);

export const RadioCardGroup = ({
  name,
  defaultValue = '',
  onChange,
  children,
  className = '',
}: RadioCardGroupProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    onChange?.(nextValue);
  };

  return (
    <RadioCardContext.Provider value={{ name, value, onChange: handleChange }}>
      <div className={`flex items-center gap-2 ${className}`} role="radiogroup">
        {children}
      </div>
    </RadioCardContext.Provider>
  );
};

type RadioCardProps = {
  value: string;
  children: ReactNode;
  className?: string;
};

export const RadioCard = ({ value, children, className = '' }: RadioCardProps) => {
  const context = useContext(RadioCardContext);
  const id = useId();

  if (!context) {
    return null;
  }

  const isChecked = context.value === value;

  return (
    <label
      htmlFor={id}
      className={`border-border cursor-pointer rounded-md border px-5 py-3 shadow-sm transition-colors ${
        isChecked ? 'bg-accent border-accent text-white' : 'bg-background text-foreground'
      } ${className}`}
    >
      <input
        id={id}
        type="radio"
        name={context.name}
        value={value}
        checked={isChecked}
        onChange={() => context.onChange(value)}
        className="sr-only"
      />
      {children}
    </label>
  );
};

type RadioCardIconProps = {
  value: string;
  children: ReactElement;
};

export const RadioCardIcon = ({ value, children }: RadioCardIconProps) => (
  <RadioCard value={value}>{children}</RadioCard>
);
