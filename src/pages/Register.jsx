import React, { Component } from 'react';

import { CustomInput } from 'reactstrap';

import { connect } from 'react-redux';
import { onUserRegister, cleanError } from '../redux/actions';

import { Redirect, Link } from 'react-router-dom';

class Register extends Component {
    state = {
        UserImageName: 'Select Image',
        UserImageFile: 'http://localhost:2002/defaultPhoto/defaultUser.png',
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
            UserImage: this.state.UserImageDB
        }

        this.props.onUserRegister(objUserReg);
    }

    addUserImageChange = (e) => {
        if(e.target.files[0]) {
            this.setState({ 
                UserImageFile: URL.createObjectURL(e.target.files[0]), 
                UserImageName: e.target.files[0].name,
                UserImageDB: e.target.files[0]
            })
        } else {
            this.setState({ 
                UserImageName: 'Select Image', 
                UserImageFile: 'http://localhost:2002/defaultPhoto/defaultUser.png' ,
                UserImageDB: undefined
            })
        }
    }

    renderButtonRegister = () => {
        if(this.props.loading) {
            return (
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            )
        }

        return <button onClick={this.handleSubmitRegister} className="btn btn-primary form-control">Register</button>
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
                                  <Link to='/' className='navbar-brand text-dark'>
                                      Testing<span>Ui</span>
                                 </Link>
                              </div>
                              <div className="card px-3">
                                  <div className="card-body">
                                      <h5 className="card-title mb-3">Register Page</h5>
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
                                      <p className='mt-3'>Sudah Punya Akun?  <Link to='/login'>Login Now!</Link></p>
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

export default connect(mapStateToProps, { onUserRegister, cleanError })(Register);