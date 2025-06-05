import React from "react";

const parseOptions = (options) => {
    if (!options) return [];
    if (typeof options === "string") {
        try {
            return JSON.parse(options);
        } catch (e) {
            return [];
        }
    }
    return options;
};

const QuestionCard = ({ question }) => {
    const options = parseOptions(question.options);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
                {question.questionText}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Tipo:</span> {question.type}
            </p>

            {options.length > 0 && (
                <div className="mt-2">
                    <p className="font-semibold text-gray-700 mb-1">Opciones:</p>
                    <ul className="list-disc list-inside space-y-2">
                        {options.map((opt, idx) => (
                            <li key={idx}>
                                <p className="text-gray-800">{opt.text}</p>
                                {opt.images?.length > 0 && (
                                    <div className="flex space-x-2 mt-1">
                                        {opt.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={`/images/${img}`} // ajusta según tu estructura
                                                alt={img}
                                                className="w-16 h-16 object-cover border rounded"
                                            />
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {options.length === 0 && (
                <p className="text-gray-500 italic">Sin opciones disponibles.</p>
            )}
        </div>
    );
};

const QuestionViewer = ({ data }) => {
    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">
                Lista de Preguntas
            </h1>
            {data.map((q) => (
                <QuestionCard key={q.id} question={q} />
            ))}
        </div>
    );
};

export default QuestionViewer;
