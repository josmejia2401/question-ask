import React, { useState } from 'react'
import QuestionBuilder from './question-builder'
import { CommonStore } from '../../../store/common-store'

const FormCreatePage = () => {
    const [questions, setQuestions] = useState(CommonStore.getState().questions);

    const addQuestion = () => {
        const newQuestions = [...questions, {
            questionText: '',
            type: 'short',
            options: [],
            required: false,
            answer: ''
        }];
        setQuestions(newQuestions);
        CommonStore.setQuestions(newQuestions);
    }

    const updateQuestion = (index, updatedQuestion) => {
        const newQuestions = [...questions];
        newQuestions[index] = updatedQuestion;
        setQuestions(newQuestions);
        CommonStore.setQuestions(newQuestions);
    }

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
        CommonStore.setQuestions(newQuestions);
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

export default FormCreatePage;
