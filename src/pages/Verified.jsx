import React, { Component } from 'react';

import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { EmailVerification } from '../redux/actions';


class VerifiedPage extends Component {
    componentDidMount() {
        document.title = 'Verified Account'      
        this.props.EmailVerification()
    }
    
    render() {
        if(this.props.token !== '') {
            return (
                <div id='VerifiedPage'>
                    <div className='container py-1'>
                        <div className='row py-1'>
                            <div className="offset-2 offset-md-3 col-8 col-md-6 py-3">
                                <div className='py-3 text-center'>
                                    <Link to='/' className='navbar-brand text-dark'>
                                        Testing<span>Ui</span>
                                    </Link>
                                </div>
                                <div className="card p-3 font-weight-bold text-center">
                                    {
                                        this.props.loading ?
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            this.props.status === 'Unverified' ?
                                                <p className='text-danger'>Verification Failed. Please refresh your page</p>
                                                :
                                            this.props.status === 'Verified' ?
                                                <p className='text-success'>Verification Success. Thanks for your patience :)</p>
                                                :
                                                null
                                    }
                                    <p className='mt-3'><Link to='/'>Back to Home</Link></p>
                                </div>
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
        status: state.auth.status,
        token: state.auth.token,
        justRegister: state.auth.justRegister
    }
}

export default connect(mapStateToProps, {EmailVerification})(VerifiedPage);