import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import Input from '../../../../components/input';
import Textarea from '../../../../components/textarea';
import PrimaryButton from '../../../../components/button-primary';
import { buildPayloadFromForm, stopPropagation, transformPayloadToStructuredState } from '../../../../utils/utils';

class Component extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isValidForm: false,
            errorMessage: null,
            successMessage: null,
            data: {
                title: {
                    value: '',
                    errors: []
                },
                description: {
                    value: '',
                    errors: []
                },
                imageUrls: {
                    value: '',
                    errors: []
                },
                videoUrls: {
                    value: '',
                    errors: []
                }
            }
        };
        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const data = transformPayloadToStructuredState(this.props.item);
        this.updateState({
            data: data
        });
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

    async handleSubmit(event) {
        stopPropagation(event);
        const { data } = this.state;
        const form = document.getElementById('formCreate');
        const isValid = form.checkValidity();
        const isValidForm = Object.keys(data).filter(key => data[key].errors.length > 0).length === 0;
        if (isValid && isValidForm) {
            try {
                this.updateState({ loading: true });
                const payload = buildPayloadFromForm(data);
                payload.imageUrls = [payload.imageUrls];
                payload.videoUrls = [payload.videoUrls];
                payload.createdAt = new Date().toISOString();
                payload.statusId = "ACTIVO";
                const response = await this.props.onSubmit(payload);
                this.updateState({
                    successMessage: response.message,
                    errorMessage: null,
                });
            } catch (err) {
                this.updateState({
                    errorMessage: err.message,
                    successMessage: null
                });
            } finally {
                this.updateState({ loading: false });
            }
        }
    }


    render() {
        const { onClose } = this.props;
        return (
            <>
                <div className="modal-body">
                    {this.state.errorMessage && <div className="alert alert-danger" role="alert"><p className='p-error'>{this.state.errorMessage}</p></div>}
                    {this.state.successMessage && <div className="alert alert-success" role="alert"><p className='p-success'>{this.state.successMessage}</p></div>}
                    <form id="formCreate" className="needs-validation form" onSubmit={this.handleSubmit} autoComplete="off" noValidate>
                        <div className="row mb-2">
                            <div className="col-12 col-md-12 mb-2">
                                <Input
                                    value={this.state.data.title.value}
                                    schema={{
                                        name: 'Título',
                                        placeholder: '',
                                        id: 'title',
                                        type: 'text',
                                        required: true,
                                        minLength: 0,
                                        maxLength: 200,
                                        autoComplete: 'off'
                                    }}
                                    onChange={this.handleInputChange}
                                    disabled={this.state.loading}
                                />
                            </div>
                            <div className="col-12 col-md-12">
                                <Textarea
                                    value={this.state.data.description.value}
                                    schema={{
                                        name: 'Descripción',
                                        placeholder: '',
                                        id: 'description',
                                        type: 'text',
                                        required: false,
                                        minLength: 0,
                                        maxLength: 500,
                                        autoComplete: 'off'
                                    }}
                                    onChange={this.handleInputChange}
                                    disabled={this.state.loading}
                                />
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-12 col-md-12 mb-2">
                                <Input
                                    value={this.state.data.imageUrls.value}
                                    schema={{
                                        name: 'Imágen',
                                        placeholder: '',
                                        id: 'imageUrls',
                                        type: 'text',
                                        required: true,
                                        minLength: 1,
                                        maxLength: 1000,
                                        autoComplete: 'off'
                                    }}
                                    onChange={this.handleInputChange}
                                    disabled={this.state.loading}
                                />
                            </div>
                            <div className="col-12 col-md-12">
                                <Input
                                    value={this.state.data.videoUrls.value}
                                    schema={{
                                        name: 'Vídeo',
                                        placeholder: '',
                                        id: 'videoUrls',
                                        type: 'text',
                                        required: true,
                                        minLength: 1,
                                        maxLength: 1000,
                                        autoComplete: 'off'
                                    }}
                                    onChange={this.handleInputChange}
                                    disabled={this.state.loading}
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Cancelar</button>
                    <PrimaryButton
                        text={'Procesar'}
                        type={'button'}
                        onClick={this.handleSubmit}
                        disabled={this.state.isValidForm === false || this.state.loading}
                        showText={true}
                        loading={this.state.loading}
                        textLoading={'procesando...'}></PrimaryButton>

                </div>
            </>
        );
    }
}

Component.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default Component;
