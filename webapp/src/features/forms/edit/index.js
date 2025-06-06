import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { findById, updateById } from "./api";
import QuestionItem from './question-item';
import ButtonComponent from '../../../components/button-secondary';
import {
    CloudArrowUpIcon,
    PlusCircleIcon,
    PaperAirplaneIcon,
    ArrowPathIcon
} from '@heroicons/react/24/solid';

const useQuery = () => new URLSearchParams(useLocation().search);

const EditFormPage = () => {
    const navigate = useNavigate();
    const query = useQuery();
    const id = query.get('id');

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                setError(null);
                setLoading(true);
                const json = await findById(id);
                if (json.code === 200) {
                    setFormData(json.data);
                } else {
                    throw new Error(json.message || 'Formulario no encontrado');
                }
            } catch (err) {
                setError(err.message || 'Error al cargar el formulario');
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [id]);

    const handleSave = async () => {
        try {
            setError(null);
            setLoading(true);
            const response = await updateById(id, formData);
            if (response.code === 200) {
                
            } else {
                throw new Error(response.message || 'Error al guardar');
            }
        } catch (err) {
            setError(err.message || 'Error al guardar los cambios');
        } finally {
            setLoading(false);
        }
    };

    const onPublish = async () => {
        try {
            setError(null);
            setLoading(true);
            formData.isPublic = true;
            const response = await updateById(id, formData);
            if (response.code === 200) {
                
            } else {
                throw new Error(response.message || 'Error al guardar');
            }
        } catch (err) {
            setError(err.message || 'Error al guardar los cambios');
        } finally {
            setLoading(false);
        }
    };

    const addQuestion = () => {
        const newQuestions = [
            ...formData.questions || [],
            {
                questionText: '',
                type: 'short',
                options: [],
                required: false,
                createdAt: new Date().toISOString()
            },
        ];
        setFormData({ ...formData, questions: newQuestions });
    };

    const updateQuestion = (index, updatedQuestion) => {
        const newQuestions = [...formData.questions];
        newQuestions[index] = updatedQuestion;
        const form = { ...formData, questions: newQuestions }
        setFormData(form);
    };

    const removeQuestion = (index) => {
        const newQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: newQuestions });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <ArrowPathIcon className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">
                    Error al cargar el formulario: {error}
                    <button onClick={() => window.location.reload()} className="ml-2 underline">
                        Reintentar
                    </button>
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Editar Formulario: {formData.title}
            </h1>

            <div className="flex flex-wrap gap-3 mb-4">
                <button
                    onClick={addQuestion}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    <PlusCircleIcon className="w-5 h-5" />
                    Añadir pregunta
                </button>

                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                    <CloudArrowUpIcon className="w-5 h-5" />
                    Guardar
                </button>

                {!formData.isPublic && <button
                    onClick={onPublish}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    <PaperAirplaneIcon className="w-5 h-5" />
                    Publicar
                </button>}
            </div>

            <div className="bg-white p-4 border rounded shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{formData.title}</h2>
                        {formData.description && (
                            <p className="mt-1 text-gray-600">{formData.description}</p>
                        )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${formData.isPublic
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {formData.isPublic ? 'Público' : 'Privado'}
                    </span>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                {formData.questions && formData.questions.map((question, index) => (
                    <QuestionItem
                        key={index}
                        index={index}
                        question={question}
                        updateQuestion={updateQuestion}
                        removeQuestion={removeQuestion}
                        addQuestion={addQuestion}
                    />
                ))}
            </div>
        </div>
    );
};

export default EditFormPage;
