import React, { Component }  from 'react'
import {Link, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { userLogOut } from '../redux/actions';

class UserPage extends Component {
    state = {
        logOut: false
    }

    userLogOut = () => {
        this.props.userLogOut()
        this.setState({
            logOut: true
        })
    }

    render() {

        if(this.props.email !== ''){

            return (
                <div className='container'>
                    {
                        this.state.logOut ?
                        <Redirect to='/' />
                        :
                        null
                    }
                    <div className='form-group border-botton'>
                        <Link to='/verificationUser'>
                            <p>Verification Account</p>
                        </Link>
                    </div>
                    <div className='form-group border-botton'>
                        <Link to='/changePassword'>
                            <p>Change My Password </p>
                        </Link>
                    </div>
                    <button onClick={this.userLogOut}>
                        Log Out
                    </button>
                </div>
            )
        }else {
            return(
                <Redirect to='/' />
              
            )
        }
    }
}

const mapStateToProps = ({auth}) => {
    return {
        email : auth.email
    }
}

export default connect(mapStateToProps, {userLogOut})(UserPage);