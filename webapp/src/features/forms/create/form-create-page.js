import React, { useState } from 'react'
import QuestionBuilder from './question-builder'

const FormCreatePage = () => {
    const [questions, setQuestions] = useState([])

    const addQuestion = () => {
        setQuestions(prev => [
            ...prev,
            {
                questionText: '',
                type: 'short',
                options: [],
                required: false,
            },
        ])
    }

    const updateQuestion = (index, updatedQuestion) => {
        const newQuestions = [...questions]
        newQuestions[index] = updatedQuestion
        setQuestions(newQuestions)
    }

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index))
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Crear nuevo formulario</h1>

            <QuestionBuilder
                questions={questions}
                onAdd={addQuestion}
                onUpdate={updateQuestion}
                onRemove={removeQuestion}
            />
        </div>
    )
}

export default FormCreatePage
