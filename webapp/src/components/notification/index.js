import React from 'react';
import PropTypes from 'prop-types';  // Para validar props
import './styles.css';

/**
 * Componente que muestra notificaciones con diferentes tipos (info, warning, success, error).
 * 
 * @returns {JSX.Element} - Notificación con mensaje, tipo y color correspondientes.
 */
class Component extends React.Component {

    // Función para obtener el nombre del tipo de notificación
    getNotTypeName(type) {
        const notificationTypes = {
            info: 'Información',
            warning: 'Precaución',
            success: 'Exitoso',
            error: 'Error',
        };
        return notificationTypes[type] || 'Información';
    }

    // Función para obtener el color del tipo de notificación
    getNotColor(type) {
        const notificationColors = {
            info: 'bg-info',
            warning: 'bg-warning',
            success: 'bg-success',
            error: 'bg-danger',
        };
        return notificationColors[type] || 'bg-info';
    }

    render() {
        const {
            show = false,
            type = 'info',
            message = '',
            handleShowNotification,
        } = this.props;

        return (
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 999 }}>
                <div
                    className={`toast ${show ? 'show' : 'hide'} ${this.getNotColor(type)}`}
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                >
                    <div className="toast-header">
                        <strong className="me-auto">{this.getNotTypeName(type)}</strong>
                        <small>Ahora</small>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="toast"
                            aria-label="Close"
                            onClick={handleShowNotification}
                        ></button>
                    </div>
                    <div className="toast-body">
                        {message}
                    </div>
                </div>
            </div>
        );
    }
}

// Definimos los tipos de las props para mayor robustez
Component.propTypes = {
    show: PropTypes.bool,
    type: PropTypes.oneOf(['info', 'warning', 'success', 'error']),
    message: PropTypes.string,
    handleShowNotification: PropTypes.func.isRequired,
};

export default Component;
