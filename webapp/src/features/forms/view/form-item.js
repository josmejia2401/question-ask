import QuestionView from './question-view';

const FormCard = ({ form }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-6">
      <div className="bg-white p-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{form.title}</h2>
            {form.description && (
              <p className="mt-1 text-gray-600">{form.description}</p>
            )}
          </div>
          <span className={`px-2 py-1 text-xs rounded ${
            form.isPublic 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {form.isPublic ? 'Público' : 'Privado'}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-4">
        <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Preguntas ({form.questions.length})
        </h3>
        
        <div className="space-y-3">
          {form.questions
            .sort((a, b) => a.order - b.order)
            .map((question) => (
              <QuestionView key={question.id} question={question} />
            ))}
        </div>
      </div>
    </div>
  );
};
export default FormCard;