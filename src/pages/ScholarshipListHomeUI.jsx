import React, { Component } from 'react';
import Axios from 'axios';
import { URL_API } from '../helpers/Url_API';
import { Link } from 'react-router-dom';

import { Pagination, PaginationItem, PaginationLink, Progress } from 'reactstrap';

import queryString from 'query-string';

var numeral = require('numeral')

class ScholarshipListHomeUI extends Component {
    state = {
        ScholarshipListHomeUI: null,
        totalpage: 0,
        searchBy: null,
        searchStatus : false
    }

    componentDidMount() {
        
        const parsed = queryString.parse(this.props.location.search);
        console.log(parsed)
        if(parsed.search || parsed.orderby || parsed.page) {

            let searchOrder = document.getElementById('searchOrder').options
            
            for(let x = 0; x < searchOrder.length; x++) {
               if(searchOrder[x].value === parsed.orderby) {
                    searchOrder[x].selected = true
               }
            }

            this.selectOrder.value = parsed.orderby
            this.searchText.value = parsed.search
            
            this.searchScholarship();
            
        } else {

            console.log(parsed)
            if(!parsed.page){
                parsed.page = 1
            }

            let limit = 2
            let data = {
                name: parsed.search,
                page: parsed.page,
                date: parsed.orderby,
                limit
            }
            Axios.post(URL_API + `/scholarship/getscholarship`, data)
            .then((res) => {
                console.log(res.data.results)
                var results = res.data.results.map((val)=>{
                    var hasil = {...val, ...val.School, ... val.Student}
                    delete hasil.School
                    delete hasil.Student
                    return hasil
                })

                console.log(results)

                // this.setState({
                //     ScholarshipListHomeUI : results,
                //     totalpage : Math.ceil(res.data.total / limit)
                // })
                //console.log(res.data)
                
                this.setState({
                    ScholarshipListHomeUI: results,
                    totalpage: Math.ceil(res.data.total / limit),
                })
            })
            .catch((err) => {
                console.log(err)
            })
        
        // Axios.get(URL_API + `/project/getAllProject?page=${parsed.page}&limit=${limit}`)
        // .then((res) => {
        //     var results = res.data.result.map((val,id)=>{
        //         var hasil = {...val, ...val.User}
        //         delete hasil.User
          
        //         return hasil
        //     })

        //     this.setState({
        //         ScholarshipListHomeUI : results,
        //         totalpage : Math.ceil(res.data.total / limit)
        //     })
        // })
        // .catch((err) => {
        //     console.log(err)
        // })
        }
        
    }

    renderPagingButton = () =>{
        if(this.state.totalpage !== 0){
            
            var jsx = []
            const parsed = queryString.parse(this.props.location.search);
            for(var i = 0; i < this.state.totalpage; i++){
                if(parsed.search || parsed.orderby) {
                    jsx.push(
                        <PaginationItem>
                           <PaginationLink href={`/scholarship-list?search=${this.searchText.value}&orderby=${this.selectOrder.value}&page=${i+1}`}>
                               {i+1}
                           </PaginationLink>
                       </PaginationItem>
                    )
                } else {
                    jsx.push(
                        <PaginationItem>
                           <PaginationLink href={`/scholarship-list?page=${i+1}`}>
                               {i+1}
                           </PaginationLink>
                       </PaginationItem>
                   )
                }
            }
            return jsx
        }
    }

    printPagination = () =>{
        if(this.state.totalpage !== 0){
            const parsed = queryString.parse(this.props.location.search);
            var currentpage = parsed.page
            if(!parsed.page) {
                currentpage =  1
            }
            if (parsed.search || parsed.orderby) {
                console.log('Masuk')
                return (
                    <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first href={`/scholarship-list?search=${this.searchText.value}&orderby=${this.selectOrder.value}&page=1`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink previous
                         href={`/scholarship-list?search=${this.searchText.value}&orderby=${this.selectOrder.value}&page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
                      </PaginationItem>
                        {this.renderPagingButton()}
                      <PaginationItem>
                        <PaginationLink next 
                        href={`/scholarship-list?search=${this.searchText.value}&orderby=${this.selectOrder.value}&page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
                        this.state.totalpage : parseInt(currentpage) + 1}`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink last href={`/scholarship-list?search=${this.searchText.value}&orderby=${this.selectOrder.value}&page=${this.state.totalpage}`} />
                      </PaginationItem>
                    </Pagination>
                )
            } else {
                return (
                    <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first href={`/scholarship-list?page=1`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink previous
                         href={`/scholarship-list?page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
                      </PaginationItem>
                        {this.renderPagingButton()}
                      <PaginationItem>
                        <PaginationLink next 
                        href={`/scholarship-list?page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
                        this.state.totalpage : parseInt(currentpage) + 1}`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink last href={`/scholarship-list?page=${this.state.totalpage}`} />
                      </PaginationItem>
                    </Pagination>
                )
            }
        }
    }


    renderScholarshipListHomeUI = () => {

        if(this.state.ScholarshipListHomeUI) {
            console.log(this.state.ScholarshipListHomeUI)
            if(this.state.ScholarshipListHomeUI.length !== 0) {
                return this.state.ScholarshipListHomeUI.map((val, index) => {
                    val.currentSubs = parseInt(val.currentSubs)
                    return(
                        <a href={`/scholarship-student?id=${val.id}`} className='row p-3 text-dark border border-light my-3' style={{textDecoration: 'none'}}>
                                <div className='col-4'>
                                    <img src={`${URL_API}${val.studentImage}`} alt={`${val.studentImage}-banner`} className='img-fluid width-100' style={{height : '410px'}}/>
                                </div>
        
                                <div className='col-8'>
                                    <h2 className="mb-2">{val.judul}</h2>
                                    {/* <p className='font-weight-bold'>{val.projectCreator}</p>
                                    <h6>Project Created</h6> */}
                                    {/* <p>{new Date(val.projectCreated).toLocaleDateString('id-IND')}</p>
                                    <h6>Project Ended</h6>
                                    <p>{new Date(val.projectEnded).toLocaleDateString('id-IND')}</p> */}
                                    <p>{val.nominal}</p>
                                    <Progress  className="font-weight-bold mb-3" animated value={(val.currentSubs / val.nominal) * 100 ? (val.currentSubs / val.nominal) * 100  : 0} >
                                    {(val.currentSubs / val.nominal) * 100 ? (val.currentSubs / val.nominal) * 100  : 0}%
                                    </Progress>
                                    <div className="d-flex flex-row mb-3">
                                        <div className="mr-4">
                                            <h4>Dana yang terkumpul </h4>
                                            <input type="text" className="form-control" value={`Rp. ${numeral(parseInt(val.currentSubs)).format(0,0)}`} disabled/>
                                        </div>
    
                                        <div>
                                            <h4>Dana yang dibutuhkan :  </h4>
                                            <input type="text" className="form-control" value={`Rp. ${numeral(parseInt(val.nominal)).format(0,0)}`} disabled/>
                                        </div>
                                    </div>
                           
                                    <h5>Banyaknya Donasi </h5>
                                    <div className="text-gray mb-3"> {val.totalDonasi} Donasi </div>
                                    <h5>Sisa Hari </h5>
                                    <div className="text-gray mb-3"> {val.SisaHari} Hari </div>
                                    <div className="row">
                                        <div className="col-md-5">
                                            <input type="button" className="btn btn-dark form-control font-weight-bolder" value="Contribute" onClick={()=>this.renderMidtrans(val.id)}/>
                                        </div>
                                        <div className="col-md-7">
                                            <div className=" d-flex flex-row justify-content-end">
                                                <div>
                                                    {/* <FacebookShareButton  className='btn btn-primary mr-2'>
                                                        <div className="d-flex flex-row">
                                                            <FacebookIcon size={32} round={true}  />
                                                            <div className="pt-1 ml-2">Share Facebook</div>
                                                        </div>
                                                    </FacebookShareButton>
                                                    <WhatsappShareButton className='btn btn-success'>
                                                        <div className="d-flex flex-row">
                                                            <WhatsappIcon size={32} round={true}  />
                                                            <div className="pt-1 ml-2">Share Whatsapp</div>
                                                        </div>
                                                    </WhatsappShareButton> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                               
    
                                   
    
                                 
                                </div>
                            </a>
                    )
                })
                
            } else {
                return (
                    <h4 className='text-center'>Scholarship sedang tidak ada yang jalan. Silahkan kembali lagi nanti.</h4>
                )
            }
        } else {
            return (
                <h4>Loading...</h4>
            )
        }
    }

    searchScholarship = () => {
            // console.log(this.searchText.value)
        
            // console.log(this.selectOrder.value)

            const parsed = queryString.parse(this.props.location.search)
            
            if(!parsed.page) {
                parsed.page = 1
            }

            // console.log(parsed.orderby)
            // console.log(parsed.search)

            // if(parsed.orderby !== this.selectOrder.value) {
            //     console.log('Masuk')
            //     this.selectOrder.value =  parsed.orderby
            // } 

            // console.log(this.selectOrder.value);
            // console.log(parsed.orderby);
            // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')

            // console.log(this.searchText.value)
            // console.log(parsed.search)

            if(this.searchText.value !== parsed.search || this.selectOrder.value !== parsed.orderby) {
                parsed.page = 1
            }      

            // if(parsed.search !== this.searchText.value) {
            //     this.searchText.value = parsed.search
            // }

            // this.props.history.push({
            //     pathname:'/scholarship-list',
            //     search:`?search=${this.searchText.value}&orderby=${this.selectOrder.value}&page=${parsed.page}`
            // })
        

            let limit = 2
            
            let data = {
                name: this.searchText.value,
                page: parsed.page,
                date: this.selectOrder.value,
                limit
            }
            
            console.log(data)

            Axios.post(URL_API + `/scholarship/getscholarship`, data)
            .then((res) => {
                var results = res.data.results.map((val)=>{
                    var hasil = {...val, ...val.School, ... val.Student}
                    delete hasil.School
                    delete hasil.Student
                    return hasil
                })
                console.log(res.data.total)

                console.log(results)
                
                this.setState({
                    ScholarshipListHomeUI: results,
                    totalpage: Math.ceil(res.data.total / limit),
                })
            })
            .catch((err) => {
                console.log(err)
            })

    }

    render() {
        return (
            <div className='row m-0'>
                <div className='offset-2 col-8'>
                    <div className='col-6'>
                        <h4>Filter By</h4>
                        <div className='row'>
                            <div className='col-6'>
                                <input type='text' className='form-control' ref={(searchText) => this.searchText = searchText}/>
                            </div>
                            <div className='col-6'>
                                <select id='searchOrder' className='form-control' ref={(selectOrder) => this.selectOrder = selectOrder}>
                                    <option value='asc'>Newest Post</option>
                                    <option value='desc'>Older Post</option>
                                </select>
                            </div>
                        </div>
                        <input type='button' className='btn btn-success mt-3' value='Search' onClick={() => this.searchScholarship()}/>
                    </div>
                    
                    {
                        this.state.searchBy ?
                        <p>{this.state.searchBy}</p>
                        :
                        null
                    }

                    {this.renderScholarshipListHomeUI()}
                    {this.printPagination()}
                    
                </div>
            </div>
        )
    }
}

export default ScholarshipListHomeUI