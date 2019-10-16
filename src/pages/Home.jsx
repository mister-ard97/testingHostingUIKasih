import React, { Component } from 'react';
import { connect } from 'react-redux';

import Carousel from '../components/carousel';

class Home extends Component {
    componentDidMount() {
        // document.title = 'Testing App'
        window.scrollTo(0, 0);
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
                            <h1>1</h1>
                            <h1>2</h1>
                            <h1>3</h1>
                            <h1>4</h1>
                            <h1>1</h1>
                            <h1>2</h1>
                            <h1>3</h1>
                            <h1>4</h1>
                    </div>

                
            </div>
        )
    }
}

const mapStateToProps = ({auth, admin}) => {
    return {
        loading: auth.loading,
        email: auth.email,
        name: auth.name,
        role: auth.role,
    }
}

export default connect(mapStateToProps, {})(Home);