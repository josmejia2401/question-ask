import * as React from 'react';
import "./styles.css";
import Input from '../../../components/input';
import InputGroup from '../../../components/input-group';
import PrimaryButton from '../../../components/button-primary';
import { Link } from 'react-router-dom';
import { register } from './api';
import { buildPayloadFromForm, resetFormValues, stopPropagation } from '../../../utils/utils';

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isValidForm: false,
            errorMessage: null,
            successMessage: null,
            data: {
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
                }
            }
        };
        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() { }

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
        const { data } = this.state;
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
            const payload = buildPayloadFromForm(data);
            payload.createdAt = new Date().toISOString();
            payload.statusId = "PENDING";
            payload.healthData = {
                age: 0,
                height: 0,
            };
            register(payload).then(response => {
                this.updateState({
                    successMessage: response.message,
                    errorMessage: null,
                    data: resetFormValues(data)
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

    render() {
        return (<div className="card border-0 rounded-4">
            <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="row">
                    <div className="col-12">
                        <div className="mb-4">
                            <h3>Registrar usuario</h3>
                            <p>¿Ya tienes una cuenta? <Link to={'/auth/login'}>Inicia sesión</Link></p>
                        </div>
                    </div>
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
                        <div className="col-12 col-md-6 mb-2">
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
                        <div className="col-12 col-md-6 mb-2">
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
                                    pattern: "[3]{1}[0-9]{9}"
                                }}
                                onChange={this.handleInputChange}
                                disabled={this.state.loading}
                            />
                        </div>
                    </div>

                    <div className="row mb-2">
                        <div className="col-12 col-md-12 mb-2">
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
                                disabled={this.state.loading}
                            />
                        </div>
                        <div className="col-12 col-md-12">
                            <InputGroup
                                value={this.state.data.password.value}
                                schema={{
                                    name: 'Contraseña',
                                    placeholder: '',
                                    id: 'password',
                                    type: 'password',
                                    required: true,
                                    minLength: 6,
                                    maxLength: 50,
                                    autoComplete: 'new-password'
                                }}
                                onChange={this.handleInputChange}
                                disabled={this.state.loading}
                            />
                        </div>
                    </div>

                    <div className='row mt-4'>
                        <div className="col-12">
                            <div className="d-grid">
                                <PrimaryButton
                                    text={'Registrarme ahora'}
                                    type={'submit'}
                                    disabled={this.state.isValidForm === false || this.state.loading}
                                    showText={true}
                                    loading={this.state.loading}
                                    textLoading={'Iniciando...'}></PrimaryButton>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>);
    }
}
export default Page;