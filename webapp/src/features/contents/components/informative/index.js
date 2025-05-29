import React from 'react';
import './styles.css';
import Textarea from '../../../../components/textarea';
import ButtonIcon from '../../../../components/button-icon';
import { resetFormValues, stopPropagation } from '../../../../utils/utils';

class Component extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isValidForm: false,
            errorMessage: null,
            successMessage: null,
            data: {
                url: {
                    value: '',
                    errors: []
                },
            },
            images: []
        };

        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
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
        const isValidForm = Object.keys(data).filter(key => data[key].errors.length > 0).length === 0;
        this.updateState({ data, isValidForm });
    }

    addItem(event) {
        const { images, data } = this.state;
        if (data.url.value.length === 0) {
            return;
        }
        if (images.length === 0) {
            images.push(data.url.value);
        } else {
            images[0] = data.url.value;
        }

        this.updateState({
            images: images,
            data: resetFormValues(data),
            isValidForm: false
        });
        this.props.onSubmit({
            text: images[0]
        });
    }

    removeItem(event, index) {
        const { images } = this.state;
        images.splice(index, 1);
        this.updateState({
            images,
            isValidForm: false
        });
        this.props.onSubmit({
            text: images.length > 0 ? images[0] : ""
        });
    }


    render() {
        return (
            <>
                <div className="row mb-2">
                    <div className="col-10 col-md-12 mb-2">
                        <Textarea
                            value={this.state.data.url.value}
                            schema={{
                                name: 'Texto informativo',
                                placeholder: '',
                                id: 'url',
                                type: 'text',
                                required: true,
                                minLength: 0,
                                maxLength: 500,
                                autoComplete: 'off'
                            }}
                            onChange={this.handleInputChange}
                            disabled={this.state.loading}
                        />
                    </div>
                    <div className="col-10 col-md-12 mb-2">
                        <ButtonIcon onClick={this.addItem} disabled={this.state.isValidForm === false || this.state.loading}>
                            <i className="fa-solid fa-plus"></i>
                        </ButtonIcon>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col-12 col-md-12 mb-2">
                        <ol className="list-group list-group-numbered">
                            {this.state.images.map((item, index) => {
                                return (<li key={index} className="list-group-item d-flex justify-content-between align-items-start">
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">{item}</div>
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
