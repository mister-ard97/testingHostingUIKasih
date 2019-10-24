import React, { Component } from 'react';
import Axios from 'axios'
import { URL_API } from '../../helpers/Url_API';
import {Table, Modal, ModalBody, ModalHeader, ModalFooter, Button, Form, FormGroup, Label, CustomInput} from 'reactstrap'
import queryString from 'query-string'

class AdminVerify extends Component {
    state = {
        data : [],
        openModal : false,
        idSelected : null,
        rejectId : null
    }

    componentDidMount() {
        this.getStudentUnverified()
    }

    getStudentUnverified = () =>{
        Axios.get(URL_API+'/studentrev/getstudentrev')
        .then((res)=>{
         
            var results = res.data.map((val,id)=>{
                var hasil = {...val, ...val.School}
                delete hasil.School
                return hasil
            })
            this.setState({
                data : results
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    newStudentApprove = (id) =>{
        Axios.post(URL_API+`/studentrev/newstudentapprove/${id}`)
        .then((res)=>{
            window.alert('admin approve success')
            this.getStudentUnverified()
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    newStudentReject = (id, text) =>{
        Axios.post(URL_API+`/studentrev/newstudentreject/${id}`, {text})
        .then((res)=>{
            window.alert('admin reject success')
            this.setState({
                openModalReject : false
            })
            this.getStudentUnverified()
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    renderListstudent=()=>{
        return this.state.data.map((item,index)=>{

            return (
                <tr key={item.id}>
                    <td >{index+1}</td>
                    <td>{item.name}</td>
                    <td><img src={URL_API+item.studentImage} alt="" width='200'/></td>
                    <td>{item.schoolName}</td>
                    <td>
           
                        <input type='button' className='btn btn-primary' onClick={()=>this.setState({openModal : true, idSelected : index})} value="lihat student"/>
                
                    </td>
     
                    <td>
                        <div className="d-flex flex-row">

                            <input type="button" className="btn btn-success mr-3" value="Approve" onClick={()=>this.newStudentApprove(item.id)}/>
                            <input type="button" className="btn btn-danger" value="Reject" onClick={()=>this.setState({ openModalReject : true, rejectId : item.id})}/>
                         </div>
                    </td>
              
           
                </tr>
            )
            
        })
    }

    renderModalDetails = () =>{
        if(this.state.data.length !== 0 && (this.state.idSelected || this.state.idSelected === 0)){
            console.log('masuk modal')
        
            let data = this.state.data[this.state.idSelected]
            return (
                <div>
                    
                    <h5 className="mb-2">Nama</h5>
                    <input type="text" className="form-control mb-4" value={data.name} disabled/>
                    <h5 className="mb-4">Status</h5>
                    <input type="text" className="form-control mb-4" value={data.status} disabled/>
                    <h5 className="mb-4">Story</h5>
                    <input type="text" className="form-control mb-4" value={data.story} disabled/>
                    <h5 className="mb-4">Pendidikan Terakhir</h5>
                    <input type="text" className="form-control mb-4" value={data.pendidikanTerakhir} disabled/>
                    <h5 className="mb-4">Gender</h5>
                    <input type="text" className="form-control mb-4" value={data.gender} disabled/>
                </div>
            )
        }
    }

        

    render() {
        console.log(this.state.data)
        return (
            <div className='row m-0'>
                <Modal isOpen={this.state.openModal} toggle={()=>this.setState({ openModal : false})} >
                    <ModalHeader>
                        Student Details
                    </ModalHeader>
                    <ModalBody>

                         {this.renderModalDetails()}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openModalReject} toggle={()=>this.setState({ openModalReject : false})} >
                    <ModalHeader>
                        Student Reject
                    </ModalHeader>
                    <ModalBody>
                         <h5>Plase enter your note here : </h5>
                         <input type="text" ref="rejectinput" className="form-control"/>
                    </ModalBody>
                    <ModalFooter>
                        <input type="button" onClick={()=>this.newStudentReject(this.state.rejectId, this.refs.rejectinput.value)} value="REJECT" className="form-control btn btn-danger"/>
                    </ModalFooter>
                </Modal>
                <center><h1> Admin Page</h1></center>
                <div className="d-flex flex-row mx-5">
                    <input type="button" className="btn btn-primary mr-5" value="NEW USER VERIFICATION"/>
                    <input type="button" className="btn btn-success" value="UPDATE USER VERIFICATION"/>
                </div>
                <Table className='mt-2' striped hover>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama murid</th>
                                    <th>foto murid</th>
                                    <th>sekolah</th>
                                    <th>Details</th>
                                    <th>Approve Reject</th>
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

export default AdminVerify