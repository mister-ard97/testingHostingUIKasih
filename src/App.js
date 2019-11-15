import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { KeepLogin } from './redux/actions';
import './util.css'
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
import StudentList from './pages/AllStudentList'
import StudentDetail from './pages/StudentDetails'

// ADMIN 
import AdminVerifyDetail from './pages/admin/verifydetail'
import ManageScholarship from './pages/admin/manageScholarship'
import AdminReviewStudentDetail from './pages/admin/reviewStudentDetail';
import ManageSchool from './pages/admin/manageSchool'

//PROJECT
// import PostStudent fro
import PostProject from './pages/admin/postProject';
import ProjectManage from './pages/admin/ProjectManage';
import AdminVerifyPage from './pages/admin/adminVerify';

import ProjectList from './pages/ProjectList';
import ScholarshipListHome from './pages/ScholarshipListHomeUI';
import ProjectDetails from './pages/ProjectDetails';
import ScholarshipStudent from './pages/ScholarshipDetailHome';

import UserPage from './pages/User'
import VerificationUser from './pages/userFeature/verificationUser';

import Payout from './pages/userFeature/payout'

import ChangePassword from './pages/userFeature/changePassword'
import Payment from './pages/payment'
import History from './pages/historyDonasi'
import PaymentFinish from './pages/paymentFinish'
import PaymentError from './pages/paymentError'
import PaymentPending from './pages/paymentPending'
import ScholarshipAdd from './pages/userFeature/ScholarshipAdd'
import ScholarshipList from './pages/userFeature/ScholarshipList'
import ScholarshipDetail from './pages/userFeature/ScholarshipDetail';
import Footer from './components/footer'
import Subscription from './pages/Subscription'
import BottomNav from './components/bottomNav'
import postProject from './pages/admin/postProject';
import SchoolList from './pages/userFeature/SchoolList';
import SchoolAdd from './pages/userFeature/SchoolAdd'
import {URL_API} from './helpers/Url_API'

import Adapter from './helpers/ckfinder/core/connector/php/connector.php'
import io from 'socket.io-client'
 
class App extends Component {

  componentDidMount() {
    console.log('asd')
    const socket = io(URL_API) //localhost 
    this.props.KeepLogin();

    // const socket = io(URL_API)
    // console.log(socket)
    // socket.on('status_transaction', this.updateStatus)
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
        <div className='mb-0 pb-0 ' >
              { /* Buat Route untuk User dan User Admin */ }
              <div style={{minHeight : '40vh'}}>
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
                <Route path='/history' component={History}/>
                <Route path='/subscription' component={Subscription} />
                <Route path='/user' component={UserPage} />
                <Route path='/verificationUser' component={VerificationUser} />
                <Route path='/changePassword' component={ChangePassword} />
                <Route path='/studentdetail' component={StudentDetail} />
                <Route path='/paymentFinish' component={PaymentFinish}/>
                <Route path='/paymentError' component={PaymentError}/>
                <Route path='/paymentPending' component={PaymentPending}/>
                
                {/* User */}
                <Route path='/studentlist' component={StudentList}/>
                <Route path='/project-list' component={ProjectList} />
                <Route path='/scholarship-list' component={ScholarshipListHome} />
                <Route path='/project-detail' component={ProjectDetails} />
                <Route path='/scholarship-student' component={ScholarshipStudent} />
                <Route path='/addScholarship' component={ScholarshipAdd}/>
                <Route path='/scholarshiplist' component={ScholarshipList}/>
                <Route path='/scholarshipDetail' component={ScholarshipDetail}/>
                <Route path='/payout' component={Payout}/>
                <Route path='/schoollist' component={SchoolList}/>    
                <Route path='/schooladd' component={SchoolAdd}/>

                {/* User Admin */}
                <Route path='/manage-project' component={ProjectManage}/>
                <Route path='/post-project' component={PostProject} />
                <Route path='/adminverify-detail' component={AdminVerifyDetail} />
                <Route path='/adminverify' component={AdminVerifyPage} />
                <Route path='/manageScholarship' component={ManageScholarship}/>
                <Route path='/studentdetail-review' component={AdminReviewStudentDetail} />
                <Route path='/manageSchool' component={ManageSchool}/>
                {/* <Route path='/post-student' component={PostStudent} /> */}

                <Route path='*' component={NotFound} />
              </Switch>
              </div>
              <Footer/>
         

       
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
