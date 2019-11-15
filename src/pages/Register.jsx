import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { CustomInput } from 'reactstrap';

import { connect } from 'react-redux';
import { onUserRegister, cleanError, userLoginWithGoogle, userLoginWithFacebook } from '../redux/actions';

import { Redirect } from 'react-router-dom';
import { URL_API } from '../helpers/Url_API'
// import { is } from 'immutable';
import { isDataValid } from '../helpers/helpers';

class Register extends Component {
    state = {
        UserImageName: 'Select Image',
        UserImageFile: URL_API + '/defaultPhoto/defaultUser.png',
        UserImageDB: undefined,
        NextPage: false
    }

    componentDidMount() {
        document.title = 'Register Page'
        window.scrollTo(0, 0);
        this.props.cleanError();
    }

    handleSubmitRegister = (e) => {
        e.preventDefault();

        let objUserReg = {
            password: this.Password.value,
            confPassword: this.ConfPassword.value,
            name: this.Name.value,
            email: this.Email.value,
            // address: this.Address.value,
            // UserImage: this.state.UserImageDB
        }
        if(!isDataValid(objUserReg)){
            return window.alert('harap mengecek kembali semua form')
        }



        this.props.onUserRegister(objUserReg);
    }

    addUserImageChange = (e) => {
        if(e.target.files[0]) {
            this.setState({ 
                UserImageName: e.target.files[0].name,
                UserImageFile: URL.createObjectURL(e.target.files[0]), 
                UserImageDB: e.target.files[0]
            })
        } else {
            this.setState({ 
                UserImageName: 'Select Image', 
                UserImageFile: URL_API + '/defaultPhoto/defaultUser.png' ,
                UserImageDB: undefined
            })
        }
    }

    renderButtonRegister = () => {
        // if(this.props.loading) {
        //     return (
        //         <div className="spinner-border" role="status">
        //             <span className="sr-only">Loading...</span>
        //         </div>
        //     )
        // }

        return <button onClick={this.handleSubmitRegister} className="btn btn-primary form-control">Register</button>
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
        if(this.props.NextPage) {
            return <Redirect to='/waitingverification' />
        }
      if(this.props.token === '') {
          return (
              <div id='RegisterPage' >
                  <div className='container py-1'>
                      <div className='row py-1'>
                          <div className="col-12">
                              <div className='py-3 text-center'>
                                   {/* <Link to='/' className='navbar-brand text-dark'>
                                        Testing<span>Ui</span>
                                 </Link> */}

                                 <a href='/' className='navbar-brand text-dark'>
                                        Kasih Nusantara
                                 </a>
                              </div>
                              <div className="card px-3">
                                  <div className="card-body">
                                      <div className='col-12 border-bottom py-3 text-center'>    
                                            <div className='row'>
                                                <div className='col-12'>
                                                    <h4>Sudah Punya Akun?</h4>
                                                </div>
                                            <div className='col-4 offset-4'>
                                                {this.renderButtonGmail()}
                                                {this.renderButtonFacebook()}
                                            </div>
                                            </div>
                                      </div>
                                      <h5 className="card-title my-4">Register Page</h5>
                                      {
                                          this.props.error ?
                                              <div className="alert alert-danger" role="alert">
                                                  {window.scrollTo(0, 0)}
                                                  {this.props.error}
                                              </div>
                                              :
                                              null
                                      }
                                      <form onSubmit={this.handleSubmitRegister}>
                                          <div className="row mb-3">
                                              <div className="col">
                                                  <label>Full Name</label>
                                                  <input ref={(Name) => this.Name = Name} type="text" className="form-control" placeholder="Last name" />
                                              </div>
                                          </div>
                                          <div className="form-group">
                                              <label>Password</label>
                                              <input ref={(Password) => this.Password = Password} type="password" className="form-control" placeholder="Your Password" maxLength='16' minLength='6' />
                                          </div>
                                          <div className="form-group">
                                              <label>Confirm Password</label>
                                              <input ref={(ConfPassword) => this.ConfPassword = ConfPassword} type="password" className="form-control" placeholder="Your Password" maxLength='16' minLength='6' />
                                          </div>
                                          <div className="form-group">
                                              <label>Email address</label>
                                              <input ref={(Email) => this.Email = Email} type="email" className="form-control" placeholder="Enter email" />
                                              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                          </div>
                                          <label>Profie Picture</label>
                                          <div className='form-group'>
                                              <img src={`${this.state.UserImageFile}`} alt="user-default" className='userImage my-3' />
                                              <CustomInput id='up_i_u' type='file' label={this.state.UserImageName} onChange={this.addUserImageChange} />
                                          </div>
                                          {this.renderButtonRegister()}
                                      </form>

                                      <hr />
                                      <p className='mt-3'>Sudah Punya Akun?  <a href='/login'>Login Now!</a></p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )
      } else {
          return <Redirect to='/' />
      }

    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.token,
        NextPage: state.auth.NextPage
    }
}

export default connect(mapStateToProps, { onUserRegister, cleanError, userLoginWithGoogle, userLoginWithFacebook })(Register);