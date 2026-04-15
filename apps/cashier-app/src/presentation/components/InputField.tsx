import React, { forwardRef } from 'react';
import './InputField.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="input-group">
        <label className="input-label">{label}</label>
        <input 
          ref={ref}
          className={`input-control ${error ? 'has-error' : ''}`}
          {...props}
        />
        {error && <span className="input-error">{error}</span>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
