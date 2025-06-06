import React, { useState } from "react";
import QuestionView from './question-view';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

import ButtonComponent from "../../../components/button-secondary";
import { Link } from "react-router-dom";

const FormCard = ({ form, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [questionsExpanded, setQuestionsExpanded] = useState(false);

  const handleEdit = (e, id) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setShowDeleteDialog(false);
    setLoading(true);
    onDelete(form.id).finally(() => setLoading(false));
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const handleToggleQuestions = (e) => {
    e.stopPropagation();
    setQuestionsExpanded((v) => !v);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-6 group">
      <div className="bg-white p-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{form.title}</h2>
            {form.description && (
              <p className="mt-1 text-gray-600">{form.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ButtonComponent
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Eliminar formulario"
              icon={<TrashIcon className="w-5 h-5" aria-hidden="true"></TrashIcon>}
              text="">
            </ButtonComponent>
            <Link
              to={`/forms/edit?id=${form.id}`}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Eliminar formulario">
              <PencilSquareIcon className="w-5 h-5" aria-hidden="true"></PencilSquareIcon>
            </Link>
            <span className={`px-2 py-1 text-xs rounded ${form.isPublic
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
              }`}>
              {form.isPublic ? 'Público' : 'Privado'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4">
        <button
          type="button"
          onClick={handleToggleQuestions}
          className="flex items-center gap-2 font-medium text-gray-700 mb-3 focus:outline-none hover:underline"
          aria-expanded={questionsExpanded}
          aria-controls={`questions-list-${form.id}`}
        >
          {questionsExpanded ? (
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          Preguntas ({form.questions.length})
        </button>
        <div
          id={`questions-list-${form.id}`}
          className={`space-y-3 transition-all duration-300 ${questionsExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
        >
          {form.questions
            .sort((a, b) => a.order - b.order)
            .map((question) => (
              <QuestionView key={question.id} question={question} />
            ))}
        </div>
      </div>

      {/* Diálogo de confirmación */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmar eliminación
              </h3>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de eliminar el formulario <strong>"{form.title}"</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <ButtonComponent
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Eliminar formulario"
                text="Eliminar"
                icon={<TrashIcon className="w-5 h-5" aria-hidden="true"></TrashIcon>}
                onClick={confirmDelete}
                loading={loading}>
              </ButtonComponent>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormCard;