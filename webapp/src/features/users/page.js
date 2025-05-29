import * as React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';
import { stopPropagation, truncateText } from '../../utils/utils';
import { formatDateTime } from '../../utils/formatters';
import ButtonIcon from '../../components/button-icon';
import Modal from '../../components/modal';
import ViewItem from './components/view';
import { filterItems } from './api';
class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingMoreData: false,
            data: [],
            dataFiltered: [],
            currentItemSelected: null,
            lastEvaluatedKey: null,
            tableOrderBy: false,
            tableInputSearch: '',
            accordionSelected: null,
            showModal: false,
            modalType: null,
            selectedItem: null,
        };
        this.propagateState = this.propagateState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.handleLoadData = this.handleLoadData.bind(this);
        this.handleLoadMoreData = this.handleLoadMoreData.bind(this);
        this.handleSortTableByColumn = this.handleSortTableByColumn.bind(this);
        this.handleSetAccordion = this.handleSetAccordion.bind(this);
        this.setChangeInputEvent = this.setChangeInputEvent.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.renderModalContent = this.renderModalContent.bind(this);
    }

    componentDidMount() {
        this.handleLoadData();
    }

    componentWillUnmount() { }

    async propagateState() {
        this.forceUpdate();
    }

    updateState(payload) {
        this.setState({ ...payload }, () => this.propagateState());
    }

    async handleLoadData(e) {
        stopPropagation(e);
        this.updateState({
            loading: true,
            lastEvaluatedKey: undefined,
            loadingMoreData: false,
            data: [],
            dataFiltered: [],
        });
        filterItems({}).then(result => {
            const { items, lastEvaluatedKey } = result.data;
            this.updateState({
                loading: false,
                lastEvaluatedKey: lastEvaluatedKey,
                data: items,
                dataFiltered: items.map(clone => ({ ...clone })),
            });
        }).catch(err => {
            console.error(err);
            this.updateState({ loading: false });
        });
    }

    async handleLoadMoreData(e) {
        stopPropagation(e);
        this.updateState({ loadingMoreData: true });
        filterItems(this.state.lastEvaluatedKey).then(result => {
            const { items, lastEvaluatedKey } = result.data;
            this.state.data.push(...items);
            this.state.dataFiltered.push(...items);
            this.updateState({
                data: this.state.data,
                dataFiltered: this.state.dataFiltered,
                loadingMoreData: false,
                lastEvaluatedKey: lastEvaluatedKey
            });
        }).catch(err => {
            this.updateState({ loadingMoreData: false });
        });
    }

    async handleSortTableByColumn(key) {
        const { dataFiltered, tableOrderBy } = this.state;

        const sortedData = [...dataFiltered].sort((a, b) => {
            if (a[key] === b[key]) return 0;
            if (tableOrderBy) {
                return a[key] > b[key] ? 1 : -1;
            } else {
                return a[key] < b[key] ? 1 : -1;
            }
        });

        this.updateState({
            dataFiltered: sortedData,
            tableOrderBy: !tableOrderBy
        });
    }

    async handleSetAccordion(event) {
        const id = event.currentTarget?.id;

        if (!id) return;

        this.setState(prevState => ({
            accordionSelected: prevState.accordionSelected === id ? undefined : id
        }));
    }


    async setChangeInputEvent(event) {
        const tableInputSearch = event.target.value.trim().toLowerCase();

        const dataFiltered = tableInputSearch
            ? this.state.data.filter(item =>
                JSON.stringify(item).toLowerCase().includes(tableInputSearch)
            )
            : [...this.state.data]; // copia superficial

        this.updateState({
            tableInputSearch: event.target.value, // mantener el valor original ingresado
            dataFiltered,
        });
    }


    openModal = (type, item = null) => {
        this.updateState({ showModal: true, modalType: type, selectedItem: item });
    };

    closeModal = () => this.updateState({ showModal: false, modalType: null, selectedItem: null });
    handleEdit = async (item) => { };
    handleDelete = async (item) => { };
    handleCreate = async (item) => { };
    renderModalContent = () => {
        const { modalType, selectedItem } = this.state;
        switch (modalType) {
            case 'view':
                return <ViewItem item={selectedItem}
                    onSubmit={this.handleEdit}
                    onClose={this.closeModal} />;
            default:
                return null;
        }
    };


    render() {
        return (<div className="col py-3 panel-view">
            <section className="section container px-5" style={{ marginTop: '90px' }}>
                <div className="row" id="table-hover-row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <div style={{ flexDirection: "column", display: 'flex', width: '100%' }}>
                                    <div style={{ flexDirection: "row", display: 'flex', width: '100%' }}>
                                        <h4 className="card-title title-color">Listado de usuarios</h4>
                                        <div className='btn-header-table'>
                                            <ButtonIcon type="button"
                                                className="btn icon btn-primary"
                                                onClick={this.handleLoadData}
                                                disabled={this.state.loading || this.state.loadingMoreData}>
                                                <i className="fa-solid fa-rotate-right"></i>
                                            </ButtonIcon>
                                        </div>
                                    </div>
                                    <div className="accordion mt-2" id="accordionExample" style={{ flexDirection: "row", display: 'flex', width: '100%' }}>
                                        <div className="accordion-item" style={{ width: '100%' }}>
                                            <h2 className="accordion-header">
                                                <button
                                                    id="segmentationInformation"
                                                    name="segmentationInformation"
                                                    className={`accordion-button ${!this.state.accordionSelected ? 'collapsed' : ''}`}
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseOne"
                                                    aria-expanded={!this.state.accordionSelected ? false : true}
                                                    aria-controls="collapseOne"
                                                    onClick={this.handleSetAccordion}>
                                                    Información importante
                                                </button>
                                            </h2>
                                            <div id="collapseOne"
                                                className={`accordion-collapse collapse ${this.state.accordionSelected === "segmentationInformation" ? 'show' : ''}`}
                                                data-bs-parent="#accordionExample">
                                                <div className="accordion-body" style={{ flexDirection: "column" }}>
                                                    <h6>1. Si el sistema muestra la opción "Cargar más", significa que hay más elementos en la base de datos que aún no se han mostrado en pantalla.</h6>
                                                    <h6>2. Al presionar el botón "Refrescar", la información de la tabla se recarga sin necesidad de actualizar la página manualmente (F5).</h6>
                                                    <h6>3. El filtro de búsqueda encuentra coincidencias en cualquier campo de los archivos visibles en la tabla.</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th colSpan={7}>
                                                    <input
                                                        placeholder='Buscar...'
                                                        type="text"
                                                        className="form-control form-control-xl input-color w-100"
                                                        value={this.state.tableInputSearch}
                                                        onChange={this.setChangeInputEvent}
                                                        autoComplete='off'></input>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th><b>Nombres</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('firstName')}></i></th>
                                                <th><b>Apellidos</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('lastName')}></i></th>
                                                <th><b>Email</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('email')}></i></th>
                                                <th><b>Número celular</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('phoneNumber')}></i></th>
                                                <th><b>Estado</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('statusId')}></i></th>
                                                <th><b>Fecha creación</b><i className="fa fa-fw fa-sort" onClick={() => this.handleSortTableByColumn('createdAt')}></i></th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.loading && (<tr>
                                                <td className="text-color align-items-center text-center" colSpan={7}>
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>)}
                                            {!this.state.loading && this.state.dataFiltered.length === 0 && (<tr>
                                                <td className="text-color" colSpan={7}>
                                                    <i className="fa-solid fa-circle-exclamation no-found-icon"></i>
                                                    <h1 className="no-found-text">No hay datos</h1>
                                                </td>
                                            </tr>)}
                                            {!this.state.loading && this.state.dataFiltered.length > 0 && this.state.dataFiltered.map((item, index) => {
                                                return (<tr key={index}>
                                                    <td>
                                                        <div className="row" style={{ width: '100%', height: '60px' }}>
                                                            <div className="d-flex align-items-center" style={{ alignItems: 'center' }}>
                                                                <span className={`text-color`}>{truncateText(item.firstName, 50)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="row" style={{ width: '100%', height: '60px' }}>
                                                            <div className="d-flex align-items-center" style={{ alignItems: 'center' }}>
                                                                <span className={`text-color`}>{truncateText(item.lastName, 50)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="row" style={{ width: '100%', height: '60px' }}>
                                                            <div className="d-flex align-items-center" style={{ alignItems: 'center' }}>
                                                                <span className={`text-color`}>{truncateText(item.email, 50)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="row" style={{ width: '100%', height: '60px' }}>
                                                            <div className="d-flex align-items-center" style={{ alignItems: 'center' }}>
                                                                <span className={`text-color`}>{truncateText(item.phoneNumber, 50)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="row" style={{ width: '100%', height: '60px' }}>
                                                            <div className="d-flex align-items-center" style={{ alignItems: 'center' }}>
                                                                <span className={`text-color`}>{item.statusId}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="row" style={{ width: '100%', height: '60px' }}>
                                                            <div className="d-flex align-items-center" style={{ alignItems: 'center' }}>
                                                                <span className={`text-color`}>{formatDateTime(item.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="" style={{ width: '100%', height: '60px' }}>
                                                            <div className="d-flex align-items-center" style={{ alignItems: 'center' }}>
                                                                <Link to={"#"}>
                                                                    <i className="fa-solid fa-eye" onClick={() => this.openModal('view', item)}></i>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>);
                                            })}
                                        </tbody>
                                        {this.state.lastEvaluatedKey && !this.state.loading && !this.state.downloading && this.state.dataFiltered.length > 0 && (<tfoot>
                                            <tr>
                                                <td colSpan={7} style={{ textAlign: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                                    {this.state.loadingMoreData ? (<div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>) : (<Link to={"#"} className='center-text' onClick={this.handleLoadMoreData}>Cargar más</Link>)}
                                                </td>
                                            </tr>
                                        </tfoot>)}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal
                show={this.state.showModal}
                onClose={this.closeModal}
                title={{
                    edit: 'Editar Elemento',
                    delete: 'Eliminar Elemento',
                    create: 'Crear Elemento',
                    view: 'Ver Elemento',
                }[this.state.modalType]}>
                {this.renderModalContent()}
            </Modal>
        </div>);
    }
}
export default Page;