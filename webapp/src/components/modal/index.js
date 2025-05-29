import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './styles.css';

class Component extends React.Component {

    componentDidMount() {
        if (this.props.show) {
            document.body.classList.add('modal-open');
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.show && !prevProps.show) {
            document.body.classList.add('modal-open');
        } else if (!this.props.show && prevProps.show) {
            document.body.classList.remove('modal-open');
        }
    }

    componentWillUnmount() {
        document.body.classList.remove('modal-open');
    }

    render() {
        const { show, onClose, title, children } = this.props;
        if (!show) return null;
        return (
            ReactDOM.createPortal(
                <>
                    <div className="modal fade show d-block" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={true} role="dialog">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">{title}</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                                </div>
                                {children}
                            </div>
                        </div>
                    </div>
                </>,
                document.body)
        );
    }
}

Component.propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default Component;
