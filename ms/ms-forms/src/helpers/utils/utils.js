
module.exports.isEmpty = function (value) {
    // Comprobar si el valor es undefined, null o vacío
    if (value === undefined || value === null) {
        return true;
    }

    // Si es una cadena, comprobar si está vacía
    if (typeof value === 'string' && value.trim() === '') {
        return true;
    }
    // Si es un array, comprobar si está vacío
    if (Array.isArray(value) && value.length === 0) {
        return true;
    }
    // Si es un objeto, comprobar si tiene propiedades (no vacío)
    if (typeof value === 'object' && Object.keys(value).length === 0) {
        return true;
    }
    return false;
}

