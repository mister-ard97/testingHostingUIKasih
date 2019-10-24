import React, { Component } from 'react';
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API';
import {Table, Modal, ModalBody, ModalHeader, ModalFooter, Button, Form, FormGroup, Label, CustomInput} from 'reactstrap'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'

class Studentlist extends Component {
    state = {
        studentdata:[],
        countstudent:0,
        addImageFileName: null,
        addImageFile: null,
        schooldata : [],
        editselected : null,
        imageFile : null,
        editmodal : false
      }
    componentDidMount(){
          // formatbody : {
        //     sekolah : 'namaSekolah',
        //     pendidikan : ['SMA','SD'],
        //     page : '1',
        //     limit : '3'
        // }
        this.getSchool()
        this.getStudentData()

    }      

    getSchool() {
        
        Axios.get(URL_API+'/user/getschool')
        .then((res)=>{
            console.log(res.data)
            this.setState({
                schooldata : res.data.result
            })
        })
        .catch((err)=>{

        })
    }

    getStudentData(obj = {limit :4,page:1}){

        let token = localStorage.getItem('token')
        var headers ={
            headers : 
            {
                'Authorization': `Bearer ${token}`
            }
        }
        
        Axios.post(URL_API+`/student/getstudentdatapaging`,obj, headers)
        .then(res=>{
            var results = res.data.rows.map((val,id)=>{
                var hasil = {...val, ...val.School}
                delete hasil.School
                return hasil
            })
            this.setState({studentdata:results,countstudent:res.data.count})
        
        })
    
    }
    


    renderOptionSchool = () =>{
        if(this.state.schooldata.length !== 0){
            console.log(this.state.schooldata)
            var options = this.state.schooldata.map((val,i)=>{
                return (
                    <option value={val.id}>{val.nama}</option>
                )
            })
            return options
        }else{
            return (
                <option value="">Loading...</option>
            )
        }

    }

    previewFile = (event) => {
        var preview = document.getElementById('imgpreview')
        var file    = document.getElementById('imgprojectinput').files[0];
        var imgfile = event.target.files[0]

       
        var reader  = new FileReader();
        console.log(reader)
      
        reader.onloadend = function () {
          preview.src = reader.result;
        }
      
        if (file) {
          reader.readAsDataURL(file);
          this.setState({
              imageFile : imgfile
          })

        } else {
          preview.src = "";
          this.setState({
            imageFile : null
        })
        }
    }




    renderListstudent=()=>{
        return this.state.studentdata.map((item,index)=>{
         
            return (
                <tr key={item.id}>
                    <td >{index+1}</td>
                    <td>{item.name}</td>
                    <td><img src={URL_API+item.studentImage} alt="" width='200'/></td>
                    <td>{item.schoolName}</td>
                    <td>
                    <a href={`/studentdetail?id=${item.id}`} style={{textDecoration:'none'}}>
                        <button className='btn btn-primary'>Lihat student</button>
                    </a>   
                    </td>
        
                    <td>
                        <div className="d-flex flex-row ">
                            
                            {item.dataStatus === 'Update Unverified' ?
                                   <input type="text" className='form-control' value="Please wait for your verification..." disabled/>
                            :
                            <div>
                            <button className='btn btn-danger mr-3' onClick={() => this.deleteStudent(item.id)}>delete student</button> 
                            <button className='btn btn-dark ' onClick={() =>this.setState({editselected : index, editmodal : true})}>edit student</button> 
                            </div>
                        }
           
                        </div>
                    </td>
                    <td>{item.dataStatus}</td>
                    
                </tr>
            )
            
        })
    }

    updateRevisionStudent = (id) =>{

        var formData = new FormData()

        var headers ={
            headers : 
            {'Content-Type' : 'multipart/form-data'}
        }

   
        let i = this.state.editselected
        let data = this.state.studentdata

        
     
        var current = {
            name : data[i].name,
            gender : data[i].gender,
            tanggalLahir : data[i].tanggalLahir,
            studentImage : data[i].studentImage,
            isDeleted : 0,
            dataStatus : data[i].dataStatus,
            statusNote : data[i].statusNote,
            pendidikanTerakhir : data[i].pendidikanTerakhir,
            story : data[i].story,
            alamat : data[i].alamat,
            status : data[i].status,
            schoolId : data[i].schoolId
        }
        console.log(data)

        var updated = {
            id : id,
            changeImage : this.state.imageFile ? true : false,
            pendidikanTerakhir : this.refs.editpendidikan.value,
            story :       this.refs.editstory.value,
            alamat :         this.refs.editalamat.value,
            status :    this.refs.editstatus.value,
            schoolId : this.refs.editsekolah.value
        }
        var obj ={
            result : [current, updated]
        } 

        formData.append('image', this.state.imageFile) 
        formData.append('data', JSON.stringify(obj))

        Axios.post(URL_API +'/studentrev/poststudentrev', formData, headers)
        .then((res) => {
            window.alert('Update Success! Your update will be verified by the admin')
            this.getStudentData()
            this.setState({
                editmodal : false
            })

   
        })
    }

    deleteStudent = (id) => {
        Axios.delete(URL_API + `/student/deletestudentdata/${id}`)
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
                  <Modal isOpen={this.state.openModal} toggle={()=>this.setState({ openModal : false})} >
                    <ModalHeader>Add New Student</ModalHeader>
                    <ModalBody>
                      <Form>
                          <FormGroup>
                              <Label>Student Name</Label>
                              <input type='text' className='form-control' ref='namaMurid'/>
                          </FormGroup>
                          <FormGroup>
                            <Label>Pendidikan Terakhir</Label>
                            <select className='form-control' ref='pendidikan'>
                                <option value='TK'>TK</option>
                                <option value='SD'>SD</option>
                                <option value='SMP'>SMP</option>
                                <option value='SMA'>SMA</option>
                                <option value='SMK'>SMK</option>
                                <option value='S1'>S1</option>
                            </select>
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
                         
                            <select className='form-control' ref='status'>
                                <option value='yatim'>Yatim</option>
                                <option value='piatu'>Piatu</option>
                                <option value='yatimpiatu'>Yatim Piatu</option>
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <Label>Sekolah</Label>
                            <select className='form-control' ref='sekolah'>
                                {this.renderOptionSchool()}
                            </select>
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

    renderModalEdit = () =>{
        if(this.state.studentdata.length !== 0 && (this.state.editselected || this.state.editselected ===0 )) {
            let i = this.state.editselected
            return(
                <div>
                <Modal isOpen={this.state.editmodal} toggle={()=>this.setState({ editmodal : false})} size='xl' >
                  <ModalHeader> Student</ModalHeader>
                  <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Student Name</Label>
                            <input type='text' className='form-control' value={this.state.studentdata[i].name} disabled/>
                        </FormGroup>
                        <FormGroup>
                          <Label>Pendidikan Terakhir</Label>
                          <select className='form-control' ref='editpendidikan' defaultValue={this.state.studentdata[i].pendidikanTerakhir}>
                              <option value='TK'>TK</option>
                              <option value='SD'>SD</option>
                              <option value='SMP'>SMP</option>
                              <option value='SMA'>SMA</option>
                              <option value='SMK'>SMK</option>
                              <option value='S1'>S1</option>
                          </select>
                      </FormGroup>
                      <FormGroup>
                          <Label>Tanggal Lahir</Label>
                          <input type="text" className='form-control' value={Date(this.state.studentdata[i].tanggalLahir).toLocaleString('id-IND', {dateStyle : 'medium'})} disabled/>
                      </FormGroup>
                      <FormGroup>
                          <Label>Gender</Label>
                          <input type="text" className='form-control'  value={this.state.studentdata[i].gender} disabled/>
                      </FormGroup>
                      <FormGroup>
                          <Label>Alamat</Label>
                          <input type="text" className='form-control' ref='editalamat' defaultValue={this.state.studentdata[i].alamat}/>
                      </FormGroup>
                      <FormGroup>
                          <Label>Status</Label>
                       
                          <select className='form-control' ref='editstatus' defaultValue={this.state.studentdata[i].status}>
                              <option value='yatim'>Yatim</option>
                              <option value='piatu'>Piatu</option>
                              <option value='yatimpiatu'>Yatim Piatu</option>
                          </select>
                      </FormGroup>
                      <FormGroup>
                          <Label>Sekolah</Label>
                          <select className='form-control' ref='editsekolah' defaultValue={this.state.studentdata[i].schoolId}>
                              {this.renderOptionSchool()}
                          </select>
                      </FormGroup>
                      <FormGroup>
                          <Label>Story</Label>
                          <input type="text" className='form-control' ref='editstory' defaultValue={this.state.studentdata[i].story}/>
                      </FormGroup>
                      <FormGroup>
                      <Label>Foto Student</Label>
                        <div className="d-flex flex-column ml-3">
                            <div className="d-flex flex-row">
                                <img src={URL_API+this.state.studentdata[i].studentImage} alt="" width="200px" height="200px"/>
                                <div className="d-flex flex-column">
                                    <img id="imgpreview" width="200px" height="200px"/>
                                    <input type="file" id="imgprojectinput" className="form-control mb-4" placeholder="masukkan project description" onChange={this.previewFile}/>

                                </div>
                         
                            </div>
                        </div>

                      </FormGroup>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" onClick={()=>this.updateRevisionStudent(this.state.studentdata[i].id)}>Save Edit Student</Button>{' '}
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
           schoolId: this.refs.sekolah.value
        }
        console.log(newObj)
        var formData = new FormData()
        formData.append('data', JSON.stringify(newObj))
        formData.append('image', this.state.addImageFile)

        Axios.post(URL_API +'/student/poststudentdata', formData)
        .then((res) => {
            window.alert('Add Success! Your submission will be verified by the admin')
            this.setState({
                openModal : false
            })
            this.getStudentData()
        })

        
    }

    render() { 
        console.log(this.state.studentdata)
            return (
                <div>
                    <Table className='mt-2' striped hover>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama murid</th>
                                    <th>foto murid</th>
                                    <th>sekolah</th>
                           
                                    <th><button onClick={() => this.setState({ openModal: true })} className='btn btn-success'>Tambah student</button></th>
                                
                                    <th>ACTION</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderListstudent()}
                            </tbody>
                    </Table>
                            {this.renderModal()}
                            {this.renderModalEdit()}
                </div>
        )
    }
}

const mapStatetoProps = ({ auth }) => {
    return{
        id: auth.id,
        role: auth.role
    }
}
 
export default connect(mapStatetoProps)(Studentlist);