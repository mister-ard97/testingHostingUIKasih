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

class CarouselCustom extends Component {

    render() {

        return (
            <div className='row m-0 mb-3'>
                <div className='col-12 m-0 p-0'>
                    <img src='https://ecs7.tokopedia.net/blog-tokopedia-com/uploads/2018/10/DONASI-PALU-1068x601.jpg' alt='home-banner'
                    style={{
                        width: '100%'
                        
                    }}
                    />
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
