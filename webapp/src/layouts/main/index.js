import * as React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import LocalStorageWatcher from '../../store/localStorageWatcher';
import { AuthStore } from '../../store/index';
import { logout } from "./api";

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      preloader: true,
    };
    this.checkDocumentState = this.checkDocumentState.bind(this);
    this.handleClickOpenNav = this.handleClickOpenNav.bind(this);
    this.detectChangesStorage = this.detectChangesStorage.bind(this);
    this.goToAuth = this.goToAuth.bind(this);
  }

  componentDidMount() {
    this.checkDocumentState();
    this.localStorageWatcher = new LocalStorageWatcher(this.detectChangesStorage);
    this.goToAuth();
  }

  componentWillUnmount() {
    document.removeEventListener('load', () => this.setState({ preloader: false }));
  }

  checkDocumentState = () => {
    if (document.readyState === "complete") {
      this.setState({ preloader: false });
    } else {
      window.addEventListener('load', () => this.setState({ preloader: false }));
    }
  }

  handleClickOpenNav = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      const navbarNavDropdown = document.getElementById("navbarResponsive");
      navbarNavDropdown.classList.toggle("show");
    }
  }

  goToAuth() {
    if (!AuthStore.getState().isAuthenticated) {
      window.location.replace('/auth/login');
    }
  }

  detectChangesStorage(event) {
    this.goToAuth();
  }

  render() {
    return (
      <div className="main-router">
        {this.state.preloader && <div className="d-flex justify-content-center-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>}
        <nav className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm" id="mainNav">
          <div className="container px-5">
            <Link to={"/"} className="navbar-brand fw-bold">
              <img src={"/logoCeleste.png"} width={"46px"} alt=""></img>
              questionask
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={this.handleClickOpenNav}>
              Menú
              <i className="fa-solid fa-bars ms-2"></i>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ms-auto me-4 my-3 my-lg-0">
                <li className="nav-item">
                  <div className="dropdown nav-link me-lg-3">
                    <Link className="btn btn-navbar a-navbar d-flex align-items-center" to={"/contents"} role="button" aria-expanded="false">
                      <span className="d-flex align-items-center">
                        <i className="fa-solid fa-layer-group me-2"></i>
                        <span className="small">Contenido</span>
                      </span>
                    </Link>
                  </div>
                </li>
                <li className="nav-item">
                  <div className="dropdown nav-link me-lg-3">
                    <Link className="btn btn-navbar a-navbar d-flex align-items-center" to={"/users"} role="button" aria-expanded="false">
                      <span className="d-flex align-items-center">
                        <i className="fa-solid fa-users me-2"></i>
                        <span className="small">Usuarios</span>
                      </span>
                    </Link>
                  </div>
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <div className="dropdown nav-link rounded-pill px-3 mb-2 mb-lg-0">
                    <Link className="btn btn-navbar dropdown-toggle a-navbar d-flex align-items-center" to={"#"} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <span className="d-flex align-items-center">
                        <i className="fa-solid fa-people-arrows me-2"></i>
                        <span className="small">Usuarios</span>
                      </span>
                    </Link>
                    <ul className="dropdown-menu hide">
                    <li>
                        <Link className="dropdown-item" to="/profile">
                          <span className="d-flex align-items-center">
                            <i className="fas fa-user me-2"></i>
                            <span className="small">Perfil</span>
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#" onClick={logout}>
                          <span className="d-flex align-items-center">
                            <i className="fa-solid fa-door-closed me-2"></i>
                            <span className="small">Salir</span>
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
}
export default Layout;
