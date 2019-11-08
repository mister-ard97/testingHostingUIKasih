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
import Banner2 from '../assets/Banner2.png'

class CarouselCustom extends Component {

    render() {

        return (
           <div className='container-fluid p-0 Banner-Home'>
                <div className='row m-0 mb-3'>
                    <div className='col-12 m-0 p-0'>
                        <div className='boxBanner px-5 text-white'>
                            <h2 className='mb-4'>TAKE ACTION</h2>
                            <p className='d-none d-md-flex'>
                                Get involved, speak out, <br /> or become a donor and give every child a fair
                                chance for education
                            </p>
                            <p className='d-none d-md-flex' style={{fontSize: '30px'}}>#Bersamamembangunbangsa</p>
                            <div className='flex-column d-none d-md-flex'>
                                <div className="sharebutton"></div>
                                <div className="donatebutton">SHARE YOUR DONATE</div>
                            </div>
                        </div>
                        <img src={Banner2} alt='home-banner' />
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
