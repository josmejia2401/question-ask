import * as React from 'react';
import "./styles.css";
import Input from '../../components/input';
import InputGroup from '../../components/input-group';
import PrimaryButton from '../../components/button-primary';
import { buildPayloadFromForm, stopPropagation, transformPayloadToStructuredState } from '../../utils/utils';
import { getRelativeTimeDescription } from '../../utils/formatters';
import { findById, updateById } from './api';
import { AuthStore } from '../../store';

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isValidForm: false,
            errorMessage: null,
            successMessage: null,
            originalData: {},
            data: {
                id: {
                    value: '',
                    errors: []
                },
                firstName: {
                    value: '',
                    errors: []
                },
                lastName: {
                    value: '',
                    errors: []
                },
                email: {
                    value: '',
                    errors: []
                },
                phoneNumber: {
                    value: '',
                    errors: []
                },
                username: {
                    value: '',
                    errors: []
                },
                password: {
                    value: '',
                    errors: []
                },
                statusId: {
                    value: '',
                    errors: []
                },
                createdAt: {
                    value: '',
                    errors: []
                }
            },
        };
        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleLoadData = this.handleLoadData.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.handleLoadData();
    }

    componentWillUnmount() { }

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

    handleSubmit(event) {
        stopPropagation(event);
        const { data, originalData } = this.state;
        const form = event.target;
        const isValid = form.checkValidity();
        const isValidForm = Object.keys(data).filter(key => data[key].errors.length > 0).length === 0;
        if (isValid && isValidForm) {
            this.updateState({
                isValidForm: isValidForm,
                loading: true,
                successMessage: null,
                errorMessage: null
            });
            const payload = { ...originalData.data, ...buildPayloadFromForm(data) };
            if (Object.keys(payload.healthData).length === 0) {
                payload.healthData = {
                    age: 0,
                    height: 0,
                };
            }
            // No se actualiza la pass
            delete payload.password;
            updateById(payload.id, payload).then(response => {
                this.updateState({
                    successMessage: response.message,
                    errorMessage: null,
                });
            }).catch(err => {
                this.updateState({
                    errorMessage: err.message,
                    successMessage: null
                });
            }).finally(() => {
                this.updateState({
                    loading: false
                });
            });
        }
    }

    handleLoadData(e) {
        stopPropagation(e);
        this.updateState({
            loading: true,
            errorMessage: null,
            successMessage: null
        });
        findById(AuthStore.getState().tokenInfo.keyid).then(response => {
            const data = transformPayloadToStructuredState(response.data);
            data.password = {
                value: '',
                errors: []
            };
            this.updateState({
                successMessage: null,
                errorMessage: null,
                data: data,
                originalData: response
            });
        }).catch(err => {
            this.updateState({
                errorMessage: err.message,
                successMessage: null
            });
        }).finally(() => {
            this.updateState({
                loading: false
            });
        });
    }

    render() {
        return (<div className="col py-3 panel-view">
            <section className="section container px-5" style={{ marginTop: '90px' }}>
                <div className="row" id="table-hover-row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <div style={{ flexDirection: "column", display: 'flex', width: '100%' }}>
                                    <div style={{ flexDirection: "row", display: 'flex', width: '100%' }}>
                                        <h4 className="card-title title-color">Perfil</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="row">
                                    <div className="col-md-3 border-right">
                                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                            <i className="fa-regular fa-user rounded-circle mt-5" style={{ fontSize: "70px" }}></i>
                                            <span className="font-weight-bold">{this.state.data.firstName.value} {this.state.data.lastName.value}</span>
                                            <span className="text-black-50">{this.state.data.email.value}</span>
                                            <span className="text-black-50">{'Se unió: '}{getRelativeTimeDescription(this.state.data.createdAt.value)}</span>
                                            <span></span>
                                        </div>
                                    </div>
                                    <div className="col-md-9 border-right">
                                        <div className="p-3 py-5">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h4 className="text-right">Información del perfil</h4>
                                            </div>
                                            {this.state.errorMessage && <div className="alert alert-danger" role="alert"><p className='p-error'>{this.state.errorMessage}</p></div>}
                                            {this.state.successMessage && <div className="alert alert-success" role="alert"><p className='p-success'>{this.state.successMessage}</p></div>}
                                            <form className="needs-validation form" onSubmit={this.handleSubmit} autoComplete="off" noValidate>
                                                <div className="row mb-2">
                                                    <div className="col-12 col-md-6 mb-2">
                                                        <Input
                                                            value={this.state.data.firstName.value}
                                                            schema={{
                                                                name: 'Nombres',
                                                                placeholder: '',
                                                                id: 'firstName',
                                                                type: 'text',
                                                                required: true,
                                                                minLength: 1,
                                                                maxLength: 100,
                                                                autoComplete: 'given-name'
                                                            }}
                                                            onChange={this.handleInputChange}
                                                            disabled={this.state.loading}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-6 mb-2">
                                                        <Input
                                                            value={this.state.data.lastName.value}
                                                            schema={{
                                                                name: 'Apellidos',
                                                                placeholder: '',
                                                                id: 'lastName',
                                                                type: 'text',
                                                                required: false,
                                                                minLength: 1,
                                                                maxLength: 100,
                                                                autoComplete: 'family-name'
                                                            }}
                                                            onChange={this.handleInputChange}
                                                            disabled={this.state.loading}
                                                        />
                                                    </div>
                                                </div>


                                                <div className="row mb-2">
                                                    <div className="col-12 col-md-4 mb-2">
                                                        <Input
                                                            value={this.state.data.email.value}
                                                            schema={{
                                                                name: 'Correo electrónico',
                                                                placeholder: '',
                                                                id: 'email',
                                                                type: 'email',
                                                                required: true,
                                                                minLength: 1,
                                                                maxLength: 100,
                                                                autoComplete: 'email'
                                                            }}
                                                            onChange={this.handleInputChange}
                                                            disabled={this.state.loading}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-4 mb-2">
                                                        <Input
                                                            value={this.state.data.phoneNumber.value}
                                                            schema={{
                                                                name: 'Número celular',
                                                                placeholder: '',
                                                                id: 'phoneNumber',
                                                                type: 'text',
                                                                required: true,
                                                                minLength: 1,
                                                                maxLength: 10,
                                                                autoComplete: 'phone',
                                                                pattern: "[3]{1}[0-9]{9}",
                                                            }}
                                                            onChange={this.handleInputChange}
                                                            disabled={this.state.loading}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-4 mb-2">
                                                        <Input
                                                            value={this.state.data.statusId.value}
                                                            schema={{
                                                                name: 'Estado',
                                                                placeholder: '',
                                                                id: 'statusId',
                                                                type: 'text',
                                                                required: true,
                                                                minLength: 1,
                                                                maxLength: 10,
                                                                autoComplete: 'off',
                                                            }}
                                                            onChange={this.handleInputChange}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mb-2">
                                                    <div className="col-12 col-md-6 mb-2">
                                                        <Input
                                                            value={this.state.data.username.value}
                                                            schema={{
                                                                name: 'Usuario',
                                                                placeholder: '',
                                                                id: 'username',
                                                                type: 'text',
                                                                required: true,
                                                                minLength: 6,
                                                                maxLength: 50,
                                                                autoComplete: 'username'
                                                            }}
                                                            onChange={this.handleInputChange}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <InputGroup
                                                            value={this.state.data.password.value}
                                                            schema={{
                                                                name: 'Contraseña',
                                                                placeholder: '',
                                                                id: 'password',
                                                                type: 'password',
                                                                required: false,
                                                                minLength: 6,
                                                                maxLength: 50,
                                                                autoComplete: 'new-password'
                                                            }}
                                                            onChange={this.handleInputChange}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </div>

                                                <div className='row mt-4'>
                                                    <div className="col-12">
                                                        <div className="d-grid">
                                                            <PrimaryButton
                                                                text={'Actualizar ahora'}
                                                                type={'submit'}
                                                                disabled={this.state.isValidForm === false || this.state.loading}
                                                                showText={true}
                                                                loading={this.state.loading}
                                                                textLoading={'Actualizando...'}></PrimaryButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        );
    }
}
export default Page;