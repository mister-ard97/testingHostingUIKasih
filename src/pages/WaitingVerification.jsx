import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { resendEmailVerification } from '../redux/actions';


class WaitingVerification extends Component {
    componentDidMount() {
        // document.title = 'Waiting Verification'
        window.scrollTo(0, 0);
    }

    resendEmailVerification = () => {
        this.props.resendEmailVerification(this.props.username, this.props.email);
    }

    renderButtonResendEmailVer = () => {
        if (this.props.loading) {
            return (
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            )
        }

        return <button type="submit" className="btn btn-primary form-control" onClick={this.resendEmailVerification}>Resend Email Verification</button>
    }

    render() {
        if(this.props.email !== '') {
            return (
                <div id='WaitingVerPage'>
                    <div className='container py-2'>
                        <div className='row py-2'>
                            <div className="offset-2 offset-md-3 col-8 col-md-6 py-3">
                                <div className='py-3 text-center'>
                                    <Link to='/' className='navbar-brand text-dark'>
                                        Testing<span>Ui</span>
                                    </Link>
                                </div>
                                <div className="card p-3">
                                    {
                                        this.props.statusVer === 'Failed' ?
                                            <div className="alert alert-danger" role="alert">
                                                Resend Email Verification is {this.props.statusVer}
                                            </div>
                                            : null
                                    }
                                    {
                                        this.props.statusVer === 'Success' ?
                                            <div className="alert alert-success" role="alert">
                                                Resend Email Verification is {this.props.statusVer}
                                            </div>
                                            : null
                                    }
                                    <h5>Waiting Verification</h5>
                                    <p>We have send email to: <span className='font-weight-bold'>{this.props.email}</span></p>
                                    <p>If there isn't an Email Verification from MaCommerce Admin, don't worry just click resend Email Verification</p>
                                    {this.renderButtonResendEmailVer()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return(
            // <Redirect to='/' />
            <p>Wishlist</p>)
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        email: state.auth.email,
        loading: state.auth.loading,
        statusVer: state.auth.statusVerification,
        status: state.auth.status
    }
}

export default connect(mapStateToProps, { resendEmailVerification })(WaitingVerification);