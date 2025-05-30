import React from 'react';

function TextareaField({
    label,
    required,
    name,
    value,
    onChange,
    error,
    placeholder,
    rows = 4,
    maxLength,
    minLength,
    autoComplete,
    className
}) {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block font-medium mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                minLength={minLength}
                autoComplete={autoComplete}
                className={`${className} w-full p-2 border rounded-lg shadow-sm focus:outline-none ${error
                    ? 'bg-red-50 border-red-600 focus:ring-2 focus:ring-red-200'
                    : 'bg-gray-100 border-gray-300 focus:ring-2 focus:ring-indigo-600'
                    }`}
            ></textarea>
            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
}

export default TextareaField;
