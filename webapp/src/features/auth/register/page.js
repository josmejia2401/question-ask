import * as React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import { register } from './api';
import { buildPayloadFromForm, resetFormValues, stopPropagation } from '../../../utils/utils';
import TextInputField from '../../../components/form-builder/fields/text-input-field';
import PasswordInputField from '../../../components/form-builder/fields/password-input-field';
import EmailInputField from '../../../components/form-builder/fields/email-input-field';
import Button from '../../../components/button';
import { validateFieldFromProps } from '../../../utils/validators';

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
                    error: ''
                },
                lastName: {
                    value: '',
                    error: ''
                },
                email: {
                    value: '',
                    error: ''
                },
                phoneNumber: {
                    value: '',
                    error: ''
                },
                username: {
                    value: '',
                    error: ''
                },
                password: {
                    value: '',
                    error: ''
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

    updateState(payload) {
        this.setState(prevState => ({
            ...prevState,
            ...payload
        }), this.propagateState);
    }


    handleInputChange = (event) => {
        stopPropagation(event);
        const { name, value } = event.target;
        const input = event.target;

        const error = validateFieldFromProps(value, input);

        const updatedField = {
            value,
            error: error,
        };
        const updatedData = {
            ...this.state.data,
            [name]: updatedField,
        };

        const isValidForm = Object.values(updatedData).every((f) => f.error.length === 0);

        this.updateState({ data: updatedData, isValidForm });
    };


    handleSubmit(event) {
        stopPropagation(event);
        const { data } = this.state;
        const form = event.target;
        const isValid = form.checkValidity();
        const isValidForm = Object.keys(data).filter(key => data[key].error.length > 0).length === 0;
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
        const { data, loading, errorMessage, successMessage, isValidForm } = this.state;

        return (
            <div className="w-full max-w-md mt-10 p-8 rounded-2xl shadow-lg bg-white">
                <h2 className="text-left text-3xl font-bold mb-3 text-slate-800">Registro</h2>

                <p className="text-left text-sm mb-6 text-slate-600">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/auth/login" className="text-indigo-600 hover:underline font-medium">
                        Inicia sesión.
                    </Link>
                </p>

                {errorMessage && (
                    <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
                )}

                {successMessage && (
                    <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>
                )}

                <form
                    onSubmit={this.handleSubmit}
                    noValidate
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2"
                >
                    {/* Nombres */}
                    <div className="sm:col-span-2">
                        <TextInputField
                            label="Nombres"
                            id="firstName"
                            name="firstName"
                            value={data.firstName.value}
                            onChange={this.handleInputChange}
                            error={data.firstName.error}
                            autoComplete="given-name"
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Apellidos */}
                    <div className="sm:col-span-2">
                        <TextInputField
                            label="Apellidos"
                            id="lastName"
                            name="lastName"
                            value={data.lastName.value}
                            onChange={this.handleInputChange}
                            error={data.lastName.error}
                            autoComplete="family-name"
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Correo */}
                    <EmailInputField
                        label="Correo"
                        id="email"
                        name="email"
                        value={data.email.value}
                        onChange={this.handleInputChange}
                        error={data.email.error}
                        autoComplete="email"
                        disabled={loading}
                        required
                    />

                    {/* Celular */}
                    <TextInputField
                        label="Celular"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={data.phoneNumber.value}
                        onChange={this.handleInputChange}
                        error={data.phoneNumber.error}
                        autoComplete="tel"
                        disabled={loading}
                        required
                    />

                    {/* Usuario */}
                    <TextInputField
                        label="Usuario"
                        id="username"
                        name="username"
                        value={data.username.value}
                        onChange={this.handleInputChange}
                        error={data.username.error}
                        autoComplete="username"
                        disabled={loading}
                        required
                    />

                    {/* Contraseña */}
                    <PasswordInputField
                        label="Contraseña"
                        id="password"
                        name="password"
                        value={data.password.value}
                        error={data.password.error}
                        onChange={this.handleInputChange}
                        autoComplete="new-password"
                        disabled={loading}
                        required
                    />

                    {/* Botón ocupa ambas columnas */}
                    <div className="sm:col-span-2 mt-3">
                        <Button
                            variant="primary"
                            type="submit"
                            loading={loading}
                            disabled={!isValidForm}
                            fullWidth
                        >
                            Crear
                        </Button>
                    </div>
                </form>


            </div>
        );
    }
}
export default Page; 