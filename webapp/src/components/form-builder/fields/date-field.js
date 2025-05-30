import React from 'react';

function DateField({
    label,
    required,
    name,
    value,
    onChange,
    error,
    min,
    max,
    disabled,
    placeholder,
    autoComplete,
    className
}) {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block font-medium mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type="date"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                max={max}
                disabled={disabled}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`${className} w-full p-2 border rounded-lg shadow-sm focus:outline-none ${error
                    ? 'bg-red-50 border-red-600 focus:ring-2 focus:ring-red-200'
                    : 'bg-gray-100 border-gray-300 focus:ring-2 focus:ring-indigo-600'
                }`}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}

export default DateField;
