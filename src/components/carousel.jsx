import React, { Component } from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { URL_API } from '../helpers/Url_API'
import Banner1 from '../assets/Banner1.png'

class CarouselCustom extends Component {

    render() {

        return (
           <div className='container-fluid p-0'>
                <div className='row m-0 mb-3'>
                    <div className='col-12 m-0 p-0'>
                        <img src={Banner1} alt='home-banner'
                            style={{
                                width: '100%'

                            }}
                        />
                    </div>
                </div>
           </div>
        )
        
    }
}

const mapStateToProps = ({auth}) => {
    return {
        email: auth.email
    }
}

export default connect(mapStateToProps)(CarouselCustom);
