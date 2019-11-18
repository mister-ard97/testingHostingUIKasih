import React, { Component } from 'react';

import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { EmailVerification } from '../redux/actions';
import queryString from 'query-string';
import Axios from 'axios';
import { URL_API } from '../helpers/Url_API'


class VerifiedPage extends Component {
    state = {
        loading: true,
        token: null,
        email: null,
        error: '',
        success: '',
        loadingButton: false
    }

    componentDidMount() {
        // document.title = 'Reset Password'
        let params = queryString.parse(this.props.location.search)
        console.log(params)
        if(params.token) {
            const options = {
                headers: {
                    'Authorization': `Bearer ${params.token}`,
                }
            }

            Axios.get(URL_API +'/user/userGetResetToken', options)
            .then((res) => {
                this.setState({loading: false, token: params.token, email: res.data})
            })
            .catch((err) => {
                this.setState({
                    loading: false, token: 'False'
                })
            })

        } else {
            this.setState({loading: false})
            return <Redirect to='/' />
        }
    }

    resetPasswordEmail = () => {
        this.setState({
            loadingButton: true,
            error: '',
            success: ''
        })
        if(this.NewPassword.value === this.ConfNewPassword.value) {
            let data = {
                email: this.state.email,
                password: this.NewPassword.value
            }
            const options = {
                headers: {
                    'Authorization': `Bearer ${this.state.token}`,
                }
            }

            Axios.post(URL_API + '/user/newPasswordUser', {data}, options)
                .then((res) => {
                    this.setState({
                        success: 'Password berhasil diubah, Silahkan login',
                        loadingButton: false
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            this.setState({
                error: 'Password dan Confirmation Password Harus Sama',
                loadingButton: false
            })
        }
    }

    render() {
        if(this.state.loading) {
            return (
                <div className='container py-1'>
                    <div className='row py-1'>
                        <div className="offset-2 offset-md-3 col-8 col-md-6 py-3">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (this.state.token) {
            return (
                <div id='VerifiedPasswordToken'>
                    <div className='container py-1'>
                        <div className='row py-1'>
                            <div className="offset-2 offset-md-3 col-8 col-md-6 py-3">
                                <div className='py-3 text-center'>
                                     {/* <Link to='/' className='navbar-brand text-dark'>
                                        Testing<span>Ui</span>
                                 </Link> */}

                                 <a href='/' className='navbar-brand text-dark'>
                                        Kasih Nusantara
                                 </a>
                                </div>
                                
                                {
                                    this.state.token === 'False' ?
                                        <div className="card p-3 font-weight-bold text-center">
                                            <p className='text-danger'>Token has been expired</p>
                                        </div>
                                    :
                                        <div className="card p-3 font-weight-bold text-center">
                                            {
                                                this.state.success ?
                                                    <div className="alert alert-success" role="alert">
                                                        {window.scrollTo(0,0)}
                                                        <p>{this.state.success}</p>
                                                        <a href='/login'>Login Now!</a>
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.error ?
                                                    <div className="alert alert-success" role="alert">
                                                        {window.scrollTo(0, 0)}
                                                        {this.state.error}
                                                    </div>
                                                    :
                                                    null
                                            }
                                            <div className="form-group mb-2">
                                                <label>New Password</label>
                                                <input ref={(NewPassword) => this.NewPassword = NewPassword} type="password" className="form-control" id="newPassword" placeholder="Enter New Password" />
                                            </div>
                                            <div className="form-group mb-2">
                                                <label>Confirm New Password</label>
                                                <input ref={(ConfNewPassword) => this.ConfNewPassword = ConfNewPassword} type="password" className="form-control" id="confNewPassword" placeholder="Enter Confirmation New Password" />
                                            </div>

                                            {
                                                this.state.loadingButton ?
                                                    <button className='form-control btn btn-success' onClick={this.resetPasswordEmail} disabled>
                                                        <div className="spinner-border text-white" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </button>
                                                    :
                                                    <button className='form-control btn btn-success' onClick={this.resetPasswordEmail}>Change Password</button>
                                            }

                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <Redirect to='/' />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        verified: state.auth.verified,
        token: state.auth.token,
        justRegister: state.auth.justRegister
    }
}

export default connect(mapStateToProps, { EmailVerification })(VerifiedPage);