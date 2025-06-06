/**
 * Convierte snake_case a camelCase.
 */
function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Determina si un string es una fecha ISO válida.
 */
function isISODateString(value) {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/.test(value);
}

const esFechaValida = (valor) => {
    return valor instanceof Date && !isNaN(valor.getTime());
};

/**
 * Elimina duplicados snake_case, convierte claves a camelCase,
 * y maneja fechas, números, booleanos, null, strings, arrays y objetos anidados.
 * 
 * @param {*} data - El objeto o array a limpiar
 * @param {Object} [options]
 * @param {boolean} [options.parseDates=false] - Si true, convierte strings ISO a objetos Date
 * @returns {*}
 */
function removeSnakeCaseDuplicates(data, options = {}) {
    const { parseDates = true } = options;

    if (Array.isArray(data)) {
        return data.map(item => removeSnakeCaseDuplicates(item, options));
    } else if (typeof data === 'object' && data !== null) {

        if (esFechaValida(data)) {
            return data;
        }
        
        const cleaned = {};

        // Primero, construimos un mapa con claves camelCase
        for (const [key, value] of Object.entries(data)) {
            const camelKey = toCamelCase(key);

            // Si ya existe la clave camelCase, se prefiere esa y se ignora la snake_case
            if (camelKey in cleaned) continue;

            // Recursivo para objetos/arrays
            let cleanedValue = removeSnakeCaseDuplicates(value, options);

            // Si es string ISO y parseDates, convertir a Date
            if (parseDates && esFechaValida(cleanedValue)) {
                const dateValue = new Date(cleanedValue);
                if (!isNaN(dateValue)) cleanedValue = dateValue;
            }

            cleaned[camelKey] = cleanedValue;
        }

        return cleaned;
    }

    // valores primitivos: number, boolean, null, string, Date
    return data;
}

module.exports = removeSnakeCaseDuplicates;
