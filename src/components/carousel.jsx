import React, { Component } from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { URL_API } from '../helpers/Url_API';
import Banner2 from '../assets/Banner2.png'

class CarouselCustom extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            activeIndex: 0,
            items: [
                {
                    id: 1,
                    img: Banner2,
                    altText: 'All Categories',
                    captionHeader: 'All Product For Men And Women',
                    link: '/searchproduct?allproduct=true&page=1'
                },
                {
                    id: 2,
                    img: Banner2,
                    altText: 'All Categories',
                    captionHeader: 'All Product For Men And Women',
                    link: '/searchproduct?allproduct=true&page=1'
                },
                {
                    id: 2,
                    img: Banner2,
                    altText: 'All Categories',
                    captionHeader: 'All Product For Men And Women',
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
        if (localStorage.getItem('token') !== null) {
            document.getElementById('Header').classList.add('bg-light')
        }
        if(this.props.categoryProduct) {
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
        }
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
                    <div className='boxBanner'>

                    </div>
                </CarouselItem>
            );
        });
    }

    render() {
        const { activeIndex } = this.state;

            return (
                <div id='Carousel' className='carousel-custom'>
                    <Carousel
                        activeIndex={activeIndex}
                        next={this.next}
                        previous={this.previous}
                        draggable={true}
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

const mapStateToProps = (state) => {
    
}

export default connect(mapStateToProps)(CarouselCustom);