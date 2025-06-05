function isSnakeCase(key) {
    return key.includes('_');
}

function toCamelCase(snake) {
    return snake.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function removeSnakeCaseDuplicates(data) {
    if (Array.isArray(data)) {
        return data.map(removeSnakeCaseDuplicates);
    } else if (typeof data === 'object' && data !== null) {
        const cleaned = {};

        for (const [key, value] of Object.entries(data)) {
            const camelKey = toCamelCase(key);

            // Si ya existe la versión camelCase, omitir la snake_case
            if (isSnakeCase(key) && camelKey in data) {
                continue;
            }

            // Recursivamente limpiar el valor
            cleaned[key] = removeSnakeCaseDuplicates(value);
        }

        return cleaned;
    }

    return data; // valores primitivos
}

module.exports = removeSnakeCaseDuplicates;
