import React, { Component } from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API';

import Carousel from '../components/carousel';
import queryString from 'query-string';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

var numeral = require('numeral')

class Home extends Component {
    state = {
        studentdata: [],
        ProjectList: [],
        totalpage : 0,
        searchProject: false,
        searchText: '',
        orderby: ''
    }
    componentDidMount() {
        // document.title = 'Testing App'
        // if(!parsed.page){
        //     parsed.page = 1
        // }

        let limit = 4

        window.scrollTo(0, 0);
        Axios.get(URL_API + `/project/getAllProject?page=${1}&limit=4`)
            .then((resProject) => {
                var results = resProject.data.result.map((val,id)=>{
                    var hasil = {...val, ...val.User}
                    delete hasil.User
                    return hasil
                })

                console.log(results)

                this.setState({
                    ProjectList : results,
                    totalpage: Math.ceil(resProject.data.total / limit),
                    // studentdata: resStudent.data.rows
                })
            })
            .catch((err) => {
                console.log(err)
            })

    }

    
    renderProjectList = () => {

        if(this.state.ProjectList) {
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
                                <p>{new Date(val.projectEnded).toLocaleDateString('id-IND')}</p>
                                <h6>Rp. {numeral(val.totalTarget).format(0,0)}</h6>
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

    renderPagingButton = () =>{
        if(this.state.totalpage !== 0){
            
            var jsx = []
            const parsed = queryString.parse(this.props.location.search);
            for(var i = 0; i<this.state.totalpage; i++){
                if(parsed.search || parsed.orderby) {
                    jsx.push(
                        <PaginationItem>
                           <PaginationLink href={`/project-list?search=${parsed.search}&orderby=${parsed.orderby}&page=${i+1}`}>
                               {i+1}
                           </PaginationLink>
                       </PaginationItem>
                    )
                } else {
                    jsx.push(
                        <PaginationItem>
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
            if(parsed.search || parsed.orderby) {
                console.log('Masuk')
                return (
                    <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first href={`/project-list?search=${parsed.search}&orderby=${parsed.orderby}&page=1`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink previous
                         href={`/project-list?search=${parsed.search}&orderby=${parsed.orderby}&page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
                      </PaginationItem>
                        {this.renderPagingButton()}
                      <PaginationItem>
                        <PaginationLink next 
                        href={`/project-list?search=${parsed.search}&orderby=${parsed.orderby}&page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
                        this.state.totalpage : parseInt(currentpage) + 1}`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink last href={`/project-list?search=${parsed.search}&orderby=${parsed.orderby}&page=${this.state.totalpage}`} />
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

    renderStudentList = () => {
        
    }

    searchProject() {
        this.setState({
            searchProject: true,
            searchText: this.searchText.value,
            orderby: this.selectOrder.value
        })
    }
 
    render() {
        if(this.state.searchProject) {
            return (
                <Redirect to={`/project-list?search=${this.state.searchText}&orderby=${this.state.orderby}&page=1`} />
            )
        }
        return (
            <div>
                <div>
                    <Carousel />
                    <div className='row m-0'>
                        <div className='col-10 offset-1 mb-3'>
                            <h2>Project Yang Sedang Aktif</h2>
                            <h4>Filter By</h4>
                            <div className='row'>
                                <div className='col-6'>
                                    <input type='text' className='form-control' ref={(searchText) => this.searchText = searchText}/>
                                </div>
                                <div className='col-6'>
                                    <select className='form-control' ref={(selectOrder) => this.selectOrder = selectOrder}>
                                        <option value='asc'>Newest Post</option>
                                        <option value='desc'>Older Post</option>
                                    </select>
                                </div>
                            </div>
                            <input type='button' className='btn btn-success mt-3' value='Search' onClick={() => this.searchProject()}/>
                            {/* <ProjectList /> */}
                            {/* <Route to='/project-list' component={ProjectList} /> */}
                            {this.renderProjectList()}
                            {/* {this.printPagination()} */}
                        </div>
                        <div className='col-10 offset-1 mt-5' style={{overflowX: 'auto'}}>
                            <h2>Scholarship yang sedang berjalan</h2>
                            {/* <StudentList /> */}
                            {/* {this.renderStudentList()} */}
                        </div>
                    </div>           
                </div>
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
    }
}

export default connect(mapStateToProps, {})(Home);