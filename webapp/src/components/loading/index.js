import React from 'react';
import './styles.css';

/**
 * Componente que muestra un modal de carga (loading).
 * @returns {JSX.Element} - Un modal con un spinner de carga.
 */
class Component extends React.Component {
  render() {
    return (
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        style={{ zIndex: 999, display: 'block' }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div
            className="modal-content"
            style={{
              backgroundColor: 'transparent',
              border: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Component;
