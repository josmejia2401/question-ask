import React, { useEffect, useState } from "react";
import QuestionViewer from "./question-viewer";
import { findAll } from "./api";

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const json = await findAll();
                if (json.code === 200 && Array.isArray(json.data)) {
                    console.log("json", json);
                    setData(json.data);
                } else {
                    throw new Error("Formato inesperado de respuesta");
                }
            } catch (err) {
                //setError(err.message || "Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    if (loading) {
        return <p className="p-4 text-gray-500">Cargando preguntas...</p>;
    }

    if (error) {
        return <p className="p-4 text-red-500">Error: {error}</p>;
    }

    return <QuestionViewer data={data} />;
}

export default App;
