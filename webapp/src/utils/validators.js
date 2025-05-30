// validators.js

export const isEmailValid = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isPasswordStrong = (password) => {
  // Al menos 8 caracteres, una mayúscula, una minúscula y un número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

export const isEmpty = (value) => {
  return !value || value.trim() === '';
};

export const validateUserForm = ({ name, email, password }) => {
  const errors = {};

  if (isEmpty(name)) errors.name = 'El nombre es requerido.';
  if (!isEmailValid(email)) errors.email = 'El correo no es válido.';
  if (!isPasswordStrong(password)) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.';
  }

  return errors;
};


export const validateFieldFromProps = (value, input) => {
  const trimmedValue = typeof value === 'string' ? value.trim() : value;

  // Requerido
  if (input.required && (!trimmedValue && trimmedValue !== 0)) {
    return 'Este campo es obligatorio';
  }

  // Validación de correo electrónico
  if (input.type === 'email' && trimmedValue) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedValue)) {
      return 'Debe ser un correo electrónico válido';
    }
  }

  // Número
  if (input.type === 'number') {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      return 'Debe ser un número';
    }

    if (input.min !== undefined && input.min >= 0 && numericValue < parseFloat(input.min)) {
      return `El valor mínimo permitido es ${input.min}`;
    }

    if (input.max !== undefined && input.max >= 0 && numericValue > parseFloat(input.max)) {
      return `El valor máximo permitido es ${input.max}`;
    }
  }

  // Longitud y patrón (solo strings)
  if (typeof value === 'string') {
    if (input.minLength !== undefined && input.minLength >= 0 && value.length < input.minLength) {
      return `Debe tener al menos ${input.minLength} caracteres`;
    }

    if (input.maxLength !== undefined && input.maxLength >= 0 && value.length > input.maxLength) {
      return `Debe tener como máximo ${input.maxLength} caracteres`;
    }

    //if (input.size !== undefined && input.size >= 0 && value.length > input.size) {
    //  return `Debe tener como máximo ${input.size} caracteres`;
    //}

    // Patrón personalizado
    if (input.pattern) {
      const regex = new RegExp(input.pattern);
      if (!regex.test(value)) {
        return 'El formato no es válido';
      }
    }
  }

  return ""; // No hay errores
};