module.exports.success = (data) => ({
    code: 200,
    message: 'Operación exitosa',
    data: data
});

module.exports.created = (data) => ({
    code: 201,
    message: 'Recurso creado correctamente',
    data
});

module.exports.badRequest = (message) => ({
    code: 400,
    message: message ?? 'Solicitud incorrecta'
});

module.exports.unAuthorized = (message) => ({
    code: 401,
    message: message ?? 'No autorizado'
});

module.exports.forbidden = (message) => ({
    code: 403,
    message: message ?? 'Prohibido'
});

module.exports.internalServerError = (message) => ({
    code: 500,
    message: message ?? 'Error interno del servidor'
});

module.exports.buildError = (error) => {
    if (error.name === 'CustomError') {
        switch (error.code) {
            case 400:
                return this.badRequest(error.message);
            case 401:
                return this.unAuthorized(error.message);
            case 403:
                return this.forbidden(error.message);
            case 500:
            default:
                return this.internalServerError(error.message);
        }
    }
    return this.internalServerError(error.message);
};
