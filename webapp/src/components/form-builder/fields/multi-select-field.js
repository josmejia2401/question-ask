import React from 'react';

function MultiSelectField({
    label,
    name,
    value = [],
    onChange,
    options = [],
    required,
    error,
    size = 5,
    disabled,
    placeholder,
    className
}) {
    const handleChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(
            (option) => option.value
        );
        onChange({ target: { name, value: selectedOptions } });
    };

    return (
        <div className="mb-4">
            <label htmlFor={name} className="block font-medium mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
                id={name}
                name={name}
                multiple
                size={size}
                value={value}
                onChange={handleChange}
                required={required}
                disabled={disabled}
                className={`${className} w-full p-2 border rounded-lg shadow-sm focus:outline-none ${error
                    ? 'bg-red-50 border-red-600 focus:ring-2 focus:ring-red-200'
                    : 'bg-gray-100 border-gray-300 focus:ring-2 focus:ring-indigo-600'
                }`}
            >
                {placeholder && (
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

export default MultiSelectField;
