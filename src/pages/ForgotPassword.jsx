import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {cleanError} from '../redux/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { URL_API } from '../helpers/Url_API'


class ForgotPassword extends Component {
    state = {
        errorText: '',
        loadingComponent: false,
        successText: ''
    }

    componentDidMount () {
        // document.title = 'Forgot Password'
        this.props.cleanError();
    }

    handleSubmitForgotPassword = (e) => {
        //pengecekan di component.
        e.preventDefault();

        this.setState({loadingComponent: true, successText: '', errorText: ''})
        if(this.Email.value === '') {
            this.setState({errorText: 'Harap untuk masukkan Email', loadingComponent: false})
        } else {
            Axios.post(URL_API + '/user/userForgotPassword', { email: this.Email.value })
                .then((res) => {
                    this.setState({
                        errorText: '',
                        successText: `Link untuk reset password telah dikirim ke email ${this.Email.value}`,
                        loadingComponent: false
                    })
                    this.Email.value = ''
                })
                .catch((err) => {
                    if (err.response) {
                        this.setState({
                            errorText: err.response.data.message,
                            loadingComponent: false,
                            successText: ''
                        })
                    }
                })
        }
    }

    renderButtonForgotPassword = () => {
        if (this.state.loadingComponent) {
            return (
                <button className='btn btn-primary form-control mt-3' disabled value='Login'>
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </button>
            )
        }

        return <button type="submit" className="btn btn-primary form-control mt-3">Send Reset Password Link</button>
    }

    render() {
        if (this.props.email === '') {
            return (
                <div id='ForgotPasswordPage' >
                    <div className='container py-3'>
                        <div className='row py-3'>
                            <div className="col-12">
                                <div className='py-3 text-center'>
                                    <Link to='/' className='navbar-brand text-dark'>
                                        Testing<span>Ui</span>
                                    </Link>
                                </div>
                                <div className="card px-3">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Forgot Password</h5>
                                        {
                                            this.state.successText.length > 0 ?
                                                <div className="alert alert-success" role="alert">
                                                    {window.scrollTo(0, 0)}
                                                    {this.state.successText}
                                                </div>
                                                :
                                                null
                                        }

                                        <form onSubmit={this.handleSubmitForgotPassword}>
                                            <div className="form-group mb-2">
                                                <FontAwesomeIcon icon={faUser} /> <label>Email</label>
                                                <input ref={(Email) => this.Email = Email} type="email" className="form-control" id="emailForgotPassword" placeholder="Enter Your Email" />
                                            </div>
                                            {
                                                this.state.errorText ?
                                                <small className='text-danger'>{this.state.errorText}</small>
                                                :
                                                null
                                            }
                                            {this.renderButtonForgotPassword()}
                                        </form>
                                        <hr />
                                        {
                                            this.props.loading ?
                                                <p className='mt-3'>Ingat Password Anda? Login Now!</p>
                                                :
                                                <p className='mt-3'>Ingat Password Anda?   <Link to='/login'>Login Now!</Link></p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return <Redirect to='/' />
    }

}


const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        email: state.auth.email
    }
}

export default connect(mapStateToProps, { cleanError })(ForgotPassword)