import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import Input from '../../../../components/input';
import ButtonIcon from '../../../../components/button-icon';
import Textarea from '../../../../components/textarea';
import { buildPayloadFromForm, resetFormValues, stopPropagation } from '../../../../utils/utils';

class Component extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isValidForm: false,
            errorMessage: null,
            successMessage: null,
            data: {
                id: {
                    value: '',
                    errors: []
                },
                question: {
                    value: '',
                    errors: []
                },
                answerCorrect: {
                    value: '',
                    errors: []
                },
                options: {
                    value: '',
                    errors: []
                }
            },
            options: [],
            images: []
        };

        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);

        this.addOptionItem = this.addOptionItem.bind(this);
        this.removeOptionItem = this.removeOptionItem.bind(this);
    }

    async propagateState() { }

    async updateState(payload) {
        this.setState({ ...payload }, () => this.propagateState());
    }

    async handleInputChange(event, errors) {
        stopPropagation(event);
        const { name, value } = event.target;
        const { data } = this.state;
        data[name].value = value;
        data[name].errors = errors;
        let isValidForm = Object.keys(data).filter(key => data[key].value.length === 0 || data[key].errors.length > 0).length === 0;
        this.updateState({ data, isValidForm });
    }

    addItem(event) {
        const { images, data, options } = this.state;
        const payload = buildPayloadFromForm(data);
        payload.options = options;
        payload.id = Number(payload.id);
        images.push(payload);
        this.updateState({
            images: images,
            data: resetFormValues(data),
            isValidForm: true,
            options: []
        });
        this.props.onSubmit({
            questions: images
        });
    }

    removeItem(event, index) {
        const { images } = this.state;
        images.splice(index, 1);
        this.updateState({
            images,
            isValidForm: images.length > 0
        });
        this.props.onSubmit({
            questions: images
        });
    }

    addOptionItem(event) {
        const { data, options } = this.state;
        options.push(data.options.value);
        data.options.value = '';
        this.updateState({
            options: options,
            data: data
        });
    }

    removeOptionItem(event, index) {
        const { options } = this.state;
        options.splice(index, 1);
        this.updateState({
            options,
            isValidForm: false
        });
    }


    render() {
        return (
            <>
                <div className="row mb-2">
                    <div className="col-6 col-md-12 mb-2">
                        <Input
                            value={this.state.data.id.value}
                            schema={{
                                name: 'ID',
                                placeholder: 'Número de secuencia. Ejemplo: 1',
                                id: 'id',
                                type: 'number',
                                required: false,
                                minLength: 0,
                                maxLength: 200,
                                autoComplete: 'off'
                            }}
                            onChange={this.handleInputChange}
                            disabled={this.state.loading}
                        />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-6 col-md-12 mb-2">
                        <Input
                            value={this.state.data.question.value}
                            schema={{
                                name: 'Pregunta',
                                placeholder: '',
                                id: 'question',
                                type: 'text',
                                required: false,
                                minLength: 0,
                                maxLength: 200,
                                autoComplete: 'off'
                            }}
                            onChange={this.handleInputChange}
                            disabled={this.state.loading}
                        />
                    </div>
                    <div className="col-6 col-md-12 mb-2">
                        <Input
                            value={this.state.data.answerCorrect.value}
                            schema={{
                                name: 'Respuesta correcta',
                                placeholder: '',
                                id: 'answerCorrect',
                                type: 'text',
                                required: false,
                                minLength: 0,
                                maxLength: 200,
                                autoComplete: 'off'
                            }}
                            onChange={this.handleInputChange}
                            disabled={this.state.loading}
                        />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-9 col-md-9 mb-2">
                        <Input
                            value={this.state.data.options.value}
                            schema={{
                                name: 'Opción',
                                placeholder: '',
                                id: 'options',
                                type: 'text',
                                required: false,
                                minLength: 0,
                                maxLength: 200,
                                autoComplete: 'off'
                            }}
                            onChange={this.handleInputChange}
                            disabled={this.state.loading}
                        />
                    </div>
                    <div className="col-3 col-md-3 mb-2">
                        <div className="form-group">
                            <label htmlFor={""} className={`form-label control-label`}>
                                <span className='invalid-feedback' style={{ display: 'inline' }}>*</span>
                            </label>
                            <ButtonIcon onClick={this.addOptionItem} className="form-control">
                                <i className="fa-solid fa-plus"></i>
                            </ButtonIcon>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 mb-2">
                        <ol className="list-group list-group-numbered">
                            {this.state.options.map((item, index) => {
                                return (<li className="list-group-item d-flex justify-content-between align-items-start">
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">{item}</div>
                                    </div>
                                    <span className="badge bg-primary rounded-pill">
                                        <i className="fa-solid fa-trash" onClick={(e) => this.removeOptionItem(e, index)}></i>
                                    </span>
                                </li>);
                            })}
                        </ol>
                    </div>
                </div>
                <div className="col-10 col-md-12 mb-2">
                    <ButtonIcon onClick={this.addItem} disabled={this.state.isValidForm === false || this.state.loading}>
                        <i className="fa-solid fa-plus"></i>
                    </ButtonIcon>
                </div>
                <div className="row mb-2">
                    <div className="col-12 col-md-12 mb-2">
                        <ol className="list-group list-group-numbered">
                            {this.state.images.map((item, index) => {
                                return (<li className="list-group-item d-flex justify-content-between align-items-start">
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">{item.id}</div>
                                        <div className="fw-bold">{item.question}</div>
                                        <div className="fw-bold">{item.answerCorrect}</div>
                                        <div className="fw-bold">{'Opciones:'}</div>
                                        <div className="fw-bold">{item.options.map((option, index1) => <div key={index1} className="fw-bold">{option}</div>)}</div>
                                    </div>
                                    <span className="badge bg-primary rounded-pill">
                                        <i className="fa-solid fa-trash" onClick={(e) => this.removeItem(e, index)}></i>
                                    </span>
                                </li>);
                            })}
                        </ol>
                    </div>
                </div>
            </>
        );
    }
}
export default Component;
