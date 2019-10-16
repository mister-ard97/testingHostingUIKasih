import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, BottomNavigation, BottomNavigationAction, CircularProgress } from '@material-ui/core'
import { Home, Restore, Favorite, LocationCity, Folder, AccountCircle} from '@material-ui/icons';
import { connect } from 'react-redux';

class BottomNav extends Component{
    state={
        value : 'null'
    }

    handleChange=(event, newValue)=>{
        this.setState({ value: newValue})
    }

    render(){
        return(
            <div className='container mt-5'>
                <div className='row'>
                    <div style={{ position: 'fixed', bottom: 0, left: '-0.2%', zIndex: 100 }} className='offset-1 col-10 col-sm-8 offset-sm-2 col-md-6 offset-md-3'>
                    <BottomNavigation value={this.state.value} onChange={this.handleChange}>
                            <BottomNavigationAction 
                                label="Home"
                                value='home' 
                                icon={<Home />} 
                                component={Link}
                                to='/' 
                                className='mt-2'
                                showLabel={true}
                            />
                        
                            <BottomNavigationAction 
                                label="Kategory" 
                                value='category' 
                                icon={<Restore/>}
                                component={Link}
                                to='/categoryCampaign' 
                                className='mt-2'
                                showLabel={true}
                            />
                        
                        <BottomNavigationAction label="Test2" value='folder' icon={<Folder/>}/> 

                        {
                            this.props.loading ?
                                   <CircularProgress 
                                    size={30}
                                    color='secondary'
                                    className='mt-2'
                                   />
                                    :
                                    <BottomNavigationAction
                                        label={
                                            this.props.name === '' ?
                                                "Login"
                                                :
                                                this.props.name.split(' ')[0]
                                        }
                                        value={
                                            this.props.name === '' ?
                                                'login'
                                                :
                                                'user'
                                        }
                                        icon={<AccountCircle />}
                                        component={Link}
                                        to={
                                            this.props.name === '' ?
                                                '/login'
                                                :
                                                '/user'
                                        }
                                        className='mt-2'
                                        showLabel={true}
                                    />
                        }
                        
                       
                    </BottomNavigation>

                </div>
            </div>
            </div>
        )
    }
}

const mapStateToProps = ({register}) => {
    return {
        loading: register.loading,
        name: register.name
    }
}

export default connect(mapStateToProps)(BottomNav);