import React, { Component } from 'react';
import PropTypes from 'prop-types'; // Para validación de props
import './styles.css';

/**
 * Componente personalizado para un select con validaciones y manejo de cambios.
 * 
 * @returns {JSX.Element} - Un campo de selección con opciones.
 */
class Component extends React.Component {

    render() {
        const { 
            schema, 
            data, 
            handleSetChangeInputEvent, 
            disabled, 
            errors, 
            value 
        } = this.props;

        const errorMessage = errors[schema.id];

        return (
            <div className="form-group">
                <label htmlFor={schema.id} className="form-label control-label">
                    {schema.name} {schema.required ? '(*)' : ''}
                </label>

                <select
                    id={schema.id}
                    name={schema.id}
                    value={data}
                    onChange={handleSetChangeInputEvent}
                    disabled={disabled}
                    className="form-select"
                    autoComplete="off"
                    required={schema.required}
                    defaultValue="" // defaultValue para evitar problemas con controlled/uncontrolled components
                >
                    <option value="">Seleccionar...</option>
                    {value && value.map(item => (
                        <option key={item.code} value={item.code}>
                            {item.name}
                        </option>
                    ))}
                </select>

                {/* Mostrar error si existe */}
                {errorMessage && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                        {errorMessage}
                    </div>
                )}
            </div>
        );
    }
}

// Validación de tipos con PropTypes
Component.propTypes = {
    schema: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
        placeholder: PropTypes.string,
        required: PropTypes.bool,
        maxLength: PropTypes.number,
        minLength: PropTypes.number,
    }).isRequired,
    data: PropTypes.string.isRequired,
    handleSetChangeInputEvent: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    errors: PropTypes.object.isRequired,
    value: PropTypes.array.isRequired,
};

export default Component;
