import React from 'react';

function TimeField({
    label,
    required,
    name,
    value,
    onChange,
    error,
    min,
    max,
    step,
    autoComplete,
    placeholder,
    className
}) {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block font-medium mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type="time"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                min={min}
                max={max}
                step={step}
                autoComplete={autoComplete}
                placeholder={placeholder}
                className={`${className} w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${error
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200'
                    }`}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}

export default TimeField;
