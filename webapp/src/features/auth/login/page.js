import * as React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import { signIn } from './api';
import { buildPayloadFromForm, resetFormValues, stopPropagation } from '../../../utils/utils';
import TextInputField from '../../../components/form-builder/fields/text-input-field';
import PasswordInputField from '../../../components/form-builder/fields/password-input-field';
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
            signIn(buildPayloadFromForm(data)).then(response => {
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
                <h2 className="text-left text-3xl font-bold mb-3 text-slate-800">Iniciar sesión</h2>

                <p className="text-left text-sm mb-6 text-slate-600">
                    ¿No tienes cuenta?{' '}
                    <Link to="/auth/register" className="text-indigo-600 hover:underline font-medium">
                        Regístrate rápido y sin complicaciones.
                    </Link>
                </p>

                {errorMessage && (
                    <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
                )}

                {successMessage && (
                    <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>
                )}

                <form onSubmit={this.handleSubmit} noValidate>
                    <TextInputField
                        label="Usuario"
                        id="username"
                        name="username"
                        value={data.username.value}
                        onChange={this.handleInputChange}
                        error={data.username.error}
                        placeholder=""
                        autoComplete="username"
                        disabled={loading}
                        required
                        className=""
                    />

                    <PasswordInputField
                        label="Contraseña"
                        id="password"
                        name="password"
                        value={data.password.value}
                        error={data.password.error}
                        onChange={this.handleInputChange}
                        placeholder=""
                        autoComplete="current-password"
                        disabled={loading}
                        required
                        className=""
                    />

                    <Button
                        variant="primary"
                        type="submit"
                        loading={loading}
                        disabled={!isValidForm}
                        fullWidth
                    >
                        Entrar
                    </Button>
                </form>
            </div>
        );
    }
}
export default Page; 