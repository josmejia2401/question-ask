import React, { useState } from 'react';

function RatingField({
    label,
    name,
    value = 0,
    onChange,
    maxRating = 5,
    error,
    required,
    className
}) {
    const [hoverValue, setHoverValue] = useState(0);

    const handleClick = (val) => {
        onChange({ target: { name, value: val } });
    };

    return (
        <div className="mb-4">
            <label className="block font-medium mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div
                className={`flex space-x-1 ${error ? 'border border-red-500 rounded-md p-1' : ''
                    }`}
                role="radiogroup"
                aria-label={label}
            >
                {[...Array(maxRating)].map((_, i) => {
                    const starValue = i + 1;
                    const isFilled = hoverValue
                        ? starValue <= hoverValue
                        : starValue <= value;

                    return (
                        <button
                            key={starValue}
                            type="button"
                            className={`${className} text-2xl focus:outline-none ${isFilled ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                            onClick={() => handleClick(starValue)}
                            onMouseEnter={() => setHoverValue(starValue)}
                            onMouseLeave={() => setHoverValue(0)}
                            aria-checked={starValue === value}
                            role="radio"
                            aria-label={`${starValue} estrella${starValue > 1 ? 's' : ''}`}
                        >
                            ★
                        </button>
                    );
                })}
            </div>
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}

export default RatingField;
