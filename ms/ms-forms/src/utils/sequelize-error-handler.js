const {
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError
} = require('sequelize');
const { CustomError } = require('../errors/errors');

function handleSequelizeError(error) {
    // Unique constraint
    if (error instanceof UniqueConstraintError || error.name === 'UniqueConstraintError') {
        const field = error.errors?.[0]?.path || 'campo';
        const value = error.errors?.[0]?.value || '';
        const userMessage = `Ya existe un registro con el mismo valor en el campo '${field}'.`;
        return new CustomError(userMessage, 400, error);
    }

    // Validaciones generales de Sequelize
    if (error instanceof ValidationError || error.name === 'ValidationError') {
        const messages = error.errors.map(e => e.message).join('; ');
        const userMessage = `Se encontraron errores de validación en los datos proporcionados: ${messages}`;
        return new CustomError(userMessage, 400, error);
    }

    // Clave foránea inválida
    if (error instanceof ForeignKeyConstraintError || error.name === 'ForeignKeyConstraintError') {
        const userMessage = 'No se puede realizar la operación porque los datos relacionados no existen o no son válidos.';
        return new CustomError(userMessage, 400, error);
    }

    // Otro error específico de Sequelize
    if (error.name?.startsWith('Sequelize')) {
        const userMessage = 'Ocurrió un error en la base de datos. Por favor, intente nuevamente o contacte al soporte.';
        return new CustomError(userMessage, 500, error);
    }

    // Error desconocido
    const fallbackMessage = 'Ocurrió un error inesperado al procesar su solicitud. Intente nuevamente más tarde.';
    return new CustomError(fallbackMessage, 500, error);
}

module.exports = { handleSequelizeError };
