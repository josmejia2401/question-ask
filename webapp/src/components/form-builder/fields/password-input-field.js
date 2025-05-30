import React, { useState } from 'react';

function PasswordInputField({
    label,
    name,
    value,
    onChange,
    required = false,
    placeholder = '',
    autoComplete = 'current-password',
    error,
    className,
    ...rest
}) {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShow = () => setShowPassword((prev) => !prev);
    const hasError = error && error.length > 0;

    return (
        <div className="mb-2 relative">
            {label && (
                <label htmlFor={name} className="block font-medium mb-1 text-gray-600">
                    {label} {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={showPassword ? 'text' : 'password'}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={`${className} w-full p-2 border rounded-lg shadow-sm focus:outline-none ${hasError
                    ? 'bg-red-50 border-red-600 focus:ring-2 focus:ring-red-200'
                    : 'bg-gray-100 border-gray-300 focus:ring-2 focus:ring-indigo-600'
                    }`}
                {...rest}
            />
            <button
                type="button"
                onClick={toggleShow}
                className="absolute top-9 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
                {showPassword ? (
                    // Ícono de ojo abierto (ver)
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                ) : (
                    // Ícono de ojo cerrado (ocultar)
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.963 9.963 0 012.156-3.357M6.18 6.18a9.959 9.959 0 015.822-1.67c4.477 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.276 5.872M3 3l18 18"
                        />
                    </svg>
                )}
            </button>
            {hasError && (
                <div className="mt-1 text-sm text-red-600">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

export default PasswordInputField;
