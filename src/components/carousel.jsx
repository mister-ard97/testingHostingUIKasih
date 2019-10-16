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
    constructor(props) {
        super(props);
        this.state = { 
            activeIndex: 0,
            items: [
                {
                    id: 1,
                    img: 'https://firebasestorage.googleapis.com/v0/b/southern-waters-642.appspot.com/o/web_homebanner%2FHERO%20BANNER%20(1).png?alt=media&token=cd5ce45c-3025-4875-a28f-28fa3aa928e1',
                    altText: 'Penggalangan dana poster',
                    captionHeader: 'Mari membantu Sesama dengan membuat penggalangan Dana',
                    link: '/searchproduct?allproduct=true&page=1'
                }
            ]
        };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
    }

    componentDidMount() {
        /* if(this.props.categoryProduct) {
            let categoryList = this.props.categoryProduct.map((val) => {
                return {
                    id: val.id, 
                    img: `${URL_API}${val.categoryImage}`,
                    altText: `Product for ${val.name}`,
                    captionHeader: `All Product For ${val.name}`,
                    link: `/searchproduct?product=${val.name}&page=1`
                }
            })
            this.setState({
                items: [...this.state.items, ...categoryList]
            })
        } */
    }

    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === this.state.items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? this.state.items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
    }

    renderCarousel = () => {
        // renderCarousel render category with image
        return this.state.items.map((item) => {
            return (
                <CarouselItem
                    className="custom-items"
                    tag="div"
                    key={item.id}
                    onExiting={this.onExiting}
                    onExited={this.onExited}
                >
                    <img src={item.img} alt={'Carousel-' + item.altText} className='img-fluid' />
                    <div className='carousel-caption text-left pb-0 pt-5 pt-sm-0'>
                        <div className='container d-flex justify-content-end opacity-carousel-items'>
                        
                        </div>
                    </div>
                </CarouselItem>
            );
        });
    }

    render() {
        const { activeIndex } = this.state;

        if(this.props.username !== '') {
            return (
                <div className='container'>
                    <div className="row justify-content-between mt-4">
                        <div className='col-12 col-lg-6 order-2 order-lg-1 text-center text-sm-left'>
                            <h5>Menu User</h5>
                            <div className='card'>
                                <div className='card-body'>
                                    <Link className='text-dark' to='/changeAddress'>
                                        Change Address Shipment
                                    </Link>
                                </div> 
                                <div className='card-body'>
                                    <Link className='text-dark' to='/transaction_list'>
                                        Transaction History
                                    </Link>
                                </div> 
                                <div className='card-body'>
                                    <Link className='text-dark' to='/wishlist'>
                                        Wishlist User
                                    </Link>
                                </div> 
                            </div>
                           
                        </div>
                        <div className="col-12 col-lg-6 order-1 order-lg-2">
                            <div id='Carousel' className='carousel-custom-user'>
                                <Carousel
                                    activeIndex={activeIndex}
                                    next={this.next}
                                    previous={this.previous}
                                    autoPlay={true}
                                    ride="carousel"
                                >
                                    <CarouselIndicators items={this.state.items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                                    {this.renderCarousel()}
                                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                                    <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div id='Carousel' className='carousel-custom'>
                    <Carousel
                        activeIndex={activeIndex}
                        next={this.next}
                        previous={this.previous}
                        autoPlay={true}
                        ride="carousel"
                    >
                        <CarouselIndicators items={this.state.items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                        {this.renderCarousel()}
                        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                    </Carousel>
                </div>
            )
        }

        
    }
}

const mapStateToProps = ({auth}) => {
    return {
        username: auth.username
    }
}

export default connect(mapStateToProps)(CarouselCustom);
