import React, { Component } from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators
} from 'reactstrap';
import { connect } from 'react-redux';
import { URL_API } from '../helpers/Url_API';
import Banner1 from '../assets/Banner1.png';
import Banner2 from '../assets/Banner2.png';
import Banner3 from '../assets/Banner3.png';

class CarouselCustom extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            activeIndex: 0,
            items: [
                {
                    id: 1,
                    img: Banner1,
                    title: 'TAKE ACTION',
                    description: <p className='d-none d-md-flex'>Get involved, speak out, <br />
                    or become a donor and give every child a fair chance for education</p>,
                },
                {
                    id: 2,
                    img: Banner2,
                    title: 'SHARE WITH OTHERS',
                    description: <p className='d-none d-md-flex'>Share with others can make a better world.</p>,
                },
                {
                    id: 3,
                    img: Banner3,
                    title: 'HELP OUR STUDENT',
                    description: <p className='d-none d-md-flex'>Help our students. So they can make an innovation.</p>,
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
                    className=""
                    tag="div"
                    key={item.id}
                    onExiting={this.onExiting}
                    onExited={this.onExited}
                >
                    <div className='container-fluid p-0 Banner-Home' style={{background: `url(${item.img}) no-repeat`}}>
                        <div className='row m-0 mb-3'>
                            <div className='col-12 m-0 p-0'>
                                <div className='boxBanner px-5 text-white'>
                                    <h2 className='mb-4'>{item.title}</h2>
                                    {item.description}
                                    <p className='d-none d-md-flex' style={{fontSize: '30px'}}>#Bersamamembangunbangsa</p>
                                </div>
                            </div>
                        </div>
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
                        interval={4000}

                        ride="carousel"
                    >
                        <CarouselIndicators items={this.state.items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                        {this.renderCarousel()}
                        {/* <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} /> */}
                    </Carousel>
                </div>
            )
    }
}

const mapStateToProps = (state) => {
    return {
        
    }
}

export default connect(mapStateToProps)(CarouselCustom);