import React from 'react';
import './styles.css';

/**
 * Botón reutilizable con icono dinámico a la izquierda.
 * 
 * Props extra:
 * - icon (string | ReactNode): nombre de clase para el icono (ej. "bx bx-plus"), o un elemento React (ej. <MyIcon />)
 * - iconClassName (string): clases extra para el <i> del icono
 */
class ButtonComponent extends React.Component {
  render() {
    const {
      className = '',
      type = 'button',
      disabled = false,
      loading = false,
      textLoading = 'Procesando...',
      showText = false,
      text = '',
      icon,                // NUEVO: clase del icono (ej: "bx bx-plus") o componente React
      iconClassName = '',  // NUEVO: clases extra para el <i>
      ...props
    } = this.props;

    return (
      <button
        className={`btn btn-secondary flex items-center gap-2 ${className}`}
        type={type}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
            <span
              className={`${showText ? '' : 'visually-hidden'}`}
              role="status"
            >
              {textLoading}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Icono dinámico a la izquierda */}
            {icon &&
              (typeof icon === 'string' ? (
                <i className={`${icon} ${iconClassName}`} aria-hidden="true"></i>
              ) : (
                icon // Si es un ReactNode
              ))
            }
            <span>{text}</span>
          </div>
        )}
      </button>
    );
  }
}

export default ButtonComponent;