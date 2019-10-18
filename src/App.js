import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { KeepLogin } from './redux/actions';
import './App.css';

import Header from './components/header';

import Home from './pages/Home';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifiedResetPassword from './pages/VerifiedPasswordToken';
import WaitingVerification from './pages/WaitingVerification';
import Verified from './pages/Verified';
import NotFound from './pages/NotFound';
import StudentList from './pages/StudentData'
import StudentDetail from './pages/studentdetail'

//PROJECT
import PostProject from './pages/admin/postProject';
import ProjectManage from './pages/ProjectManage';

import ProjectList from './pages/ProjectList'
import ProjectDetails from './pages/ProjectDetails'

import UserPage from './pages/User'
import VerificationUser from './pages/userFeature/verificationUser';

import ChangePassword from './pages/userFeature/changePassword'
import Payment from './pages/payment'

import Subscription from './pages/Subscription'
import BottomNav from './components/bottomNav'
import postProject from './pages/admin/postProject';

 
class App extends Component {

  componentDidMount() {
    this.props.KeepLogin();
  }

  render() {
    // checkauthChecked
    if(!this.props.authChecked) {
      return (       
          <div className='MaCommerce' >
             <Header />

            <div className="spinner-border mt-3" role="status">
              <span className="sr-only">Loading...</span>
            </div>
        </div>
      )
    }
    return (
        <div className='MaCommerce' >
    
              <Header />
              <Switch>

                <Route path='/' component={Home} exact />

                <Route path='/login' component={Login} exact />
                <Route path='/register' component={Register} exact />
                <Route path='/forgotPassword' component={ForgotPassword} />
                <Route path='/verifiedReset' component={VerifiedResetPassword} />
                <Route path='/waitingverification' component={WaitingVerification} />
                <Route path='/verified' component={Verified} />
                <Route path='/payment' component={Payment}/>
                <Route path='/student-list' component={StudentList}/>
                <Route path='/subscription' component={Subscription} />
                <Route path='/user' component={UserPage} />
                <Route path='/verificationUser' component={VerificationUser} />
                <Route path='/changePassword' component={ChangePassword} />
                <Route path='/studentdetail' component={StudentDetail} />

                {/* User */}
                <Route path='/project-list' component={ProjectList} />
                <Route path='/project-detail' component={ProjectDetails} />

                  {/* User Admin */}
                <Route path='/manage-project' component={ProjectManage}/>
                <Route path='/post-project' component={PostProject} />
                <Route path='/post-student' component={PostStudent} />

                <Route path='*' component={NotFound} />


              </Switch>

       
        {/* Route Admin */}
        {/* <Route path='/adminDashboard' component={AdminDashboard} />
        <Route path='/adminLogin' component={AdminLogin} exact />
        <Route path='/adminRegister' component={AdminRegister} exact />
        <Route path='/adminWaitingVerification' component={AdminWaitingVerification} exact />
        <Route path='/adminVerified' component={AdminVerified} /> */}
        </div>
    )
  }
} 

const mapStateToProps = ({auth}) => {
  return {
    authChecked: auth.authChecked
  }
}

export default connect(mapStateToProps, { KeepLogin })(App);
