import * as React from 'react';
import "./styles.css";
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
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="relative flex max-w-5xl w-full rounded-2xl shadow-lg overflow-hidden">

                    {/* Izquierda - carrusel: oculto en móvil */}
                    <div className="hidden sm:flex w-1/2 bg-gray-800 text-white relative flex-col items-center justify-center p-8">
                        <button
                            onClick={() => window.history.back()}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-semibold z-10"
                        >
                            Regresar
                        </button>

                        <h2 className="text-xl font-bold mb-6 text-center">
                            QuestionAsk - Formularios inteligentes, respuestas reales.
                        </h2>

                        <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
                            <img
                                src={images[currentSlide].url}
                                alt={images[currentSlide].caption}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        <p className="mt-4 text-center text-lg italic">
                            {images[currentSlide].caption}
                        </p>

                        <div className="flex space-x-3 mt-6">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => this.setCurrentSlide(index)}
                                    className={`w-4 h-4 rounded-full transition-colors ${currentSlide === index
                                        ? "bg-white"
                                        : "bg-gray-500 hover:bg-gray-400"
                                        }`}
                                    aria-label={`Slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>

                        <div className="absolute inset-y-0 left-4 flex items-center space-x-2">
                            <button
                                onClick={this.handlePrev}
                                className="bg-gray-700 bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2"
                                aria-label="Anterior"
                            >
                                ‹
                            </button>
                            <button
                                onClick={this.handleNext}
                                className="bg-gray-700 bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2"
                                aria-label="Siguiente"
                            >
                                ›
                            </button>
                        </div>
                    </div>

                    {/* Derecha - formulario login ocupa todo en móvil */}
                    <div className="w-full sm:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-gray-800">
                        {children}
                    </div>
                </div>
            </div>
        );
    }


}
export default Layout;