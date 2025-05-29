import React from 'react';

function CheckboxGroupField({
    label,
    name,
    options = [],
    value = [],
    onChange,
    required,
    error,
    disabled,
    className
}) {
    const handleChange = (e) => {
        const { checked, value: optionValue } = e.target;
        let newValue;

        if (checked) {
            // Añadir opción seleccionada
            newValue = [...value, optionValue];
        } else {
            // Quitar opción deseleccionada
            newValue = value.filter((v) => v !== optionValue);
        }

        onChange({ target: { name, value: newValue } });
    };

    return (
        <div className="mb-4">
            <span className="block font-medium mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </span>
            <div role="group" aria-label={label} className="flex flex-col space-y-2">
                {options.map(({ label: optionLabel, value: optionValue }) => (
                    <label
                        key={optionValue}
                        className={`inline-flex items-center cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                    >
                        <input
                            type="checkbox"
                            name={name}
                            value={optionValue}
                            checked={value.includes(optionValue)}
                            onChange={handleChange}
                            disabled={disabled}
                            className={`${className} form-checkbox text-blue-600`}
                            required={required && value.length === 0}
                        />
                        <span className="ml-2">{optionLabel}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}

export default CheckboxGroupField;
