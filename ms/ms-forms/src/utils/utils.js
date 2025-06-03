const jwt = require("./jwt");
const responses = require("./response");

module.exports.hashPassword = (password) => {
    return password;
};

module.exports.validatePayload = function (schema, payload, allowUnknown = false) {
    const result = schema.validate(payload, {
        allowUnknown: allowUnknown
    });
    if (result.error) {
        let errors = result.error.details.map(p => ({
            message: p.message.replace('\"', "").replace('\"', ""),
            type: p.type
        }));
        return responses.badRequest(
            message = '¡Ups! Error en la solicitud',
            errors = errors
        );
    }
    return null;
}

module.exports.buildUuid = function () {
    function generateUniqueNumber(n) {
        if (typeof n !== 'number' || n < 6 || !Number.isInteger(n)) {
            throw new Error("El parámetro n debe ser un entero mayor o igual a 6.");
        }
        // Dividir la longitud: usar la mitad (redondeada hacia arriba) para la parte epoch,
        // y el resto para la parte aleatoria.
        const epochDigits = Math.ceil(n / 2);
        const randomDigits = n - epochDigits;
        // Parte epoch: se toma el timestamp actual en milisegundos y se extraen los últimos epochDigits dígitos.
        const epochStr = Date.now().toString();
        let epochPart = epochStr.slice(-epochDigits).padStart(epochDigits, '0');
        // Parte aleatoria: generar un entero aleatorio en el rango [0, 10^(randomDigits))
        // y formatearlo con ceros a la izquierda.
        const maxRandom = Math.pow(10, randomDigits);
        const randomInt = Math.floor(Math.random() * maxRandom);
        let randomPart = randomInt.toString().padStart(randomDigits, '0');
        // Concatenar ambas partes
        let result = epochPart + randomPart;
        // Ajustar en caso de que la concatenación exceda o no alcance n dígitos
        if (result.length > n) {
            result = result.slice(result.length - n);
        } else if (result.length < n) {
            result = result.padStart(n, '0');
        }
        // Si el primer dígito es "0", reemplazarlo por un dígito aleatorio entre 1 y 9.
        if (result[0] === '0') {
            const newFirstDigit = (Math.floor(Math.random() * 9) + 1).toString();
            result = newFirstDigit + result.slice(1);
        }
        return Number(result);
    }
    return generateUniqueNumber(10);
}

module.exports.getAuthorization = function (event) {
    return event.headers?.Authorization || event.headers?.authorization || event.authorizationToken;
}

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

