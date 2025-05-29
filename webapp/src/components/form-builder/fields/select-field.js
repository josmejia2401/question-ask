import React from 'react';

function SelectField({
    label,
    required,
    name,
    value,
    onChange,
    error,
    options = [],
    multiple = false,
    size,
    disabled,
    placeholder,
    className
}) {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block font-medium mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                multiple={multiple}
                size={size}
                disabled={disabled}
                className={`${className} w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring ${error
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-blue-200'
                    }`}
            >
                {placeholder && !multiple && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map(({ label: optionLabel, value: optionValue }) => (
                    <option key={optionValue} value={optionValue}>
                        {optionLabel}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}

export default SelectField;
