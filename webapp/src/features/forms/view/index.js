import React, { useEffect, useState } from "react";
import "./styles.css";
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { findAll, deleteById } from "./api";
import FormCard from './form-item';
import ButtonComponent from "../../../components/button-secondary";

const FormList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const json = await findAll();
            if (json.code === 200 && Array.isArray(json.data)) {
                setData(json.data);
            } else {
                throw new Error(json.message || "Formato inesperado de respuesta");
            }
        } catch (err) {
            setError(err.message || "Error al cargar los datos");
            console.error("Error fetching forms:", err);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const json = await deleteById(id);
            if (json.code === 200) {
                const newData = data.filter(p => p.id !== id);
                setData(newData);
            } else {
                throw new Error(json.message || "Formato inesperado de respuesta");
            }
        } catch (err) {
            console.log(err);
            setError(err.message || "Error al cargar los datos");
            console.error("Error fetching forms:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchQuestions();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">
                            Error al cargar formularios: {error}
                            <button
                                onClick={fetchQuestions}
                                className="ml-2 text-sm font-medium text-red-600 hover:text-red-500"
                            >
                                Reintentar
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Mis Formularios</h1>
                <ButtonComponent
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    aria-label="Refrescar formulario"
                    text="Refrescar"
                    icon={<ArrowPathIcon className="w-5 h-5" aria-hidden="true"></ArrowPathIcon>}
                    onClick={fetchQuestions}
                    loading={loading}>
                </ButtonComponent>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No hay formularios</h3>
                    <p className="mt-1 text-gray-500">No se encontraron formularios creados.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {data.map((form) => (
                        <FormCard key={form.id} form={form} onDelete={onDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormList;