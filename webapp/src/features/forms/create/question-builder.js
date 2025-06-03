import React from 'react'
import QuestionItem from './question-item'

const QuestionBuilder = ({ questions, onAdd, onUpdate, onRemove, onSave, onPublish }) => {
  return (
    <div className="space-y-6">

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Añadir pregunta
        </button>

        <button
          onClick={onSave}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
          Guardar
        </button>

        <button
          onClick={onPublish}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Publicar
        </button>
      </div>

      <p className="text-gray-500 text-sm">
        En QuestionAsk, actualmente las preguntas no cuentan con la funcionalidad de arrastrar y soltar (drag and drop) para reordenarlas. Por lo tanto, el orden en que se visualizan en el editor es el mismo en que serán mostradas en el formulario final para los usuarios. Asegúrate de ingresar las preguntas en el orden deseado, ya que este será respetado al momento de publicarlas.
      </p>

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
