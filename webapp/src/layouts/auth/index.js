import * as React from 'react';
import "./styles.css";
import { Link } from 'react-router-dom';

//import banner from '../../assets/img/auth-banner.png';
import LocalStorageWatcher from '../../store/localStorageWatcher';
import { AuthStore } from '../../store/index';

const images = [
    {
        url: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80",
        caption: "Crea formularios personalizados fácilmente",
    },
    {
        url: "https://images.unsplash.com/photo-1521790360164-497f7d2a3df1?auto=format&fit=crop&w=800&q=80",
        caption: "Recopila respuestas en tiempo real",
    },
    {
        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        caption: "Analiza datos para mejores decisiones",
    },
];


class Layout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentSlide: 0
        };
        this.detectChangesStorage = this.detectChangesStorage.bind(this);
        this.goToHome = this.goToHome.bind(this);
    }

    componentDidMount() {
        this.localStorageWatcher = new LocalStorageWatcher(this.detectChangesStorage);
        this.goToHome();
    }

    componentWillUnmount() {
        this.localStorageWatcher.stopPolling();
    }

    goToHome() {
        if (AuthStore.getState().isAuthenticated) {
            window.location.replace('/dashboard');
        }
    }

    detectChangesStorage(event) {
        this.goToHome();
    }


    handlePrev = () => {
        this.setState({
            currentSlide: (this.state.currentSlide === 0 ? images.length - 1 : this.state.currentSlide - 1)
        });
    };

    handleNext = () => {
        this.setState({
            currentSlide: (this.state.currentSlide === images.length - 1 ? 0 : this.state.currentSlide + 1)
        });

    };

    setCurrentSlide(index) {
        this.setState({
            currentSlide: index
        });

    }


    render() {
        const { children } = this.props;
        const { currentSlide } = this.state;

        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="relative flex max-w-5xl w-full rounded-2xl shadow-md overflow-hidden bg-white">

                    {/* Izquierda: imágenes e info */}
                    <div className="hidden sm:flex w-1/2 bg-white text-slate-800 flex-col items-center justify-center p-8">

                        <Link
                            to={"/index"}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-semibold z-10"
                        >
                            Ir a inicio
                        </Link>
                        <h2 className="text-xl font-semibold mb-4 text-center text-slate-900">
                            QuestionAsk - Formularios inteligentes, respuestas reales
                        </h2>

                        <div className="w-full h-96 rounded-md overflow-hidden border border-slate-200 shadow-sm">
                            <img
                                src={images[currentSlide].url}
                                alt={images[currentSlide].caption}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        <p className="mt-4 text-center text-slate-600 italic text-base">
                            {images[currentSlide].caption}
                        </p>

                        <div className="flex space-x-2 mt-5">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => this.setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${currentSlide === index
                                        ? "bg-indigo-600"
                                        : "bg-slate-300 hover:bg-slate-400"
                                        }`}
                                    aria-label={`Slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>

                        <div className="absolute inset-y-0 left-4 flex items-center gap-2">
                            <button
                                onClick={this.handlePrev}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-full p-2"
                                aria-label="Anterior"
                            >
                                ‹
                            </button>
                            <button
                                onClick={this.handleNext}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-full p-2"
                                aria-label="Siguiente"
                            >
                                ›
                            </button>
                        </div>
                    </div>

                    {/* Derecha: formulario */}
                    <div className="w-full sm:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-white">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}
export default Layout;