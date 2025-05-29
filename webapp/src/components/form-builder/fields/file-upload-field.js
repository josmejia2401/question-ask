import React from 'react';

function FileUploadField({
    label,
    name,
    onChange,
    multiple = false,
    accept,
    required,
    error,
    disabled,
    className
}) {
    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="block font-medium mb-1 cursor-pointer"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type="file"
                id={name}
                name={name}
                onChange={onChange}
                multiple={multiple}
                accept={accept}
                required={required}
                disabled={disabled}
                className={`${className} block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          focus:outline-none focus:ring ${error
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-blue-200'
                    }`}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}

export default FileUploadField;
