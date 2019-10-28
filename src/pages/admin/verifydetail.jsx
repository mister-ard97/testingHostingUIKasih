import React, { Component } from 'react';
import Axios from 'axios';
import {Table, Modal, ModalBody, ModalHeader, ModalFooter, Button, Form, FormGroup, Label, CustomInput} from 'reactstrap'
import { URL_API } from '../../helpers/Url_API';
import queryString from 'query-string'


class AdminVerifyDetail extends Component {
    state = {
        studentDetailList: [],
        type: null
    }
    
    componentDidMount() {
        const parsed = queryString.parse(this.props.location.search);
        const token = localStorage.getItem('token');
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }

        Axios.get(URL_API + '/studentdetailrev/student-detail-unverified?type=' + parsed.type, options)
        .then((res) => {
            var results = res.data.map((val,id)=>{
                var hasil = {...val, ...val.School}
                delete hasil.School
                return hasil
            })
            console.log(results)
            this.setState({
                studentDetailList: results,
                type: parsed.type
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderListstudent=()=>{
        if(this.state.studentDetailList.length !== 0 && this.state.type === 'new'){

            return this.state.studentDetailList.map((item,index)=>{
    
                return (
                    <tr key={item.id}>
                        <td >{index+1}</td>
                        <td>{item.name}</td>
                        <td><img src={URL_API+item.studentImage} alt="" width='200'/></td>
                        <td>{item.schoolName}</td>
                        <td>
               
                            <a href={`/studentdetail-review?id=${item.id}&type=new`} className='btn btn-primary'> Lihat Dokumen Siswa</a>
                    
                        </td>
         
                        {/* <td>
                            <div className="d-flex flex-row">
    
                                <input type="button" className="btn btn-success mr-3" value="Approve" onClick={()=>this.newStudentApprove(item.id)}/>
                                <input type="button" className="btn btn-danger" value="Reject" onClick={()=>this.setState({ openModalReject : true, rejectId : item.id})}/>
                             </div>
                        </td> */}
                  
               
                    </tr>
                )
                
            })

        }else if(this.state.studentDetailList.length !== 0 && this.state.type === 'update'){

            return this.state.studentDetailList.map((item,index)=>{

                return (
                    <tr key={item.id}>
                        <td >{index+1}</td>
                        <td>{item.name}</td>
                        <td><img src={URL_API+item.studentImage} alt="" width='200'/></td>
                        <td>{item.schoolName}</td>
                        <td>
               
                            <a href={`/studentdetail-review?id=${item.id}&type=update`} className='btn btn-primary'> Lihat Updated Dokumen Siswa</a>
                    
                        </td>
         
                        <td>
                            <div className="d-flex flex-row">
{/*     
                                <input type="button" className="btn btn-success mr-3" value="Approve Change"/>
                                <input type="button" className="btn btn-danger" value="Reject Change" /> */}
                             </div>
                        </td>
                  
               
                    </tr>
                )
                
            })  

        }
    }
     
    render() {
        return (
            <div className='row m-0'>
                <center><h1> Admin Page</h1></center>
                <div className="d-flex flex-row mx-5">
                    <a href="/adminverify-detail?type=new">
                        <input type="button" className="btn btn-primary mr-5" value="NEW USER VERIFICATION"/>
                    </a>
                    <a href="/adminverify-detail?type=update">
                        <input type="button" className="btn btn-success" value="UPDATE USER VERIFICATION"/>
                    </a>
                  
              
                </div>
                <Table className='mt-2' striped hover>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama murid</th>
                                    <th>foto murid</th>
                                    <th>sekolah</th>
                                    <th>Details</th>
                                    {
                                        queryString.parse(this.props.location.search).type === 'new'
                                        ?
                                        <th>Approve Reject</th>
                                        :
                                        null
                                    }
                                 
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderListstudent()}
                            </tbody>
                    </Table>
            </div>
        )
    }
} 

export default AdminVerifyDetail