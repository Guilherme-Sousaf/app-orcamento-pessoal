import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, options, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full rounded-xl px-3.5 py-2.5 text-sm font-normal text-slate-100 bg-slate-900/90',
            'border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all duration-200 cursor-pointer',
            error && 'border-rose-500 focus:border-rose-500',
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
