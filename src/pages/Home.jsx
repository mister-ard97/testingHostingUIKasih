import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API';

import Carousel from '../components/carousel';

class Home extends Component {
    state = {
        studentdata: [],
        countstudent: 0
    }
    componentDidMount() {
        // document.title = 'Testing App'
        window.scrollTo(0, 0);
        // Axios.get(URL_API+'/student/getstudentdatapaging',{
        //     params:{
        //         limit:5,
        //         page:1
        //     }
        // }).then(res=>{
        //     this.setState({studentdata:res.data.rows,countstudent:res.data.count})
        // })
    }

    render() {
        return (
            <div>
                {/* {
                    this.props.username !== '' ?
                        <Header statusPage='UserLogin' />
                        : 
                        null
                }

                {
                    this.props.username === '' ?
                    <Header statusPage='Home' />
                    :
                    null
                } */}
               
                
                    {/* // this.props.loading ? 
                    //    <div className='container-fluid'>
                    //        <div className="row">
                    //            <div className="col-12 text-center">
                    //                 <div className="spinner-border" role="status">
                    //                     <span className="sr-only">Loading...</span>
                    //                 </div>
                    //            </div>
                    //        </div>
                    //    </div>
                    // : */}
                    <div>
                            <Carousel />
                            <div className='row m-0'>
                                <div className='col-6 offset-3'>
                                    <Link to='/subscription' className='card bg-danger text-white'>
                                        <p className='font-weight-bold'>
                                            Subscription
                                        </p>
                                        <p>
                                            Ayo Subscribe sekarang
                                        </p>
                                    </Link>
                                </div>

                                <div className='col-6 offset-3 mt-3'>
                                    <Link to='/project-list?page=1' className='card bg-info text-warning'>
                                        <p className='font-weight-bold'>
                                            Project List
                                        </p>
                                        <p>
                                            Project Yang Bersifat One Time
                                        </p>
                                    </Link>
                                </div>
                            </div>

                            
                    </div>

                
            </div>
        )
    }
}

const mapStateToProps = ({auth, admin}) => {
    return {
        loading: auth.loading,
        email: auth.email,
        name: auth.nama,
        role: auth.role,
    }
}

export default connect(mapStateToProps, {})(Home);