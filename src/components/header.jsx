import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { userLogOut } from '../redux/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { URL_API } from '../helpers/Url_API'


class Header extends Component {
    state = {
        isOpen: false,
        login: false,
        loadingLogin: '',
        logOut: false
    }

    userLogOut = () => {
        this.props.userLogOut();
        this.setState({
            logOut: true
        })
    }

    renderCartAccount = (param) => {
        return (
            <div className='navbar-nav-cust d-flex font-weight-normal'>
                        <UncontrolledDropdown nav inNavbar>                            
                            {
                                this.props.loading ?

                                <DropdownToggle nav caret >
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                </DropdownToggle>
                                :
                                    <DropdownToggle nav caret>
                                        {
                                            this.props.loginChecked ?
                                                <div style={{width: 40}}>
                                                    <img src={`${URL_API}/${this.props.userImage}`} alt={'User' + this.props.name} className='img-fluid' style={{borderRadius: 40}}/>
                                                </div>
                                                :
                                                <div className='bg-warning font-weight-bold rounded px-1'>
                                                    <span className='text-dark mr-2'>Login</span>
                                                    <FontAwesomeIcon icon={faUserCircle} className={param} />
                                                </div>

                                        }

                                    </DropdownToggle>
                            }
                            <DropdownMenu right={true} className='px-2 userDropdown' id='loginDropdown'>
                                {
                                    this.props.name !== '' ?
                                        
                                        this.props.justRegister ?
                                            <div>
                                                {
                                                    this.props.status === 0 ?
                                                    <p className='text-danger'>Anda belum verifikasi email <Link to='/waitingverification'> Klik Untuk Verification </Link></p>
                                                    :
                                                    null
                                                }
                                                <p>Selamat Bergabung di MaCommerce, {this.props.name}</p>
                                                <Link to='/changePassword' className='border-bottom d-block'> Change Password </Link>
                                                <Link to='/subscription' className='border-bottom d-block'> My Subscription </Link>
                                                <Link to='/student-list' className='border-bottom d-block'> Student List </Link>
                                                <Link to='/' onClick={this.userLogOut}> Log Out </Link>
                                               
                                            </div>
                                        :
                                            <div>
                                                {
                                                    this.props.status === 0 ?
                                                        <p className='text-danger'>Anda belum verifikasi email <Link to='/waitingverification'> Klik Untuk Verification </Link></p>
                                                        :
                                                        null
                                                }
                                                <p>Selamat Datang Kembali, {this.props.name}</p>
                                                <Link to='/changePassword' className='border-bottom d-block'> Change Password </Link>
                                                <Link to='/subscription' className='border-bottom d-block'> My Subscription </Link>
                                                <Link to='/student-list' className='border-bottom d-block'> Student List </Link>
                                                <Link to='/' onClick={this.userLogOut}> Log Out </Link>
                                            </div>
                                    :
                                        <div>
                                            <p>Anda belum login silahkan login <Link to='/login'>disini</Link></p>
                                            <p>Anda belum mendaftar? <Link to='/register'>Daftar</Link> Sekarang</p>
                                        </div>
                                }
                            </DropdownMenu>
                        </UncontrolledDropdown>
            </div>
        )
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {

        return (
            <div className='sticky-top bg-info'>
                <Navbar id='Header' expand="lg" className='font-weight-bold'>
                    <div className='container'>
                        {
                            this.state.logOut ?
                            <Redirect to={`/`} />
                            : null
                        }
                        <NavbarToggler onClick={this.toggle} className='d-none' />

                        {/* Untuk Small Device  */}
                        <Link to='/' className='navbar-brand mx-auto justify-content-start d-flex d-lg-none'>
                            <span>Kasih</span>Nusantara
                        </Link>

                        <div className='d-flex d-lg-none' style={{
                            listStyle: 'none'
                        }}>
                            {this.renderCartAccount('text-black-50')}
                        </div>

                        <Collapse id="CollapseMaCommerce" isOpen={this.state.isOpen} navbar className='link-white d-none d-flex'>
                            {/* Untuk Large Device */}
                            <div className='container m-0 p-0'>
                                <div className='row m-0'>
                                    <div className='col-4'>
                                    <Link to='/' className='navbar-brand justify-content-start d-none d-lg-flex'>
                                        <span>Kasih</span>Nusantara
                                    </Link>
                                    </div>
                                </div>
                            </div>

                            <Nav navbar className='d-lg-flex d-none'>
                                        {this.renderCartAccount('text-black-50')}
                                    </Nav>
                        </Collapse>

                        
                    </div>
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        name: state.auth.nama,
        justRegister: state.auth.justRegister,
        userImage: state.auth.userImage,
        verified: state.auth.verified,
        loginChecked: state.auth.loginChecked,
        loading: state.auth.loading,
    }
}

export default connect(mapStateToProps, { userLogOut})(Header)