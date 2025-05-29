import React from 'react';
import './styles.css';

class Component extends React.Component {
    render() {
        const {
            className = '',
            type = 'button',
            disabled = false,
            loading = false,
            showText = false,
            textLoading = 'Cargando...',
            children = null,
            ...props
        } = this.props;

        return (
            <button
                className={`btn btn-primary ${className}`}
                type={type}
                disabled={disabled || loading} // Deshabilita el botón si está cargando
                {...props}
            >
                {loading ? (
                    <div>
                        <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                        ></span>
                        <span
                            className={`${showText ? 'visually-hidden' : ''}`}
                            role="status"
                            style={{ marginLeft: '5px' }}
                        >
                            {textLoading}
                        </span>
                    </div>
                ) : (
                    children
                )}
            </button>
        );
    }
}

export default Component;
