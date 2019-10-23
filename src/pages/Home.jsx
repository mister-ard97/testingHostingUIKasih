import React, { Component } from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API';

import Carousel from '../components/carousel';
import ProjectList from '../pages/ProjectList';
import ProjectDetails from '../pages/ProjectDetails';
import StudentList from '../pages/StudentData';

class Home extends Component {
    state = {
        studentdata: [],
        ProjectList: [],
    }
    componentDidMount() {
        // document.title = 'Testing App'
        window.scrollTo(0, 0);
        Axios.get(URL_API+'/student/getstudentdatapaging',{
            params:{
                limit:5
            }
        }).then((resStudent) =>{

            Axios.get(URL_API + `/project/getAllProject?page=${1}&limit=5`)
            .then((resProject) => {
                var results = resProject.data.result.map((val,id)=>{
                    var hasil = {...val, ...val.User}
                    delete hasil.User
                    return hasil
                })

                this.setState({
                    ProjectList : results,
                    studentdata: resStudent.data.rows
                })
            })
            .catch((err) => {
                console.log(err)
            })

        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderProjectList = () => {

    }

    renderStudentList = () => {
        
    }
 
    render() {
        return (
            <div>
                <div>
                    <Carousel />
                    <div className='row m-0'>
                        <div className='col-10 offset-1'>
                            <h2>Project Yang Sedang Aktif</h2>
                            {/* <Route to='/project-list' component={ProjectList} /> */}
                            {/* {this.renderProjectList()} */}
                        </div>
                        <div className='col-10 offset-1' style={{overflowX: 'auto'}}>
                            <h2>Daftar Siswa Yang Berprestasi</h2>
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