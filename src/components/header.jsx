import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { userLogOut } from '../redux/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { URL_API } from '../helpers/Url_API';
import Logo from '../assets/logo/logo.jpg'

import Headroom from 'headroom.js'

class Header extends Component {
    state = {
        isOpen: false,
        login: false,
        loadingLogin: '',
        logOut: false,
        dropdownOpen : false
    }

    componentDidMount() {
        
        let headroom = new Headroom(document.getElementById('Header'), {
			"offset": 0,
			"tolerance": 5,
			"classes": {
			  "initial": "headroom",
			  "pinned": "headroom-pinned",
			  "unpinned": "headroom-unpinned"
			}
          });
          console.log(headroom)
          headroom.init();
    }


    userLogOut = () => {
        this.props.userLogOut();
        this.setState({
            logOut: true,
            dropdownOpen : false
        })
    }

    onMouseEnter() {
        this.setState({dropdownOpen: true});
    }
    
    onMouseLeave() {
        this.setState({dropdownOpen: false});
    }

    renderCartAccount = (param) => {
        return (
            <div className='navbar-nav-cust d-flex font-weight-normal'>
                        <UncontrolledDropdown  onMouseOver={()=>this.onMouseEnter()} onMouseLeave={()=>this.onMouseLeave()} isOpen={this.state.dropdownOpen} nav inNavbar>                            
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
                                                <div style={{width: 40}} >
                                                 
                                                    <img src={`${URL_API}/${this.props.userImage}`} alt={'User' + this.props.name} className='img-fluid ' style={{borderRadius: 40}}/>
                                                </div>
                                                :
                                                <div className='font-weight-bold rounded px-1'>
                                                    <span className='text-dark mr-2'>Login</span>
                                                    <FontAwesomeIcon icon={faUserCircle} className={param} />
                                                </div>

                                        }

                                    </DropdownToggle>
                            }
                            <DropdownMenu right={true} className='px-2 userDropdown' id='loginDropdown' style={{width : '19vw'}} >
                                {
                                    this.props.name !== '' ?
                                        
                                        this.props.justRegister ?
                                            <div className="fade-in">
                                                {
                                                    this.props.verified === 0 ?
                                                    <p style={{color: '#D32242'}}>Anda belum verifikasi email <Link to='/waitingverification'> Klik Untuk Verification </Link></p>
                                                    :
                                                    null
                                                }
                                                <p>Selamat Bergabung di Kasih Nusantara, {this.props.name}</p>
                                                <a href='/changePassword' className='border-bottom d-block'> Change Password </a>
                                                <a href='/subscription' className='border-bottom d-block'> My Subscription </a>
                                                <a href='/studentlist?page=1' className='border-bottom d-block'> Student List </a>
                                                <a href='/manageschool' className='border-bottom d-block'> School List </a>
                                                <a href='/scholarshiplist' className='border-bottom d-block'> Project Scholarship List </a>
                                                <Link to='/' onClick={this.userLogOut}> Log Out </Link>
                                               
                                            </div>
                                        :
                                            this.props.role !== 'User Admin' ?
                                            <div className="fade-in">
                                                {
                                                    this.props.verified === 0 ?
                                                        <p style={{color: '#D32242'}}>Anda belum verifikasi email <a href='/waitingverification'> Klik Untuk Verification </a></p>
                                                        :
                                                        null
                                                }
                                                <p>Selamat Datang Kembali, {this.props.name}</p>
                                                <a href='/changePassword' className='border-bottom d-block'> Change Password </a>
                                                <a href='/subscription' className='border-bottom d-block'> My Subscription </a>
                                                <a href='/studentlist?page=1' className='border-bottom d-block'> Student List </a>
                                                <a href='/manageschool' className='border-bottom d-block'> School List </a>
                                                <a href='/scholarshiplist' className='border-bottom d-block'> Project Scholarship List </a>
                                                <Link to='/' onClick={this.userLogOut}> Log Out </Link>
                                                
                                            </div>
                                            :
                                            <div className="fade-in">
                                                <p>Selamat Datang Kembali, {this.props.name}</p>
                                                <a href='/changePassword' className='border-bottom d-block'> Change Password </a>
                                                <a href='/studentlist' className='border-bottom d-block'> Student List </a>
                                                <a href='/manage-project' className='border-bottom d-block'> Project List </a>
                                                <a href='/post-project' className='border-bottom d-block'> Post Project </a>
                                                <a href='/manageschool' className='border-bottom d-block'> School List </a>
                                                <a href='/scholarshiplist' className='border-bottom d-block'> Project Scholarship List </a>
                                                <Link to='/' onClick={this.userLogOut}> Log Out </Link>
                                            </div>

                                            
                                    :
                                        <div className="fade-in">
                                            <p>Anda belum login silahkan login <a href='/login'>disini</a></p>
                                            <p>Anda belum mendaftar? <a href='/register'>Daftar</a> Sekarang</p>
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
            <div className='container-fluid header' style={{zIndex: '100'}}>
                <Navbar id='Header' expand="lg" className='font-weight-bold bg-white' fixed='top'>
                        {
                            this.state.logOut ?
                            <Redirect to={`/`} />
                            : null
                        }
                        <a to='/' className='navbar-brand justify-content-start d-flex p-0 pl-md-5'>
                            <img src={Logo} alt={'Logo-Kasih Nusantara'}/>
                        </a>
                            
                        <NavbarToggler className='costum-toggler' onClick={() => this.toggle()} />

                        <Collapse isOpen={this.state.isOpen} navbar>
                            {/* Untuk Large Device */}

                            <div className='container-fluid m-0 p-0'>
                                <div className='row m-0'>
                                    <div className='col-12 d-flex justify-content-start justify-content-md-end pr-5'>
                                        
                                        <Nav navbar className='d-flex navbar-custom'>
                                                <NavItem className='mx-3'>
                                                    <NavLink href="#">Home</NavLink>
                                                </NavItem>
                                                <NavItem className='mx-3'>
                                                    <NavLink href="#">Scholarship</NavLink>
                                                </NavItem>
                                                <NavItem className='mx-3'>
                                                    <NavLink href="#">Project</NavLink>
                                                </NavItem>
                                                <NavItem className='mx-3'>
                                                    <NavLink href="#">About Us</NavLink>
                                                </NavItem>
                                            {this.renderCartAccount('text-black-50')}
                                        </Nav>
                                    </div>
                                </div>
                            </div>

                           
                        </Collapse>

                        
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth : state.auth,
        name: state.auth.nama,
        justRegister: state.auth.justRegister,
        userImage: state.auth.userImage,
        verified: state.auth.verified,
        loginChecked: state.auth.loginChecked,
        loading: state.auth.loading,
        role: state.auth.role
    }
}

export default connect(mapStateToProps, { userLogOut})(Header)