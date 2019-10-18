import React, { Component } from 'react';
import Axios from 'axios';
import { URL_API } from '../helpers/Url_API';
import { Link } from 'react-router-dom';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import queryString from 'query-string'

class ProjectList extends Component {
    state = {
        ProjectList: null,
        totalpage: 0
    }

    componentDidMount() {
        const parsed = queryString.parse(this.props.location.search);

        console.log(parsed)
        if(!parsed.page){
            parsed.page = 1
        }

        let limit = 4
        
        Axios.get(URL_API + `/project/getAllProject?page=${parsed.page}&limit=${limit}`)
        .then((res) => {
            var results = res.data.result.map((val,id)=>{
                var hasil = {...val, ...val.User}
                delete hasil.User
                return hasil
            })

            this.setState({
                ProjectList : results,
                totalpage : Math.ceil(res.data.total / limit)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderPagingButton = () =>{
        if(this.state.totalpage !== 0){
            
            var jsx = []
            for(var i = 0; i<this.state.totalpage; i++){
                jsx.push(
                     <PaginationItem>
                        <PaginationLink href={`/project-list?page=${i+1}`}>
                            {i+1}
                        </PaginationLink>
                    </PaginationItem>
                )
            }
            return jsx
        }
    }

    printPagination = () =>{
        if(this.state.totalpage !== 0){
            const parsed = queryString.parse(this.props.location.search);
            var currentpage = parsed.page
            return (
                <Pagination aria-label="Page navigation example">
                <PaginationItem>
                    <PaginationLink first href={`/project?page=1`} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink previous
                     href={`/project-list?page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
                  </PaginationItem>
                    {this.renderPagingButton()}
                  <PaginationItem>
                    <PaginationLink next 
                    href={`/project-list?page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
                    this.state.totalpage 
                :
                parseInt(currentpage) + 1}`} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink last href={`/project-list?page=${this.state.totalpage}`} />
                  </PaginationItem>
                </Pagination>
            )
        }
    }


    renderProjectList = () => {
        console.log(this.state.ProjectList)
        if(this.state.ProjectList) {
            if(this.state.ProjectList.length !== 0) {
                return this.state.ProjectList.map((val, index) => {
                    return (
                        <Link to={`project-detail?id=${val.projectId}`} className='card mt-3' key={index}>
                        <div className='row'>
                            <div className='col-2'>
                                <img src={`${URL_API}${val.projectImage}`} alt={`${val.projectName}-banner`} className='img-fluid'/>
                            </div>
    
                            <div className='col-10'>
                                <h5>{val.projectName}</h5>
                                <p className='font-weight-bold'>{val.projectCreator}</p>
                                <p>{new Date(val.projectCreated).toLocaleDateString('id-IND')}</p>
                                <p>{new Date(val.projectEnded).toLocaleDateString('id-IND')}</p>
                                <h6>Rp. {val.totalTarget}</h6>
                            </div>
                        </div>
                    </Link>    
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

    render() {
        return (
            <div className='row m-0'>
                <div className='offset-2 col-8'>
                    {this.renderProjectList()}
                    {this.printPagination()}
                </div>
            </div>
        )
    }
}

export default ProjectList