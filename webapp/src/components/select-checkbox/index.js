import React from 'react';
import './styles.css';

/**
 * Componente personalizado para seleccionar múltiples opciones con checkboxes dentro de un dropdown.
 */
class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            show: false,
        };
    }

    // Actualiza el estado con los checkboxes seleccionados
    componentDidMount() {
        this.updateCheckboxData(this.props);
    }

    // Actualiza la lista de checkboxes con valores iniciales
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data || prevProps.value !== this.props.value) {
            this.updateCheckboxData(this.props);
        }
    }

    // Función que actualiza el estado con la data de los checkboxes
    updateCheckboxData(props) {
        if (props.data) {
            const updatedData = props.data.map(p => ({
                ...p,
                checked: props.value ? props.value.includes(p.code) : false,
            }));
            this.setState({ data: updatedData });
        }
    }

    // Maneja el cambio de estado de un checkbox
    handleOnChange = (event, index) => {
        const { checked } = event.target;
        const updatedData = [...this.state.data];
        updatedData[index].checked = checked;
        this.setState({ data: updatedData });

        if (this.props.handleSetChangeInputEvent) {
            event.target.name = this.props.schema.id;
            event.target.value = updatedData.filter(p => p.checked).map(p => p.code);
            this.props.handleSetChangeInputEvent(event);
        }
    };

    // Maneja la visibilidad del dropdown
    handleShow = () => {
        this.setState(prevState => ({ show: !prevState.show }));
    };

    render() {
        const { schema, errors, disabled } = this.props;
        const { data, show } = this.state;

        if (!data.length) {
            return null;
        }

        return (
            <div className="form-group">
                <label htmlFor={schema.id} className="form-label control-label">
                    {schema.name} {schema.required ? '(*)' : ''}
                </label>

                <div className="dropdown w-100">
                    <button
                        className="btn btn-primary dropdown-toggle w-100 text-start"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded={show ? 'true' : 'false'}
                        onClick={this.handleShow}
                        disabled={disabled}
                    >
                        Selección múltiple
                    </button>
                    <ul className={`dropdown-menu w-100 ${show ? 'show' : 'hide'}`} aria-labelledby="dropdownMenuButton1">
                        {data.map((item, index) => (
                            <li key={item.code}>
                                <a className="dropdown-item" href="#">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={item.checked}
                                            id={item.code}
                                            name={item.code}
                                            onChange={(e) => this.handleOnChange(e, index)}
                                            disabled={disabled}
                                        />
                                        <label className="form-check-label" htmlFor={item.code}>
                                            {item.name}
                                        </label>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {errors && errors[schema.id] && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                        {errors[schema.id]}
                    </div>
                )}
            </div>
        );
    }
}

export default Component;
