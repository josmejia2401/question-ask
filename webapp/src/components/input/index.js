import React from 'react';
import Joi from 'joi';
import './styles.css';
/**
 * Componente Input personalizado.
 * @param {Object} props - Las propiedades del componente.
 * @returns {JSX.Element} - Un campo de entrada personalizado con validación y manejo de errores.
 */
class Component extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: []
        };
        this.limpiarRegex = this.limpiarRegex.bind(this);
        this.validarDatosConJoi = this.validarDatosConJoi.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    // Método para limpiar y validar el formato de una expresión regular.
    limpiarRegex(regexStr) {
        return regexStr && String(regexStr).startsWith('/') && String(regexStr).endsWith('/')
            ? String(regexStr).slice(1, -1)  // Elimina los delimitadores '/' si están presentes.
            : regexStr;  // Devuelve la cadena original si no tiene delimitadores.
    };

    /**
     * Valida los datos ingresados según el esquema definido en props.schema.
     * @returns {Object|null} - Devuelve un objeto con errores o null si no hay errores.
     */
    validarDatosConJoi(event) {
        const { schema } = this.props;
        let joiSchema = Joi.string();
        if (schema.required === true) {
            joiSchema = joiSchema.required();
        } else {
            joiSchema = joiSchema.allow('').optional();
        }        if (schema.minLength) joiSchema = joiSchema.min(schema.minLength);
        if (schema.maxLength) joiSchema = joiSchema.max(schema.maxLength);
        if (schema.pattern) joiSchema = joiSchema.pattern(new RegExp(schema.pattern));
        if (schema.type === 'number') joiSchema = Joi.number();
        if (schema.min !== undefined) joiSchema = joiSchema.min(schema.min);
        if (schema.max !== undefined) joiSchema = joiSchema.max(schema.max);
        const validation = joiSchema.validate(event.target.value, { abortEarly: false });
        if (validation.error) {
            const details = validation.error.details.map((err) => {
                console.log(err);
                switch (err.type) {
                    case "string.base":
                        err.message = `${schema.name} debe ser de tipo texto`;
                        break;
                    case "string.required":
                        err.message = `${schema.name} es requerido`;
                        break;
                    case "string.empty":
                        err.message = `${schema.name} no puede ser vacío`;
                        break;
                    case "string.min":
                        err.message = `${schema.name} debe tener al menos ${err.context.limit} caracteres`;
                        break;
                    case "string.max":
                        err.message = `${schema.name} debe tener como máximo ${err.context.limit} caracteres`;
                        break;
                    case "any.empty":
                        err.message = `${schema.name} no puede ser vacío`;
                        break;
                    case "any.min":
                        err.message = `${schema.name} debe tener al menos ${err.context.limit} caracteres`;
                        break;
                    case "any.required":
                        err.message = `${schema.name} es requerido`;
                        break;
                    case "any.max":
                        err.message = `${schema.name} debe tener como máximo ${err.context.limit} caracteres`;
                        break;
                    case "string.pattern.base":
                        err.message = `${schema.name} no cumple con el formato requerido`;
                        break;
                    default:
                        break;
                }
                return err.message;
            });
            this.setState({
                errors: details
            });
            return details;
        }
        this.setState({
            errors: []
        });
        return [];
    };

    onChange(event) {
        const errors = this.validarDatosConJoi(event);
        if (this.props.onChange) {
            this.props.onChange(event, errors);
        }
    }

    render() {
        const {
            schema,
            value,
            disabled,
        } = this.props;
        const {
            id, name, type, placeholder, maxLength, minLength, max, min, size, pattern, required, step, autoComplete
        } = schema;
        return (
            <div className="form-group">
                <label htmlFor={id} className={`form-label control-label`}>
                    {name}{required && <span className='invalid-feedback' style={{ display: 'inline' }}>*</span>}
                </label>
                <input
                    type={type}
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    value={value}
                    maxLength={maxLength}
                    minLength={minLength}
                    max={max}
                    min={min}
                    size={size}
                    pattern={this.limpiarRegex(pattern)}
                    onChange={this.onChange}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    className={`form-control ${required && this.state.errors.length > 0 && 'border border-danger'}`}
                    required={required}
                    step={step}
                />
                {this.state.errors && this.state.errors.length > 0 && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                        {this.state.errors[0]}
                    </div>
                )}
            </div>
        );
    }
}

export default Component;
