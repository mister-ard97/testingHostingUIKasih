import React, { Component } from 'react';
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API';
import {Table, Modal, ModalBody, ModalHeader, ModalFooter, Button, Form, FormGroup, Label, CustomInput} from 'reactstrap'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import { API_URL } from '../API';

class Studentlist extends Component {
    state = {
        studentdata:[],
        countstudent:0,
        addImageFileName: null,
        addImageFile: null
      }
    componentDidMount(){
        Axios.get(URL_API+'/student/getstudentdatapaging',{
            params:{
                limit:5,
                page:1
            }
        }).then(res=>{
            this.setState({studentdata:res.data.rows,countstudent:res.data.count})
        })
    }
    renderListstudent=()=>{
        return this.state.studentdata.map((item,index)=>{
            if(item.isDeleted === 0){
                return (
                    <tr key={item.id}>
                        <td >{index+1}</td>
                        <td>{item.name}</td>
                        <td><img src={URL_API+item.studentImage} alt="" width='200'/></td>
                        <td>{item.sekolah}</td>
                        <td>
                        <a href={`/studentdetail?id=${item.id}`} style={{textDecoration:'none'}}>
                            <button className='btn btn-primary'>Lihat student</button>
                        </a>   
                        </td>
                        <td>
                        <button className='btn btn-danger' onClick={() => this.deleteStudent(item.id)}>delete student</button> 
                        </td>
                    </tr>
                )
            }
        })
    }

    deleteStudent = (id) => {
        Axios.delete(API_URL + `/student/deletestudentdata/${id}`)
        .then((res) => {
            Axios.get(URL_API+'/student/getstudentdatapaging',{
                params:{
                    limit:5,
                    page:1
                }
            }).then(res=>{
                this.setState({studentdata:res.data.rows,countstudent:res.data.count})
            })
        })
    }

    renderModal = () => {
        if(this.state.openModal === true){
            return(
                <div>
                  <Modal isOpen={this.state.openModal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Add New Student</ModalHeader>
                    <ModalBody>
                      <Form>
                          <FormGroup>
                              <Label>Student Name</Label>
                              <input type='text' className='form-control' ref='namaMurid'/>
                          </FormGroup>
                          <FormGroup>
                            <Label>Pendidikan Terakhir</Label>
                            <input type='text' className='form-control' ref='pendidikan'/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Tanggal Lahir</Label>
                            <input type="date" className='form-control' ref='tanggalLahir'/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Gender</Label>
                            <select className='form-control' ref='gender'>
                                <option value="Laki-Laki">Laki-Laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <Label>Alamat</Label>
                            <input type="text" className='form-control' ref='alamat'/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Status</Label>
                            <input type="text" className='form-control' ref='status'/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Sekolah</Label>
                            <input type="text" className='form-control' ref='sekolah'/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Story</Label>
                            <input type="text" className='form-control' ref='story'/>
                        </FormGroup>
                        <FormGroup>
                        <Label>Foto Student</Label>
                            <CustomInput onChange={this.onAddImageFileChange} id='addImagePost'type='file' label={this.state.addImageFileName} />
                        </FormGroup>
                      </Form>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={this.addNewStudent}>Add New Student</Button>{' '}
                      <Button color="secondary" onClick={() => this.setState({openModal: false})}>Cancel</Button>
                    </ModalFooter>
                  </Modal>
                </div>
            )
        }
    }

    onAddImageFileChange = (e) => {
        console.log(e.target.files[0])
        if(e.target.files[0]){
            this.setState({ addImageFileName: e.target.files[0].name, addImageFile : e.target.files[0] })
        }else{
            this.setState({ addImageFileName : 'Select Image', addImageFile : undefined })
        }
    }

    addNewStudent = () => {
        var newObj = {
           name: this.refs.namaMurid.value,
           pendidikanTerakhir: this.refs.pendidikan.value,
           gender: this.refs.gender.value,
           status: this.refs.status.value,
           alamat: this.refs.alamat.value,
           tanggalLahir: this.refs.tanggalLahir.value,
           userId: this.props.id,
           story: this.refs.story.value,
           sekolah: this.refs.sekolah.value
        }
        console.log(newObj)
        var formData = new FormData()
        formData.append('data', JSON.stringify(newObj))
        formData.append('image', this.state.addImageFile)

        Axios.post(API_URL +'/student/poststudentdata', formData)
        .then((res) => {
            this.setState({ openModal: false, data: res.data })
            Axios.get(URL_API+'/student/getstudentdatapaging',{
                params:{
                    limit:5,
                    page:1
                }
            }).then(res=>{
                this.setState({studentdata:res.data.rows,countstudent:res.data.count})
            })
        })
    }

    render() { 
        return (
            <div>
                <Table className='mt-2' striped hover>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama murid</th>
                                <th>foto murid</th>
                                <th>sekolah</th>
                                <th><button onClick={() => this.setState({ openModal: true })} className='btn btn-primary'>Tambah student</button></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderListstudent()}
                        </tbody>
                </Table>
                            {this.renderModal()}
            </div>
          );
    }
}

const mapStatetoProps = ({ auth }) => {
    return{
        id: auth.id
    }
}
 
export default connect(mapStatetoProps)(Studentlist);