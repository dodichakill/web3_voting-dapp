'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FormToggleProps {
  label: string;
  helperText?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function FormToggle({
  label,
  helperText,
  defaultChecked = false,
  onChange,
  className
}: FormToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={cn("mb-4", className)}>
      <div className="flex items-center space-x-3">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 ${
            checked ? 'bg-blue-600' : 'bg-gray-700'
          }`}
        >
          <span className="sr-only">Toggle {label}</span>
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="flex flex-col">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          {helperText && (
            <span className="text-xs text-gray-500">{helperText}</span>
          )}
        </span>
      </div>
    </div>
  );
}
