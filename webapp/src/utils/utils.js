export function stopPropagation(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.key === 'Enter' || event.target?.keyCode === 13 || event.target?.key === 'Enter') {
            return;
        }
    }
}

export function resetFormValues(fields) {
    const resetState = {};
    Object.keys(fields).forEach((key) => {
        resetState[key] = {};
        Object.keys(fields[key]).forEach((innerKey) => {
            if (Array.isArray(fields[key][innerKey])) {
                resetState[key][innerKey] = [];
            } else {
                resetState[key][innerKey] = '';
            }
        });
    });
    return resetState;
}

export function buildPayloadFromForm(fields) {
    const payload = {};
    Object.keys(fields).forEach((key) => {
        payload[key] = fields[key].value;
    });
    return payload;
}

export function truncateText(text, maxLength = 30) {
    if (typeof text !== 'string') return text;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export function transformPayloadToStructuredState(payload) {
    const structured = {};

    Object.keys(payload).forEach(key => {
        // Verifica si el valor es un array y asigna el primer elemento, sino el valor directo
        const value = Array.isArray(payload[key]) ? payload[key][0] : payload[key];

        structured[key] = {
            value: value,
            errors: []
        };
    });

    return structured;
}

export function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Invalid JWT token:', e);
        return null;
    }
}
