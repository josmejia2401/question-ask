import * as React from 'react';
import "./styles.css";
import { AuthStore } from '../../../store/index';
import { Link } from "react-router-dom";

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    componentDidMount() { }

    componentWillUnmount() { }

    render() {
        return (<div className="custom-bg text-dark">
            <div className="d-flex align-items-center justify-content-center min-vh-100 px-2">
                <div className="text-center">
                    <h1 className="display-1 fw-bold">404</h1>
                    <p className="fs-2 fw-medium mt-4">Ups! Page no encontrada</p>
                    <p className="mt-4 mb-5">La página que estás buscando no existe o ha sido movida.</p>
                    <Link to={AuthStore.getState().isAuthenticated ? '/auth/login' : '/dashboard'} className="btn btn-light fw-semibold rounded-pill px-4 py-2 custom-btn">
                        {AuthStore.getState().isAuthenticated ? 'Ir a Home' : 'Ir a Iniciar Sesión'}
                    </Link>
                </div>
            </div>
        </div>);
    }
}
export default Page;