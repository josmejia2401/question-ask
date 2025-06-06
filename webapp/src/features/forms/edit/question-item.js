import React from 'react';
import { TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';

const typeLabels = {
  short: 'Respuesta corta',
  long: 'Respuesta larga',
  multiple: 'Varias opciones',
  checkbox: 'Casillas',
  //fileupload: 'Cargar archivos',
  //filedownload: 'Descargar archivos',
  rating: 'Calificación',
  date: 'Fecha',
  time: "Hora"
};

const SortableItem = ({ question, index, updateQuestion, removeQuestion }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateQuestion(index, { ...question, [name]: value, order: index });
  }

  const handleRemove = () => removeQuestion(index);

  return (
    <div className="border rounded p-4 bg-white shadow-sm space-y-4">
      <div className="flex justify-between">
        <h3 className="font-semibold">Pregunta #{index + 1}</h3>
        <TrashIcon onClick={handleRemove}
          className="text-red-600 hover:text-red-800 h-5 w-5" />
      </div>

      <div>
        <label className="block font-medium mb-1">Texto de la pregunta</label>
        <input
          type="text"
          name="questionText"
          value={question.questionText}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Tipo de respuesta</label>
        <select
          name="type"
          value={question.type}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          {Object.entries(typeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo: Respuesta corta */}
      {question.type === 'short' && (
        <div className="space-y-3">
          <input
            type="text"
            value={''}
            disabled
            onChange={(e) =>
              updateQuestion(index, { ...question, answer: e.target.value })
            }
            placeholder="Respuesta del usuario"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          {/* Checkbox: obligatorio */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`required-${index}`}
              checked={question.required || false}
              onChange={(e) =>
                updateQuestion(index, { ...question, required: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor={`required-${index}`} className="text-sm text-gray-700">
              ¿Es obligatorio responder esta pregunta?
            </label>
          </div>
        </div>
      )}


      {/* Tipo: Respuesta larga */}
      {question.type === 'long' && (
        <div className="space-y-3">
          <textarea
            value={question.answer || ''}
            onChange={(e) =>
              updateQuestion(index, { ...question, answer: e.target.value })
            }
            disabled
            placeholder="Respuesta larga del usuario"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y"
          />

          {/* Checkbox: obligatorio */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`required-long-${index}`}
              checked={question.required || false}
              onChange={(e) =>
                updateQuestion(index, { ...question, required: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor={`required-long-${index}`} className="text-sm text-gray-700">
              ¿Es obligatorio responder esta pregunta?
            </label>
          </div>
        </div>
      )}

      {/* Tipo: varias opciones */}

      {question.type === 'multiple' && (
        <div>
          <label className="block font-medium mb-2">Varias opciones</label>
          <div className="space-y-4">
            {question.options.map((option, idx) => (
              <div key={idx} className="flex flex-col gap-2 border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  {/* Radio button (solo para mostrar, no seleccionado por defecto) */}
                  <input type="radio" disabled className="form-radio h-4 w-4 text-indigo-600" />

                  {/* Texto editable */}
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => {
                      const updatedOptions = [...question.options];
                      updatedOptions[idx].text = e.target.value;
                      updatedOptions[idx].createdAt = new Date().toISOString();
                      updateQuestion(index, { ...question, options: updatedOptions });
                    }}
                    className="flex-1 border rounded px-3 py-1"
                    placeholder="Texto de la opción"
                  />

                  {/* Botón eliminar */}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedOptions = question.options.filter((_, i) => i !== idx);
                      updateQuestion(index, { ...question, options: updatedOptions });
                    }}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar opción"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Input para subir imágenes */}
                <div className="flex items-center gap-3 ml-7">
                  <label className="text-sm text-gray-600 flex items-center gap-1 cursor-pointer">
                    <PhotoIcon className="h-4 w-4" />
                    Subir imagen
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []).slice(0, 3);
                        const updatedOptions = [...question.options];

                        const currentOption = typeof updatedOptions[idx] === 'object'
                          ? updatedOptions[idx]
                          : { text: updatedOptions[idx], images: [] };

                        updatedOptions[idx] = { ...currentOption, images: files };
                        updateQuestion(index, { ...question, options: updatedOptions });
                      }}
                      className="hidden"
                    />
                  </label>

                  {/* Preview de imágenes */}
                  {option.images && option.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {option.images.map((img, i) => (
                        <img
                          key={i}
                          src={img.path || URL.createObjectURL(img)}
                          alt={`Imagen ${i + 1}`}
                          className="h-16 w-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Botón para añadir opción */}
            <button
              type="button"
              onClick={() => {
                const updatedOptions = [...question.options, { text: '', images: [] }];
                updateQuestion(index, { ...question, options: updatedOptions });
              }}
              className="text-indigo-600 hover:underline text-sm mt-2"
            >
              + Añadir opción
            </button>

            {/* Checkbox obligatorio */}
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id={`required-multiple-${index}`}
                checked={question.required || false}
                onChange={(e) =>
                  updateQuestion(index, { ...question, required: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor={`required-multiple-${index}`} className="text-sm text-gray-700">
                ¿Es obligatorio responder esta pregunta?
              </label>
            </div>
          </div>
        </div>
      )}


      {/* Tipo: Casillas */}
      {question.type === 'checkbox' && (
        <div>
          <label className="block font-medium mb-2">Casillas de selección</label>
          <div className="space-y-4">
            {question.options.map((option, idx) => (
              <div key={idx} className="flex flex-col gap-2 border p-3 rounded-md">
                <div className="flex items-center gap-3">
                  <input type="checkbox" disabled className="form-checkbox h-4 w-4 text-indigo-600" />
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => {
                      const updatedOptions = [...question.options];
                      updatedOptions[idx].text = e.target.value;
                      updateQuestion(index, { ...question, options: updatedOptions });
                    }}
                    className="flex-1 border rounded px-3 py-1"
                    placeholder="Texto de la opción"
                  />

                  {/* Eliminar con icono */}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedOptions = question.options.filter((_, i) => i !== idx);
                      updateQuestion(index, { ...question, options: updatedOptions });
                    }}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar opción"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Input para imagen */}
                <div className="flex items-center gap-3 ml-7">
                  <label className="text-sm text-gray-600 flex items-center gap-1 cursor-pointer">
                    <PhotoIcon className="h-4 w-4" />
                    Subir imagen
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []).slice(0, 3); // máximo 3
                        const updatedOptions = [...question.options];

                        const currentOption = typeof updatedOptions[idx] === 'object'
                          ? updatedOptions[idx]
                          : { text: updatedOptions[idx], images: [] };

                        updatedOptions[idx] = { ...currentOption, images: files };
                        updateQuestion(index, { ...question, options: updatedOptions });
                      }}
                    />
                  </label>

                  {/* Preview simple */}
                  {option.images && option.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {option.images.map((img, i) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(img)}
                          alt={`Imagen ${i + 1}`}
                          className="h-16 w-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const updatedOptions = [...question.options, { text: '', images: [] }];
                updateQuestion(index, { ...question, options: updatedOptions });
              }}
              className="text-indigo-600 hover:underline text-sm mt-2"
            >
              + Añadir casilla
            </button>
          </div>

          {/* Checkbox: obligatorio */}
          <div className="flex items-center mt-4 gap-2">
            <input
              type="checkbox"
              id={`required-${index}`}
              checked={question.required || false}
              onChange={(e) => updateQuestion(index, { ...question, required: e.target.checked })}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor={`required-${index}`} className="text-sm text-gray-700">
              ¿Es obligatorio responder esta pregunta?
            </label>
          </div>
        </div>
      )}

      {/* Tipo: Archivos */}
      {question.type === 'fileupload' && (
        <div>
          <label className="block font-medium mb-2">Cargar archivos</label>

          <input
            type="file"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []).slice(0, 3); // máximo 3 archivos, ajusta si quieres otro límite
              updateQuestion(index, { ...question, files });
            }}
            disabled
            className="border rounded px-3 py-2"
          />

          {/* Lista simple de archivos cargados */}
          {question.files && question.files.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
              {question.files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}

          {/* Checkbox obligatorio */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id={`required-file-${index}`}
              checked={question.required || false}
              onChange={(e) =>
                updateQuestion(index, { ...question, required: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor={`required-file-${index}`} className="text-sm text-gray-700">
              ¿Es obligatorio subir archivo(s)?
            </label>
          </div>
        </div>
      )}



      {/* Tipo: Archivos */}
      {question.type === 'filedownload' && (
        <div>
          <label className="block font-medium mb-2">Deacargar archivos</label>

          <input
            type="file"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []).slice(0, 3); // máximo 3 archivos, ajusta si quieres otro límite
              updateQuestion(index, { ...question, files });
            }}
            className="border rounded px-3 py-2"
          />

          {/* Lista simple de archivos cargados */}
          {question.files && question.files.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
              {question.files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          )}

          {/* Checkbox obligatorio */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id={`required-file-${index}`}
              checked={question.required || false}
              onChange={(e) =>
                updateQuestion(index, { ...question, required: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor={`required-file-${index}`} className="text-sm text-gray-700">
              ¿Es obligatorio subir archivo(s)?
            </label>
          </div>
        </div>
      )}


      {question.type === 'rating' && (
        <div>
          <label className="block font-medium mb-2">Calificación</label>

          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => updateQuestion(index, { ...question, answer: star })}
                className={`text-2xl ${question.answer >= star ? 'text-yellow-400' : 'text-gray-300'
                  } focus:outline-none`}
                aria-label={`Calificación ${star} estrellas`}
                disabled
              >
                ★
              </button>
            ))}
          </div>

          {/* Checkbox obligatorio */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id={`required-rating-${index}`}
              checked={question.required || false}
              onChange={(e) =>
                updateQuestion(index, { ...question, required: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor={`required-rating-${index}`} className="text-sm text-gray-700">
              ¿Es obligatorio calificar?
            </label>
          </div>
        </div>
      )}



      {question.type === 'date' && (
        <div>
          <label className="block font-medium mb-2">Fecha</label>

          <input
            type="date"
            value={question.answer || ''}
            onChange={(e) =>
              updateQuestion(index, { ...question, answer: e.target.value })
            }
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          {/* Checkbox obligatorio */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id={`required-date-${index}`}
              checked={question.required || false}
              onChange={(e) =>
                updateQuestion(index, { ...question, required: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor={`required-date-${index}`} className="text-sm text-gray-700">
              ¿Es obligatorio seleccionar fecha?
            </label>
          </div>
        </div>
      )}



      {question.type === 'time' && (
        <div>
          <label className="block font-medium mb-2">Hora</label>

          <input
            type="time"
            value={question.answer || ''}
            onChange={(e) =>
              updateQuestion(index, { ...question, answer: e.target.value })
            }
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          {/* Checkbox obligatorio */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id={`required-time-${index}`}
              checked={question.required || false}
              onChange={(e) =>
                updateQuestion(index, { ...question, required: e.target.checked })
              }
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor={`required-time-${index}`} className="text-sm text-gray-700">
              ¿Es obligatorio seleccionar hora?
            </label>
          </div>
        </div>
      )}



    </div>
  )
}

export default SortableItem;
