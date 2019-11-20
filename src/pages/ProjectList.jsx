import React, { Component } from 'react';
import Axios from 'axios';
import { URL_API } from '../helpers/Url_API';
import { Link } from 'react-router-dom';

import { Pagination, PaginationItem, PaginationLink, Progress } from 'reactstrap';

import queryString from 'query-string';

var numeral = require('numeral')

class ProjectList extends Component {
    state = {
        ProjectList: null,
        totalpage: 0,
        searchText: '',
        orderBy: '',
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
            
            this.searchProject();
            
        } else {

            console.log(parsed)
            if(!parsed.page){
                parsed.page = 1
            }

            if(!parsed.orderby) {
                parsed.orderby = 'asc'
            }

            if(!parsed.search) {
                parsed.search = ''
            }

            let limit = 2
            let data = {
                name: parsed.search,
                page: parsed.page,
                date: parsed.orderby,
                limit
            }
            Axios.post(URL_API + `/project/searchproject`, data)
            .then((res) => {
                console.log(res.data)
                var results = res.data.map((val,id)=>{
                    
                    var hasil = {...val, ...val.User,...val.Payments[0]}
                    console.log(hasil)
                    delete hasil.User
                    delete hasil.Payments
        
                    
                    return hasil
                })

                console.log(results)

                // this.setState({
                //     ProjectList : results,
                //     totalpage : Math.ceil(results.length / limit)
                // })
                //console.log(res.data)
                
                this.setState({
                    ProjectList: results,
                    totalpage: Math.ceil(results.length / limit),
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
        //         ProjectList : results,
        //         totalpage : Math.ceil(results.length / limit)
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
                        <PaginationItem key={i}>
                           <PaginationLink href={`/project-list?search=${this.searchText.value}&orderby=${this.selectOrder.value}&page=${i+1}`}>
                               {i+1}
                           </PaginationLink>
                       </PaginationItem>
                    )
                } else {
                    jsx.push(
                        <PaginationItem key={i}>
                           <PaginationLink href={`/project-list?page=${i+1}`}>
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
                        <PaginationLink first href={`/project-list?search=${this.searchText.value}&orderby=${this.selectOrder.value}&page=1`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink previous
                         href={`/project-list?search=${this.searchText.value}&orderby=${this.selectOrder.value}&page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
                      </PaginationItem>
                        {this.renderPagingButton()}
                      <PaginationItem>
                        <PaginationLink next 
                        href={`/project-list?search=${this.searchText.value}&orderby=${this.selectOrder.value}&page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
                        this.state.totalpage : parseInt(currentpage) + 1}`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink last href={`/project-list?search=${this.searchText.value}&orderby=${this.selectOrder.value}&page=${this.state.totalpage}`} />
                      </PaginationItem>
                    </Pagination>
                )
            } else {
                return (
                    <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first href={`/project-list?page=1`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink previous
                         href={`/project-list?page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
                      </PaginationItem>
                        {this.renderPagingButton()}
                      <PaginationItem>
                        <PaginationLink next 
                        href={`/project-list?page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
                        this.state.totalpage : parseInt(currentpage) + 1}`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink last href={`/project-list?page=${this.state.totalpage}`} />
                      </PaginationItem>
                    </Pagination>
                )
            }
        }
    }


    renderProjectList = () => {

        if(this.state.ProjectList) {
            console.log(this.state.ProjectList)
            if(this.state.ProjectList.length !== 0) {
                return this.state.ProjectList.map((val, index) => {
                    return (
                        <a href={`project-detail?id=${val.projectId}`} className='card mt-3' key={index}>
                        <div className='row'>
                            <div className='col-2'>
                                <img src={`${URL_API}${val.projectImage}`} alt={`${val.projectName}-banner`} className='img-fluid'/>
                            </div>
    
                            <div className='col-10'>
                                <h5>{val.projectName}</h5>
                                <p className='font-weight-bold'>{val.projectCreator}</p>
                                <h6>Project Created</h6>
                                <p>{new Date(val.projectCreated).toLocaleDateString('id-IND')}</p>
                                <h6>Project Ended</h6>
                                <p className="mb-4">{new Date(val.projectEnded).toLocaleDateString('id-IND')}</p>

                                <h5 className="mb-2 font-weight-bold">Project Target : </h5>
                                <h6 className="mb-5">Rp. {numeral(val.totalTarget).format(0,0)}</h6>
                                <p>{val.totalNominal}</p>
                                <h5>Yang terkumpul sekarang : </h5>
                                <h6>Rp. {numeral(val.totalNominal).format(0,0)}</h6>
                                {/* <div className="d-flex flex-row">

                                    <Progress animated value={(val.totalNominal / val.totalTarget) * 100} />
                                    <div className="text-gray">{(val.totalNominal / val.totalTarget) * 100} %</div>
                                </div> */}
                                <Progress  className="font-weight-bold mb-3" animated value={(val.totalNominal / val.totalTarget) * 100 ? (val.totalNominal / val.totalTarget) * 100  : 0} >
                                {(val.totalNominal / val.totalTarget) * 100 ? (val.totalNominal / val.totalTarget) * 100  : 0}%
                                </Progress>
                                <h5>Banyaknya Donasi </h5>
                                <div className="text-gray mb-3"> {val.totalDonasi} Donasi </div>
                                <h5>Sisa Hari </h5>
                                <div className="text-gray mb-3"> {val.SisaHari} Hari </div>
                            </div>
                        </div>
                    </a>    
                    )
                })
                
            } else {
                return (
                    <h4 className='text-center'>Project sedang tidak ada yang jalan. Silahkan kembali lagi nanti.</h4>
                )
            }
        } else {
            return (
                <h4>Loading...</h4>
            )
        }
    }

    searchProject = () => {
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
            //     pathname:'/project-list',
            //     search:`?search=${this.searchText.value}&orderby=${this.selectOrder.value}&page=1`
            // })
        

            let limit = 2
            
            let data = {
                name: this.searchText.value,
                page: parsed.page,
                date: this.selectOrder.value,
                limit
            }
            
            console.log(data)

            Axios.post(URL_API + `/project/searchproject`, data)
            .then((res) => {
                var results = res.data.results.map((val,id)=>{
                    var hasil = {...val, ...val.User}
                    delete hasil.User
                    return hasil
                })
                console.log(results.length)

                console.log(results)

                // this.setState({
                //     ProjectList : results,
                //     totalpage : Math.ceil(results.length / limit)
                // })
                //console.log(res.data)
                
                this.setState({
                    ProjectList: results,
                    totalpage: Math.ceil(res.data.total / limit),
                })
            })
            .catch((err) => {
                console.log(err)
            })

    }

    
    filterName(e) {
        console.log(e.target.value)
        if(e.target.value) {
            this.setState({
                searchText: e.target.value
            })
        }
        
    }

    filterOrderBy(e) {
        console.log(e.target.value)
        this.setState({
            orderBy: e.target.value
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
                                <input type='text' className='form-control' onChange={(e) => this.filterName(e)} ref={(searchText) => this.searchText = searchText}/>
                            </div>
                            <div className='col-6'>
                                <select id='searchOrder' className='form-control' onChange={(e) => this.filterOrderBy(e)} ref={(selectOrder) => this.selectOrder = selectOrder}>
                                    <option value='asc'>Newest Post</option>
                                    <option value='desc'>Older Post</option>
                                </select>
                            </div>
                        </div>
                        <a className='btn btn-success' href={`/project-list?search=${this.state.searchText}&orderby=${this.state.orderBy}&page=1`}>Search</a>
                        {/* <input type='button' className='btn btn-success mt-3' value='Search' onClick={() => this.searchProject()}/> */}
                    </div>
                    
                    {
                        this.state.searchBy ?
                        <p>{this.state.searchBy}</p>
                        :
                        null
                    }

                    {this.renderProjectList()}
                    {this.printPagination()}
                    
                </div>
            </div>
        )
    }
}

export default ProjectList