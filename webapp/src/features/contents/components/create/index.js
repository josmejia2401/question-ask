import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import Input from '../../../../components/input';
import Textarea from '../../../../components/textarea';
import PrimaryButton from '../../../../components/button-primary';
import { buildPayloadFromForm, resetFormValues, stopPropagation } from '../../../../utils/utils';
import Image from '../image';
import Video from '../video';
import Interactive from '../interactive';
import Informative from '../informative';
import Selections from '../selections';
import Questions from '../questions';
import Icons from '../icons';
import Stadium from '../stadium';


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
                statusId: {
                    value: 'ACTIVO',
                    errors: []
                },
                type: {
                    value: '',
                    errors: []
                },
            },
            content: {}
        };

        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addContent = this.addContent.bind(this);
    }

    async propagateState() { }

    async updateState(payload) {
        this.setState({ ...payload }, () => this.propagateState());
    }

    async handleInputChange(event, errors) {
        stopPropagation(event);
        const { name, value } = event.target;
        const { data, content } = this.state;
        data[name].value = value;
        data[name].errors = errors;
        let isValidForm = Object.keys(data).filter(key => data[key].errors.length > 0).length === 0;
        if (isValidForm) {
            isValidForm = Object.keys(content).length > 0;
        }
        this.updateState({ data, isValidForm });
        if (name === "type") {
            this.updateState({ content: {}, isValidForm: false });
        }
    }

    async handleSubmit(event) {
        stopPropagation(event);
        const { data, content } = this.state;
        const isValidForm = Object.keys(data).filter(key => data[key].errors.length > 0).length === 0;
        if (isValidForm) {
            try {
                this.updateState({ loading: true });
                const payload = buildPayloadFromForm(data);
                payload.content = content;
                payload.createdAt = new Date().toISOString();
                payload.statusId = "ACTIVO";
                const response = await this.props.onSubmit(payload);
                this.updateState({
                    successMessage: response.message,
                    errorMessage: null,
                    data: resetFormValues(data)
                });
                const item = document.getElementById("type");
                if (item) {
                    item.value = "";
                }
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

    addContent(content) {
        const { data } = this.state;
        let isValidForm = false;
        if (data.type.value === 'image') {
            isValidForm = content.images.length > 0;
        } else if (data.type.value === 'video') {
            isValidForm = content.url.length > 0;
        } else if (data.type.value === 'interactive') {
            isValidForm = content.options.length > 0;
        } else if (data.type.value === 'informative') {
            isValidForm = content.text.length > 0;
        } else if (data.type.value === 'selections') {
            isValidForm = content.options.length > 0;
        } else if (data.type.value === 'questions') {
            isValidForm = content.questions.length > 0;
        } else if (data.type.value === 'icons') {
            isValidForm = content.options.length > 0;
        } else if (data.type.value === 'stadium') {
            isValidForm = content.options.length > 0;
        }
        console.log(content, data);
        if (isValidForm) {
            isValidForm = Object.keys(data).filter(key => data[key].errors.length > 0).length === 0;
        }
        this.updateState({
            content,
            isValidForm
        });
    }

    buildFactory() {
        const { data } = this.state;
        switch (data.type.value) {
            case "video":
                return <Video onSubmit={this.addContent}></Video>;
            case "image":
                return <Image onSubmit={this.addContent}></Image>;
            case "interactive":
                return <Interactive onSubmit={this.addContent}></Interactive>;
            case "informative":
                return <Informative onSubmit={this.addContent}></Informative>;
            case "selections":
                return <Selections onSubmit={this.addContent}></Selections>;
            case "questions":
                return <Questions onSubmit={this.addContent}></Questions>;
            case "icons":
                return <Icons onSubmit={this.addContent}></Icons>;
            case "stadium":
                return <Stadium onSubmit={this.addContent}></Stadium>;
            default:
                break;
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
                                <label className="form-label">Tipo de Contenido</label>
                                <select className="form-select" id="type" name="type" onChange={(e) => this.handleInputChange(e, [])} required>
                                    <option value="">Selecciona</option>
                                    <option value="video">Video</option>
                                    <option value="image">Imagen</option>
                                    <option value="questions">Preguntas</option>
                                    <option value="informative">Informativo</option>
                                    <option value="selections">Selecciones</option>
                                    <option value="interactive">Interactivo</option>
                                    <option value="icons">Iconos</option>
                                    <option value="stadium">Estadio/Escalera</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-12 mb-2">
                                {this.buildFactory()}
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
