'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface Option {
  value: string | number;
  label: string;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: Option[];
  error?: string;
  helperText?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, helperText, className, ...props }, ref) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
        <select
          ref={ref}
          className={cn(
            "w-full px-4 py-2 bg-gray-900 border rounded-md focus:outline-none focus:ring-2 transition-colors",
            error 
              ? "border-red-500 focus:ring-red-500/50" 
              : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/50",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export { FormSelect };
