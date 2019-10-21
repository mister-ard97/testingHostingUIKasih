import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { userLogin, cleanError, userLoginWithGoogle, userLoginWithFacebook } from '../redux/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';


class Login extends Component {

    componentDidMount() {
        // document.title = 'Login Page'
        this.props.cleanError();
    }

    handleSubmitLogin = (e) => {
        e.preventDefault();

        //pengecekan di action creator
        this.props.userLogin(this.Email.value, this.Password.value);
    }

    renderButtonLogin = () => {
        if (this.props.loading) {
            return (
                <button className='btn btn-primary form-control' disabled value='Login'>
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </button>
            )
        }

        return <button type='submit' className="btn btn-primary form-control">Login</button>
    }

    renderButtonGmail = () => {
        if (this.props.loading) {
            return (
                <button className='btn btn-white text-danger form-control mt-1 border' disabled value='Login with Gmail'>
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </button>
            )
        }

        return (
            <div className='form-group'>
                <GoogleLogin
                    clientId="686002546266-r9d3q25b6e8qb4egc1fttf62ll63h7dv.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={this.loginWithGoogle}
                    onFailure={this.loginWithGoogle}
                    render={renderProps => (
                        <button onClick={renderProps.onClick} className='btn btn-white text-danger mt-3 form-control border'>Login with Gmail</button>
                    )}
                />
            </div>
        )
    }

    renderButtonFacebook = () => {
        if (this.props.loading) {
            return (
                <button className='btn btn-primary text-white form-control mt-1' disabled value='Login with Facebook'>
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </button>
               
            )
        }

        return (
            <FacebookLogin
                appId="522644335167657"
                autoLoad={false}
                fields="name,email,picture"
                callback={this.responseFacebook}
                cssClass="btn btn-primary text-white form-control mt-1"
            />
        )
    }

    loginWithGoogle = (response) => {
        console.log(response)
         if(response) {
            let dataGoogle = {
                email: response.profileObj.email,
                nama: response.profileObj.name,
                googleId: response.profileObj.googleId,
            }
            this.props.userLoginWithGoogle(dataGoogle)
        } 
    }

    responseFacebook = (response) => {
        if(response) {
            let dataFacebook = {
                email: response.email,
                nama: response.name,
                facebookId: response.id,
            }
            console.log(dataFacebook)
            this.props.userLoginWithFacebook(dataFacebook)
        } 
    }

    render() {
        if(this.props.email === '') {
            return (
                <div id='LoginPage' >
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
                                        <h5 className="card-title mb-3">Login Page</h5>
                                        {
                                            this.props.error.length > 0 ?
                                                <div className="alert alert-danger" role="alert">
                                                    {window.scrollTo(0, 0)}
                                                    {this.props.error}
                                                </div>
                                            : 
                                            null
                                        }
                                        <form onSubmit={this.handleSubmitLogin}>
                                            <div className="form-group">
                                                <FontAwesomeIcon icon={faUser} /> <label>Email</label>
                                                <input ref={ (Email) => this.Email = Email } type="email" className="form-control" id="emailLogin" placeholder="Enter Your Email" required />
                                            </div>
                                            <div className="form-group">
                                                <FontAwesomeIcon icon={faKey} /> <label>Password</label>
                                                <input ref={ (Password) => this.Password = Password } type="password" className="form-control" id="passwordLogin" placeholder="Password" maxLength='16' minLength='6' required />
                                            </div>
                                            <div className='d-flex justify-content-end'>
                                                <Link to='/forgotPassword' className='text-info'>
                                                    <small>Lupa kata sandi?</small>
                                                </Link>
                                            </div>
                                            {this.renderButtonLogin()}
                                        </form>
                                        {this.renderButtonGmail()}
                                        {this.renderButtonFacebook()}
                                        <hr />
                                       {
                                           this.props.loading ?
                                                <p className='mt-3'>Belum Register?  Register Now!</p>
                                                :
                                                <p className='mt-3'>Belum Register?  <Link to='/register'>Register Now!</Link></p>
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

export default connect(mapStateToProps, 
    { userLogin, 
        cleanError, 
        userLoginWithGoogle,
         userLoginWithFacebook })(Login);
