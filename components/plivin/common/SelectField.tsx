'use client';

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  id?: string;
  label?: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function SelectField({
  id,
  label,
  required = false,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled = false,
  className = '',
}: SelectFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-bold text-black select-none"
        >
          {label} {required && <span className="text-rose-600 font-bold">*</span>}
        </label>
      )}

      <div className="relative group">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white border-2 rounded-xl pl-4 pr-11 py-3.5 text-black font-bold text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-black/10 transition-all appearance-none cursor-pointer truncate shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-500 bg-rose-50/40 text-rose-950'
              : 'border-black'
          }`}
        >
          {placeholder && (
            <option value="" disabled className="text-slate-400 font-medium">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="text-black font-semibold py-1.5"
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-black group-hover:translate-y-0.5 transition-transform">
          <svg
            className="w-5 h-5 stroke-[2.5]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="text-[11px] font-bold text-rose-600 animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
}
