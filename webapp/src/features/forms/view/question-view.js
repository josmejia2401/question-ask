import React, { useState } from 'react';

const QuestionView = ({ question }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    // Estilos base
    const baseStyles = "p-4 rounded-lg shadow-sm border-l-4 mb-3 cursor-pointer transition-all";

    // Estilos por tipo
    const typeStyles = {
        multiple: "bg-blue-50 border-blue-500 hover:bg-blue-100",
        long: "bg-green-50 border-green-500 hover:bg-green-100",
        short: "bg-purple-50 border-purple-500 hover:bg-purple-100",
        single: "bg-yellow-50 border-yellow-500 hover:bg-yellow-100",
        default: "bg-gray-50 border-gray-500 hover:bg-gray-100"
    };

    // Iconos
    const typeIcons = {
        multiple: (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        long: (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
        ),
        default: (
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    return (
        <div
            className={`${baseStyles} ${typeStyles[question.type] || typeStyles.default}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                    {typeIcons[question.type] || typeIcons.default}
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800">
                            {question.questionText}
                        </h3>

                        <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-white rounded-full shadow-xs">
                                Orden: {question.order}
                            </span>
                            {question.required && (
                                <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                                    Requerido
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Contenido colapsable */}
                    {!isCollapsed && (
                        <div className="mt-3 animate-fadeIn">
                            {question.type === 'multiple' || question.type === 'single' ? (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Opciones:</h4>
                                    <ul className="space-y-2">
                                        {question.options.map((option) => (
                                            <li key={option.id} className="flex items-start">
                                                <span className="bg-white p-2 rounded-md shadow-xs flex-1">
                                                    {option.text}
                                                    {option.images?.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {option.images.map((image) => (
                                                                <img
                                                                    key={image.id}
                                                                    src={image.imagePath}
                                                                    alt="Opción"
                                                                    className="h-16 w-16 object-cover rounded border"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div>
                                    <div className="bg-white p-2 rounded-md shadow-xs">
                                        {question.type === 'long' ? (
                                            <textarea
                                                className="w-full h-20 border rounded p-2 text-sm"
                                                placeholder="Respuesta larga..."
                                                disabled
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                className="w-full border rounded p-2 text-sm"
                                                placeholder="Respuesta corta..."
                                                disabled
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Ícono de colapso/expandir */}
                    <div className="flex justify-end mt-2">
                        <svg
                            className={`w-5 h-5 text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionView;