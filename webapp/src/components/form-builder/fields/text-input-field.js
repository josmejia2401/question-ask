import React from 'react';

function TextInputField({
    label,
    required = false,
    name,
    value,
    onChange,
    error,
    type = 'text',
    placeholder,
    maxLength,
    minLength,
    max,
    min,
    size,
    pattern,
    step,
    autoComplete,
    className
}) {
    return (
        <div className="mb-2">
            <label htmlFor={name} className="block font-medium mb-1 text-gray-600">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                maxLength={maxLength}
                minLength={minLength}
                max={max}
                min={min}
                size={size}
                pattern={pattern}
                step={step}
                autoComplete={autoComplete}
                className={`${className} w-full p-2 border rounded-lg shadow-sm focus:outline-none ${error
                        ? 'bg-red-50 border-red-600 focus:ring-2 focus:ring-red-200'
                        : 'bg-gray-100 border-gray-300 focus:ring-2 focus:ring-indigo-600'
                    }`}
            />
            {error && (
                <p className="text-sm text-red-600 mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}

export default TextInputField;
