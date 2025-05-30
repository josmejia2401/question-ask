import React from 'react'
import QuestionItem from './question-item';

const QuestionBuilder = ({ questions, onAdd, onUpdate, onRemove }) => {
  return (
    <div className="space-y-6">
      <button
        onClick={onAdd}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Añadir pregunta
      </button>

      {questions && questions.length === 0 && (
        <p className="text-gray-500">No hay preguntas agregadas aún.</p>
      )}

      {questions && questions.map((q, i) => (
        <QuestionItem
          key={i}
          index={i}
          question={q}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

export default QuestionBuilder
