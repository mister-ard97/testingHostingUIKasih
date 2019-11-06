import React, { Component } from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API';
import Logo from '../assets/logo/logo_without_text.png'
import Carousel from '../components/carousel';
import LogoGray from '../assets/logo/logo_text_bottom_gray.png'
import queryString from 'query-string';
import numeral from 'numeral'

import { Pagination, PaginationItem, PaginationLink,  Progress } from 'reactstrap';



class Home extends Component {
    state = {
        ProjectList: [],
        ScholarshipList: [],
        
        totalpage : 0,
        totalpagescholar: 0,

        searchText: '',
        searchTextScholarship: '',

        orderby: 'asc',
        orderbyScholarship: 'asc',
    
        scholarshipList : [],

        // temporary 
        orderId : ''
    }
    
    componentDidMount() {
        // document.title = 'Testing App'
        // if(!parsed.page){
        //     parsed.page = 1
        // }

        // let limit = 4

        // window.scrollTo(0, 0);
        // Axios.get(URL_API + `/project/getAllProject?page=${1}&limit=4`)
        //     .then((resProject) => {
        //         var results = resProject.data.result.map((val,id)=>{
        //             var hasil = {...val, ...val.User}
        //             delete hasil.User
        //             return hasil
        //         })

        //         console.log(results)

        //         this.setState({
        //             ProjectList : results,
        //             totalpage: Math.ceil(resProject.data.total / limit),
        //             // studentdata: resStudent.data.rows
        //         })
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
        this.getProjects()
        
        this.getScholarshipList()

    }

    getProjects = () =>{
        let limit = 4
        let data = {
            name: '',
            page: 1,
            date: 'ASC',
            limit
        }
        Axios.post(URL_API + `/project/searchproject`, data)
        .then((res) => {
            console.log(res.data.results)
            // var results = res.data.results.map((val,id)=>{
                
                
            //     var hasil = {...val, ...val.User,...val.Payments[0]}
            //     console.log(hasil)
            //     delete hasil.User
            //     delete hasil.Payments
      
                
            //     return hasil
            // })
  
            //     this.setState({
            //         ProjectList: results,
            //         totalpage: Math.ceil(res.data.total / limit),
            //     })
            this.setState({
                

                ProjectList: res.data.results,
                totalpage: Math.ceil(res.data.total / limit),
            })
            
        })
        .catch((err) => {
            console.log(err)
        })
    }

    getScholarshipList = () =>{
        let limit = 12
        let data = {
            name: '',
            page: 1,
            date: 'ASC',
            limit
        }

        Axios.post(URL_API+'/scholarship/getscholarship', data)
        .then((res)=>{
            console.log(res)
            var results = res.data.map((val)=>{
                var hasil = {...val, ...val.School, ...val.Student, ...val.Subscriptions[0]}
                delete hasil.School
                delete hasil.Student
                delete hasil.Subscriptions
                hasil.totaldonation = parseInt(hasil.totaldonation)
                hasil.grandtotal = parseInt(hasil.totaldonation) + parseInt(hasil.currentSubs ? hasil.currentSubs : 0)
               
                return hasil
            })

            console.log(results)

            this.setState({
                scholarshipList : results
            })
            console.log(results)
            
        })
        .catch((err)=>{
           console.log(err)
        })
    }


    // renderScholarshipList = () =>{
    //     if(this.state.scholarshipList.length !== 0){
    //         return this.state.scholarshipList.map((val,id)=>{
    //             val.currentSubs = parseInt(val.currentSubs)
    //             return(
    //                 <a href={`/scholarship-student?id=${val.id}`} className='card p-3 text-dark border border-light my-3' style={{textDecoration: 'none'}}>
    //                         <div className='row'>
    //                         <div className='col-4'>
    //                             <img src={`${URL_API}${val.studentImage}`} alt={`${val.studentImage}-banner`} className='img-fluid width-100' style={{height : '410px'}}/>
    //                         </div>
    
    //                         <div className='col-8'>
    //                             <h2 className="mb-2">{val.judul}</h2>
    //                             {/* <p className='font-weight-bold'>{val.projectCreator}</p>
    //                             <h6>Project Created</h6> */}
    //                             {/* <p>{new Date(val.projectCreated).toLocaleDateString('id-IND')}</p>
    //                             <h6>Project Ended</h6>
    //                             <p>{new Date(val.projectEnded).toLocaleDateString('id-IND')}</p> */}
    //                             <p>{val.nominal}</p>
    //                             <Progress  className="font-weight-bold mb-3" animated value={(parseInt(val.currentSubs+val.totaldonation) / val.nominal) * 100 ? (parseInt(val.currentSubs+val.totaldonation) / val.nominal) * 100  : 0} >
    //                             {(parseInt(val.currentSubs+val.totaldonation) / val.nominal) * 100 ? (parseInt(val.currentSubs+val.totaldonation) / val.nominal) * 100  : 0}%
    //                             </Progress>
    //                             <div className="d-flex flex-row mb-3">
    //                                 <div className="mr-4">
    //                                     <h4>Dana yang terkumpul </h4>
    //                                     <input type="text" className="form-control" value={`Rp. ${numeral(parseInt(val.currentSubs + val.totaldonation)).format(0,0)}`} disabled/>
    //                                 </div>

    //                                 <div>
    //                                     <h4>Dana yang dibutuhkan :  </h4>
    //                                     <input type="text" className="form-control" value={`Rp. ${numeral(parseInt(val.nominal)).format(0,0)}`} disabled/>
    //                                 </div>
    //                             </div>
                       
    //                             <h5>Banyaknya Donasi </h5>
    //                             <div className="text-gray mb-3"> {val.jumlahdonation} Donasi </div>
    //                             <h5>Sisa Hari </h5>
    //                             <div className="text-gray mb-3"> {val.SisaHari} Hari </div>
    //                             <div className="row">
    //                                 <div className="col-md-5">
    //                                     <a className='btn btn-dark form-control font-weight-bolder' href={`/scholarship-student?id=${val.id}`} style={{textDecoration: 'none'}}>Lihat Detail Student</a>
    //                                 </div>
    //                                 <div className="col-md-7">
    //                                     <div className=" d-flex flex-row justify-content-end">
    //                                         <div>
    //                                             {/* <FacebookShareButton  className='btn btn-primary mr-2'>
    //                                                 <div className="d-flex flex-row">
    //                                                     <FacebookIcon size={32} round={true}  />
    //                                                     <div className="pt-1 ml-2">Share Facebook</div>
    //                                                 </div>
    //                                             </FacebookShareButton>
    //                                             <WhatsappShareButton className='btn btn-success'>
    //                                                 <div className="d-flex flex-row">
    //                                                     <WhatsappIcon size={32} round={true}  />
    //                                                     <div className="pt-1 ml-2">Share Whatsapp</div>
    //                                                 </div>
    //                                             </WhatsappShareButton> */}
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                         </div>
    //                     </a>
    //             )
    //         })
    //     }
    // }


    // UNTUK SLIDER FUNCTION YANG SEBELUMNYA BELUM DIHAPUS MASIH DIATASNYA
    
    renderScholarshipListSlider = () => {
        if(this.state.scholarshipList.length !== 0){
            return this.state.scholarshipList.map((val,id)=>{
                val.currentSubs = parseInt(val.currentSubs)
                return(
                    <a href={`/scholarship-student?id=${val.id}`} className='card bg-scholarship text-center py-5'>
                           
                        <div className='container-fluid'>
                            <div className='col-12 d-flex justify-content-center'>
                                    <img 
                                        src={`${URL_API}${val.studentImage}`} 
                                        alt={`${val.studentImage}-banner`} className='profile-student' 
                                        // style={{width : '80px', borderRadius: '80px', height: '80px'}}
                                    />
                            </div>

                            <div className='col-12'>
                                {/* <div style={{height: '70px'}}>
                                    
                                </div> */}
                                    <p className="my-3">{val.namaSiswa}</p>
                                    <p className="my-3">{val.namaSekolah}</p>
                                <p>{val.nominal}</p>
                            </div>
                        </div>
                        
                    
                        
                    </a>
                )
            })
        }
    }


    
    // renderProjectList = () => {

    //     if(this.state.ProjectList.length !== 0) {
    //         return this.state.ProjectList.map((val, index) => {
    //             return (
    //                 <a href={`project-detail?id=${val.projectId}`} className='card mt-3' key={index}>
    //                 <div className='row'>
    //                     <div className='col-4'>
    //                         <img src={`${URL_API}${val.projectImage}`} alt={`${val.projectName}-banner`} className='img-fluid width-100' />
    //                     </div>

    //                     <div className='col-8'>
    //                         <h2 className="mb-2">{val.projectName}</h2>
    //                         <p>{val.totalNominal}</p>
    //                         <Progress  className="font-weight-bold mb-3" animated value={(val.totalNominal / val.totalTarget) * 100 ? ((val.totalNominal / val.totalTarget) * 100).toFixed(2) : 0} >
    //                         {(val.totalNominal / val.totalTarget) * 100 ? ((val.totalNominal / val.totalTarget) * 100).toFixed(2)  : 0}%
    //                         </Progress>
    //                         <h5>Dana yang terkumpul </h5>
    //                         <div className="text-gray mb-3 font-weight-bolder"> Rp. {numeral(parseInt(val.totalNominal)).format(0,0)}  </div>
    //                         <h5>Banyaknya Donasi </h5>
    //                         <div className="text-gray mb-3"> {val.totalDonasi} Donasi </div>
    //                         <h5>Sisa Hari </h5>
    //                         <div className="text-gray mb-3"> {val.SisaHari} Hari </div>
    //                         <h4>Dana yang dibutuhkan :  </h4>
    //                         <h6>Rp. {numeral(val.totalTarget).format(0,0)}</h6>
    //                     </div>
    //                 </div>
    //             </a>    
    //             )
    //         })
            
    //     } else {
    //         return (
    //             <h4 className='text-center'>Project sedang tidak ada yang jalan. Silahkan kembali lagi nanti.</h4>
    //         )
    //     }
    // }

    renderProjectListSlider = () => {
        if (this.state.ProjectList.length !== 0) {
            return this.state.ProjectList.map((val, index) => {
                return (
                    <div key={index}>
                    <a href={`project-detail?id=${val.projectId}`} className='card border-0 mt-3 bg-projects' style={{height: '400px'}}>
                        <div className='row'>
                            <div className='col-7 py-5 pl-5 d-flex flex-column justify-content-between'>
                                <img src={Logo} alt='Logo-KasihNusantara' style={{width: '50px'}} className='mb-3' />
                                <h1 className="mb-3 font-size-36">Help Andika to survive his illness Project-{val.projectId}</h1>
                                <h5 className='mb-3'>{val.shareDescription}</h5>
                                <h5>#TogetherWeCan</h5>
                            </div>
                            <div className='col-5'>
                                <img src={`${URL_API}${val.projectImage}`} alt={`${val.projectName}-banner`} />
                            </div>
                        </div>
                        
                    </a>
                    <div className='container-fluid'>
                            <div className='row m-0'>
                                    <div className='col-12 d-flex justify-content-center'>
                                         <a href={`project-detail?id=${val.projectId}`} className="learnmorebutton">PELAJARI LEBIH LANJUT</a>
                                    </div>
                            </div>
                        </div>
                    </div>

                )
            })

        } else {
            return (
                <h4 className='text-center'>Project sedang tidak ada yang jalan. Silahkan kembali lagi nanti.</h4>
            )
        }
    }

    // renderScholarshipStudentList = () => {
    //     if(this.state.ScholarshipList) {
    //         if(this.state.ScholarshipList.length !== 0) {
    //             return this.state.ScholarshipList.map((val, index) => {
    //                 const {namaSiswa, studentImage} = this.state.ScholarshipList[index].Student
    //                 const { namaSekolah } = this.state.ScholarshipList[index].School
    //                 const { judul, nominal, description, shareDescription, durasi, scholarshipStart, scholarshipEnded} = this.state.ScholarshipList[index]
    //                 return (
    //                     <a href={`scholarship-student?id=${val.projectId}`} className='card mt-3' key={index}>
    //                     <div className='row'>
    //                         <div className='col-4'>
    //                             <img src={`${URL_API}${val.studentImage}`} alt={`${val.namaSiswa}-banner`} className='img-fluid width-100' />
    //                         </div>
    
    //                         <div className='col-8'>
    //                             <h2 className="mb-2">{val.projectName}</h2>
    //                             <p>{val.totalNominal}</p>
    //                             <Progress  className="font-weight-bold mb-3" animated value={(val.totalNominal / val.totalTarget) * 100 ? (val.totalNominal / val.totalTarget) * 100  : 0} >
    //                             {(val.totalNominal / val.totalTarget) * 100 ? (val.totalNominal / val.totalTarget) * 100  : 0}%
    //                             </Progress>
    //                             <h5>Dana yang terkumpul </h5>
    //                             <div className="text-gray mb-3 font-weight-bolder"> Rp. {numeral(parseInt(val.totalNominal)).format(0,0)}  </div>
    //                             <h5>Banyaknya Donasi </h5>
    //                             <div className="text-gray mb-3"> {val.totalDonasi} Donasi </div>
    //                             <h5>Sisa Hari </h5>
    //                             <div className="text-gray mb-3"> {val.SisaHari} Hari </div>
    //                             <h4>Dana yang dibutuhkan :  </h4>
    //                             <h6>Rp. {numeral(val.totalTarget).format(0,0)}</h6>
    //                         </div>
    //                     </div>
    //                 </a>    
    //                 )
    //             })
                
    //         } else {
    //             return (
    //                 <h4 className='text-center'>Project sedang tidak ada yang jalan. Silahkan kembali lagi nanti.</h4>
    //             )
    //         }
    //     } else {
    //         return (
    //             <h4>Loading...</h4>
    //         )
    //     }
    // }

    // renderPagingButton = () =>{
    //     if(this.state.totalpage !== 0){
            
    //         var jsx = []
    //         const parsed = queryString.parse(this.props.location.search);
    //         for(var i = 0; i<this.state.totalpage; i++){
    //             if(parsed.search || parsed.orderby) {
    //                 jsx.push(
    //                     <PaginationItem>
    //                        <PaginationLink href={`/project-list?search=${parsed.search}&orderby=${parsed.orderby}&page=${i+1}`}>
    //                            {i+1}
    //                        </PaginationLink>
    //                    </PaginationItem>
    //                 )
    //             } else {
    //                 jsx.push(
    //                     <PaginationItem>
    //                        <PaginationLink href={`/project-list?page=${i+1}`}>
    //                            {i+1}
    //                        </PaginationLink>
    //                    </PaginationItem>
    //                )
    //             }
    //         }
    //         return jsx
    //     }
    // }

    // printPagination = () =>{
    //     if(this.state.totalpage !== 0){
    //         const parsed = queryString.parse(this.props.location.search);
    //         var currentpage = parsed.page
    //         if(parsed.search || parsed.orderby) {
    //             console.log('Masuk')
    //             return (
    //                 <Pagination aria-label="Page navigation example">
    //                 <PaginationItem>
    //                     <PaginationLink first href={`/project-list?search=${parsed.search}&orderby=${parsed.orderby}&page=1`} />
    //                   </PaginationItem>
    //                   <PaginationItem>
    //                     <PaginationLink previous
    //                      href={`/project-list?search=${parsed.search}&orderby=${parsed.orderby}&page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
    //                   </PaginationItem>
    //                     {this.renderPagingButton()}
    //                   <PaginationItem>
    //                     <PaginationLink next 
    //                     href={`/project-list?search=${parsed.search}&orderby=${parsed.orderby}&page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
    //                     this.state.totalpage : parseInt(currentpage) + 1}`} />
    //                   </PaginationItem>
    //                   <PaginationItem>
    //                     <PaginationLink last href={`/project-list?search=${parsed.search}&orderby=${parsed.orderby}&page=${this.state.totalpage}`} />
    //                   </PaginationItem>
    //                 </Pagination>
    //             )
    //         } else {
    //             return (
    //                 <Pagination aria-label="Page navigation example">
    //                 <PaginationItem>
    //                     <PaginationLink first href={`/project-list?page=1`} />
    //                   </PaginationItem>
    //                   <PaginationItem>
    //                     <PaginationLink previous
    //                      href={`/project-list?page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
    //                   </PaginationItem>
    //                     {this.renderPagingButton()}
    //                   <PaginationItem>
    //                     <PaginationLink next 
    //                     href={`/project-list?page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
    //                     this.state.totalpage : parseInt(currentpage) + 1}`} />
    //                   </PaginationItem>
    //                   <PaginationItem>
    //                     <PaginationLink last href={`/project-list?page=${this.state.totalpage}`} />
    //                   </PaginationItem>
    //                 </Pagination>
    //             )
    //         }
    //     }
    // }

    

    /* searchProject() {
        this.setState({
            searchProject: true,
            searchText: this.searchText.value,
            orderby: this.selectOrder.value
        })
    } */

    // FUNCTION YANG AKAN PINDAH DI SCHOLARSHIP DETAIL

    // renderMidtrans = (id) =>{
    //     // var id = this.props.location.search.split('=')[1]
    //     console.log(id)
    //     var randInt = Math.floor(Math.random()*(999-100+1)+100)
    //     // this.setState({orderId: 'dev'+randInt})
    //     var parameter = {
    //         parameter:{
    //             transaction_details: {
    //               order_id :'dev'+randInt,
    //               gross_amount: 300000 // input user
                // },
                // item_details: [
                //   {
                //     id: 'camp-'+randInt,
                //     price: 300000, //input user
                //     quantity: 1,
                //     name: "Subscription " + randInt
                //   }
                // ],
                // customer_details: {
                //   first_name: this.props.nama,
                //   email: this.props.email
                // },
            //   },
            // userData:{
            //     userId: this.props.id,
            //     scholarshipId: id,
            //     remainderDate : '2019-12-30 15:00:00', // input user
            //     monthLeft : 12 // input user

    //         }
    //     }
        
    //       console.log(parameter)
    //       Axios.post(`${URL_API}/subscription/usersubscribe`, parameter)
    //       .then((res)=>{
    //         console.log(res.data)
    //         localStorage.setItem('order_id', res.data.order_id)
    //         window.snap.pay(res.data.transactionToken, {
    //           onSuccess: (result) => {
    //             console.log('success')
    //             console.log(result)
    //             console.log(result.finish_redirect_url)
    //             Axios.post(`${URL_API}/payment/updatePayment`, result)
    //             .then((res)=>{
    //                 console.log(res.data)
    //             })
    //             .catch((err)=>{
    //                 console.log(err)
    //             })
    //             var link = result.finish_redirect_url.split('?')[1]
    //             document.getElementById('apagitu').innerHTML = result.finish_redirect_url;
    //             this.setState({lompatan: `/finish?${link}`})
                
    //            }
    //            ,
    //            onPending: function(result){
    //              console.log('pending')
    //              console.log(result)
                 
    //             console.log(result.finish_redirect_url)
    //             var link = result.finish_redirect_url.split('?')[1]
    //             document.getElementById('apagitu').innerHTML = result.finish_redirect_url;
    //             this.setState({lompatan: `/unfinish?${link}`})
    //             },
    //             onError: function(result){
    //              console.log('error')
    //              console.log(result)
    //              console.log(result.finish_redirect_url)
    //              var link = result.finish_redirect_url.split('?')[1]
    //             document.getElementById('apagitu').innerHTML = result.finish_redirect_url;
    //             this.setState({lompatan: `/error?${link}`})
    //             }
             
    //         })
    //       }).catch((err)=>{
    //         console.log(err)
    //       })
    // }

    //
 
    render() {
        var settings = {
            dots: true,
            arrows: false,
            infinite: true,
            speed: 1000,
            slidesToShow: this.state.scholarshipList.length < 4 ? this.state.scholarshipList.length : 4,
            slidesToScroll: 4
          };

        var settingsProjects = {
            dots: true,
            arrows: false,
            infinite: true,
            speed: 1000,
            slidesToShow: 1,
            slidesToScroll: 1
        }

        return (
            <div>
                <Carousel />

                {/* New Konten */}
                <div className='container-fluid mb-5'>
                    <div className='row m-0'>
                        <div className='col-12 d-flex justify-content-center'>
                            <div className="sharebutton">SHARE YOUR STORY</div>
                            <div className="donatebutton">SHARE YOUR DONATE</div>
                        </div>
                    </div>
                </div>

                 {/* Slider */}

                 <div className='container-fluid my-5 p-0'>
                    <div className='row m-0'>
                        <div className='col-12'>
                            <h2 className='text-center font-weight-bold text-danger font-size-40'>SCHOLARSHIPS</h2>
                        </div>
                        <div className='col-12 outer-background-scholarship my-3 py-5 scholarship-slider'>
                            <Slider {...settings}>
                                {this.renderScholarshipListSlider()}
                            </Slider>
                        </div>

                        <div className='col-12 d-flex justify-content-center'>
                            <div className="sharebutton">SHARE YOUR STORY</div>
                            <div className="donatebutton">SHARE YOUR DONATE</div>
                        </div>

                    </div>
                </div>
                
                {/* <div className='container-fluid'>
                    <div className='row m-0'>
                         <div className='col-12 d-flex justify-content-center'>
                            <div className="sharebutton">SHARE YOUR STORY</div>
                            <div className="donatebutton">SHARE YOUR DONATE</div>
                        </div>
                    </div>
                </div> */}

                {/* <div className='container-fluid m-0 p-0'>
                    <div className='row m-0'>
                        <div className='col-12 p-0'>
                            <div className="projectbackground" style={{height : '95vh'}} >
                                <div className='font-weight-bold' 
                                    style={{
                                        paddingTop: '10%',
                                        marginLeft: '12%'
                                    }}
                                >
                                    <h2 className='mb-4'>TAKE ACTION</h2>
                                    <p>
                                        Get involved, speak out, <br /> or become a donor and give every child a fair
                                        chance for education
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}


                {/* Project List */}
            <div className='container-fluid my-4 p-0'>
                    <div className='row m-0'>
                        <div className='offset-1 col-10 py-5 projects-slider'>
                            <Slider {...settingsProjects}>
                                {this.renderProjectListSlider()}
                            </Slider>
                        </div>
                    </div>
                </div>

                
                
               

                {/* About Us */}
                <div className='about-us container-fluid my-4 p-0'>
                    <div className='row m-0 px-5'>
                        <div className='offset-1 col-10 my-3'>
                            <div className='card'>
                                <div className='row'>
                                    <div className='col-8 ml-5 my-5'>
                                        <h2 className='mb-3'>ABOUT <br/> US</h2>
                                        <p className='p-0 m-0' style={{fontSize: '25px'}}>Lorem ipsum dolor 
                                            sit amet consectetur adipisicing elit. 
                                            Eaque id corporis et sint autem 
                                            in tempora cum voluptatibus reprehenderit, 
                                            adipisci dolor voluptatem ducimus omnis,
                                            eum harum. Cumque officia perspiciatis reprehenderit.
                                        </p>
                                    </div>
                                    <div className='col-3 d-flex flex-column justify-content-center px-4'>
                                        <img src={LogoGray} alt='Logo-AboutUs' className='img-fluid' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    

                

                {/* background-size:cover;
    background-repeat: no-repeat; 
    height: auto;
    object-fit: cover; */}

 
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
        id : auth.id
    }
}

export default connect(mapStateToProps, {})(Home);