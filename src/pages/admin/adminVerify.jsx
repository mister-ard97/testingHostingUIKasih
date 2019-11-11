import React, { Component } from 'react';
import Axios from 'axios'
import { URL_API } from '../../helpers/Url_API';
import {Table, Modal, ModalBody, ModalHeader, ModalFooter, Button, Form, FormGroup, Label, CustomInput} from 'reactstrap'
import queryString from 'query-string'
import moment from 'moment'

class AdminVerify extends Component {
    state = {
        data : [],
        openModal : false,
        idSelected : null,
        rejectId : null,
        type : '',
        compareModal : false,
        comparedata : [],
        edit : false,
        imageFile : [],
        schooldata : [],
    }

    componentDidMount() {
      this.getStudentUnverified()
      this.getSchool()
       
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

    getStudentUnverified = () =>{
        const parsed = queryString.parse(this.props.location.search);
        Axios.get(URL_API+'/studentrev/admingetstudent?type='+parsed.type)
        .then((res)=>{
         
            console.log(res.data)
            var results = res.data.map((val,id)=>{
                var hasil = {...val, ...val.School}
                delete hasil.School
                return hasil
            })
            console.log(results)
            this.setState({
                data : results,
                type : parsed.type,
                idSelected : null,
                rejectId : null,
                compareModal : false,
                comparedata : [],
                edit : false,
                imageFile : null
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    newStudentApprove = (id) =>{
        const token = localStorage.getItem('token');
        
        var options ={
            headers : 
            {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API+`/studentrev/newstudentapprove/${id}`, {}, options)
        .then((res)=>{
            window.alert('admin approve success')
            this.getStudentUnverified()
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    newStudentReject = (id, text) =>{
        const token = localStorage.getItem('token');

        var options ={
            headers : 
            {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API+`/studentrev/newstudentreject/${id}`, {text}, options)
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
        if(this.state.data.length !== 0 && this.state.type === 'new'){
            
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

        }else if(this.state.data.length !== 0 && this.state.type === 'update'){

            return this.state.data.map((item,index)=>{

                return (
                    <tr key={item.id}>
                        <td >{index+1}</td>
                        <td>{item.name}</td>
                        <td><img src={URL_API+item.studentImage} alt="" width='200'/></td>
                        <td>{item.schoolName}</td>
                        <td>
                            <input type='button' className='btn btn-dark' onClick={()=>this.showCompare(item.id, index)} value="Compare Changes"/>
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

    showCompare = async (id, i) =>{ // id = studrev studentId
        try{

            var res = await Axios.get(URL_API+'/studentrev/getstudentrev/'+id)
        }
        catch(err){
            console.log(err)
            return err
        }
        var result = {...res.data.result[0], ...res.data.result[0].School}
        delete result.School
        // var result = {...res.data.result[0], ...res.data.result[0].School}
        // console.log(result)
        this.setState({
            comparedata : result,
            compareModal : true,
            idSelected : i
        })
    }

    previewFile = (event) => {
        var preview = document.getElementById('imgpreview')
        var file    = document.getElementById('imgstudent').files[0];
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

    renderModalDetails = () =>{
        if(this.state.data.length !== 0 && (this.state.idSelected || this.state.idSelected === 0)){
            console.log('masuk modal')
            
            let data = this.state.data[this.state.idSelected]
            if(this.state.edit === false){

            return (
                        <div>
                            
                            <h5 className="mb-2">Nama</h5>
                            <input type="text" className="form-control mb-2" value={data.name} disabled/>
                            <h5 className="mb-2">Status</h5>
                            <input type="text" className="form-control mb-2" value={data.status} disabled/>
                            <h5 className="mb-2">Birth date</h5>
                            <input type="text" className="form-control mb-2" value={data.tanggalLahir} disabled/>
                            <h5 className="mb-2">Story</h5>
                            <input type="text" className="form-control mb-2" value={data.story} disabled/>
                            <h5 className="mb-2">Pendidikan Terakhir</h5>
                            <input type="text" className="form-control mb-2" value={data.pendidikanTerakhir} disabled/>
                            <h5 className="mb-2">Gender</h5>
                            <input type="text" className="form-control mb-2" value={data.gender} disabled/>
                            <h5 className="mb-2">Sekolah</h5>
                            <input type="text" className="form-control mb-2" value={data.schoolName} disabled/>
                            <h5 className="mb-2">Student Image</h5>
                            <img src={URL_API+ data.studentImage} height='150px'/>
                           
                    
                        </div>
                    )
            }else {
                return (
             
                    <div>
                                {       console.log(moment(data.tanggalLahir).calendar().replace(/[/]/g, '-'))}
                    <h5 className="mb-2">Nama</h5>
                    <input type="text" className="form-control mb-2" defaultValue={data.name} ref="inputnama"/>
                    <h5 className="mb-2">Status</h5>
                    <input type="text" className="form-control mb-2" defaultValue={data.status} ref="inputstatus"/>
                    <h5 className="mb-2">Birth date</h5>
                    <input type="date" className="form-control mb-2" defaultValue={moment(data.tanggalLahir).format('YYYY-MM-DD')} ref="inputdate" />
                    <h5 className="mb-2">Story</h5>
                    <input type="text" className="form-control mb-2" defaultValue={data.story} ref="inputstory"/>
                    <h5 className="mb-2">Pendidikan Terakhir</h5>
                    <input type="text" className="form-control mb-2" defaultValue={data.pendidikanTerakhir}  ref="inputpendidikan"/>
                    <h5 className="mb-2">Gender</h5>
                    <input type="text" className="form-control mb-2" defaultValue={data.gender} ref="inputgender"/>
                    <h5 className="mb-2">Sekolah</h5>
                    <select className='form-control' ref='inputsekolah' defaultValue={data.schoolId}>
                        {this.renderOptionSchool()}
                    </select>
                    <div className="d-flex flex-row">
                        <div className="mr-5">
                            <h5 className="mb-2">Student Image</h5>
                            <img src={URL_API+ data.studentImage} height='150px'/>
                        </div>
                        <div>
                            <h5 className="mb-2">Insert Image (optional)</h5>
                            <img id="imgpreview" height="150px"/>
                            <input type="file" id="imgstudent" onChange={this.previewFile} />
                        </div>
                    </div>
                    <div className="mt-5">
                        <input type="button" className="btn btn-primary" value="Save Changes and Approve" onClick={()=>this.editAndApprove(data.id)}/>
                    </div>
            
                </div>
                )
            }
            
        }
    }



    renderModalCompareDetails = ()=>{
        console.log(this.state)
        if(this.state.data.length !== 0 && (this.state.idSelected || this.state.idSelected === 0) && this.state.comparedata.length !== 0){
            console.log('masuk')
            let data = this.state.data[this.state.idSelected]
            let olddata = this.state.comparedata
            if(this.state.edit ){

                return (
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-5"><h2>Old Data</h2></div>
                            <h5 className="mb-2">Nama</h5>
                            <input type="text" className="form-control mb-2" value={olddata.name} disabled/>
                            <h5 className="mb-2">Status</h5>
                            <input type="text" className="form-control mb-2" value={olddata.status} disabled/>
                            <h5 className="mb-2">Story</h5>
                            <input type="text" className="form-control mb-2" value={olddata.story} disabled/>
                            <h5 className="mb-2">Birth date</h5>
                            <input type="date" className="form-control mb-2" value={moment(olddata.tanggalLahir).format('YYYY-MM-DD')} ref="inputdate" disabled />
                            <h5 className="mb-2">Pendidikan Terakhir</h5>
                            <input type="text" className="form-control mb-2" value={olddata.pendidikanTerakhir} disabled/>
                            <h5 className="mb-2">Gender</h5>
                            <input type="text" className="form-control mb-2" value={olddata.gender} disabled/>
                            <h5 className="mb-2">Sekolah</h5>
                            <input type="text" className="form-control mb-2" value={olddata.schoolName} disabled/>
                            <h5 className="mb-2">Alamat</h5>
                            <input type="text" className="form-control mb-2" value={olddata.alamat} disabled/>
                            <h5 className="mb-2">Old Image</h5>
                            <img src={URL_API+olddata.studentImage} alt="" width='200' height="150"/>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-5 d-flex flex-row">
                                <h2 className="">New Data</h2>
                                <input type="button" className="btn btn-dark ml-4" value="edit" onClick={()=>this.setState({
                                    edit : this.state.edit ? false : true
                                })}/>
                            </div>
                            <h5 className="mb-2">Nama</h5>
                            <input type="text" className="form-control mb-2" ref='inputnama' defaultValue={data.name}/>
                            <h5 className="mb-2">Status</h5>
                            <input type="text" className="form-control mb-2" ref='inputstatus' defaultValue={data.status}/>
                            <h5 className="mb-2">Story</h5>
                            <input type="text" className="form-control mb-2" ref='inputstory' defaultValue={data.story}/>
                            <h5 className="mb-2">Birth date</h5>
                            <input type="date" className="form-control mb-2" defaultValue={moment(data.tanggalLahir).format('YYYY-MM-DD')} ref="inputdate" />
                            <h5 className="mb-2">Pendidikan Terakhir</h5>
                            <input type="text" className="form-control mb-2" ref='inputpendidikan' defaultValue={data.pendidikanTerakhir}/>
                            <h5 className="mb-2">Gender</h5>
                            <input type="text" className="form-control mb-2" ref='inputgender' defaultValue={data.gender}/>
                            <h5 className="mb-2">Sekolah</h5>
                            <select className='form-control' ref='inputsekolah' defaultValue={data.schoolId}>
                                {this.renderOptionSchool()}
                            </select>
                            <h5 className="mb-2">Alamat</h5>
                            <input type="text" className="form-control mb-2" ref='inputalamat' defaultValue={data.alamat}/>
                            <div className="d-flex flex-row">
                                <div className="mr-5">
                                    <h5 className="mb-2">Student Image</h5>
                                    <img src={URL_API+ data.studentImage} height='150px'/>
                                </div>
                                <div>
                                    <h5 className="mb-2">Insert Image (optional)</h5>
                                    <img id="imgpreview" height="150px"/>
                                    <input type="file" id="imgstudent" onChange={this.previewFile} />
                                </div>
                            </div>
    
                        </div>
                    </div>
                )
            }else { 
                return (
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-5"><h2>Old Data</h2></div>
                            <h5 className="mb-2">Nama</h5>
                            <input type="text" className="form-control mb-2" value={olddata.name} disabled/>
                            <h5 className="mb-2">Status</h5>
                            <input type="text" className="form-control mb-2" value={olddata.status} disabled/>
                            <h5 className="mb-2">Story</h5>
                            <input type="text" className="form-control mb-2" value={olddata.story} disabled/>
                            <h5 className="mb-2">Birth date</h5>
                            <input type="date" className="form-control mb-2" value={moment(olddata.tanggalLahir).format('YYYY-MM-DD')} disabled />
                            <h5 className="mb-2">Pendidikan Terakhir</h5>
                            <input type="text" className="form-control mb-2" value={olddata.pendidikanTerakhir} disabled/>
                            <h5 className="mb-2">Gender</h5>
                            <input type="text" className="form-control mb-2" value={olddata.gender} disabled/>
                            <h5 className="mb-2">Sekolah</h5>
                            <input type="text" className="form-control mb-2" value={olddata.schoolName} disabled/>
                            <h5 className="mb-2">Alamat</h5>
                            <input type="text" className="form-control mb-2" value={olddata.alamat} disabled/>
                            <h5 className="mb-2">Old Image</h5>
                            <img src={URL_API+olddata.studentImage} alt="" width='200' height="150"/>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-5 d-flex flex-row">
                                <h2>New Data</h2>
                                <input type="button" className="btn btn-dark ml-4 " value="edit" onClick={()=>this.setState({
                                    edit : this.state.edit ? false : true
                                })}/>
                            </div>
                            <h5 className="mb-2">Nama</h5>
                            <input type="text" className="form-control mb-2"  disabled value={data.name}/>
                            <h5 className="mb-2">Status</h5>
                            <input type="text" className="form-control mb-2"  disabled value={data.status}/>
                            <h5 className="mb-2">Story</h5>
                            <input type="text" className="form-control mb-2"  disabled value={data.story}/>
                            <h5 className="mb-2">Birth date</h5>
                            <input type="date" className="form-control mb-2" defaultValue={moment(data.tanggalLahir).format('YYYY-MM-DD')} ref="inputdate" disabled/>
                            <h5 className="mb-2">Pendidikan Terakhir</h5>
                            <input type="text" className="form-control mb-2"  disabled value={data.pendidikanTerakhir}/>
                            <h5 className="mb-2">Gender</h5>
                            <input type="text" className="form-control mb-2"  disabled value={data.gender}/>
                            <h5 className="mb-2">Sekolah</h5>
                            <input type="text" className="form-control mb-2"  disabled value={data.schoolName}/>
                            <h5 className="mb-2">Alamat</h5>
                            <input type="text" className="form-control mb-2"  disabled value={data.alamat}/>
                            <div className="d-flex flex-row">
                                <div className="mr-5">
                                    <h5 className="mb-2">Student Image</h5>
                                    <img src={URL_API+ data.studentImage} height='150px'/>
                                </div>
                                
                            </div>
    
                        </div>
                    </div>
                )
            }
        }
    }

    renderModalFooterCompare = () =>{
        if(this.state.data.length !== 0 && (this.state.idSelected || this.state.idSelected === 0) && this.state.comparedata.length !== 0){
            let data = this.state.data[this.state.idSelected]
            
            return (
                <div>

                    <div className="d-flex flex-row my-4 mx-4">
            
                        <input type="button" className="btn btn-danger form-control mx-2" value="reject update" onClick={()=>this.updateReject(this.state.comparedata.id, data.id)} />
                        <input type="button" className="btn btn-success form-control mx-2 " value="approve update" onClick={()=>this.updateApprove(this.state.comparedata.id, data.id)}/>
                     

                    </div>

                    <div className="p-3">
                        <h3 className="mx-2">Alasan Reject</h3>
                        <input type="text" className="form-control mx-2 " ref="reject"/>
                    </div>
                </div>
      
            )
        }
    }

    updateApprove = (revid, studentid) =>{
        var confirm = window.confirm('are you sure you want to approve this update')
        if(confirm){
            if(this.state.edit){
                var formData = new FormData()

                const token = localStorage.getItem('token');

                var options ={
                    headers : 
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type' : 'multipart/form-data'
                    }
                }
           
                var data = {
                    name : this.refs.inputnama.value,//
                    // date : this.refs.inputdate.value,
                    tanggalLahir : this.refs.inputdate.value,
                    status : this.refs.inputstatus.value,//
                    gender : this.refs.inputgender.value,//
                    schoolId : this.refs.inputsekolah.value,//
                    pendidikanTerakhir : this.refs.inputpendidikan.value,//
                    story : this.refs.inputstory.value,//
                    alamat : this.refs.inputalamat.value,
                    dataStatus : 'Approved',
        
                    changeImage : this.state.imageFile ? true : false,
                }
           
                formData.append('image', this.state.imageFile) 
                formData.append('data', JSON.stringify(data))
        
                Axios.put(`${URL_API}/student/putstudentdata/${studentid}`, formData, options)
                .then((res)=>{
                    window.alert('edit success')
                    Axios.put(URL_API+'/studentrev/updateapprove', {revid, studentid})
                    .then((res)=>{
                        window.alert('success update approve')
                        this.setState({
                            compareModal : false,
                            idSelected : null,
                            comparedata : [],
                            edit : false
                        })
                        this.getStudentUnverified()
                    })
                    
                })
                .catch((err)=>{
                    console.log(err)
                })

               
            }else {
                Axios.put(URL_API+'/studentrev/updateapprove', {revid, studentid})
                .then((res)=>{
                    window.alert('success update approve')
                    this.setState({
                        compareModal : false,
                        idSelected : null,
                        comparedata : [],
                        edit : false
                    })
                    this.getStudentUnverified()
                })
            }
           
        }


    }

    updateReject = (revid, studentid) =>{
        var confirm = window.confirm('are you sure you want to reject this update')
        if(confirm){
            Axios.put(URL_API+'/studentrev/updatereject', {revid, studentid, message : this.refs.reject.value})
            .then((res)=>{
                window.alert('success update reject')
                this.setState({
                    compareModal : false,
                    idSelected : null,
                    comparedata : [],
                    edit : false
                })
                this.getStudentUnverified()
            })
        }
    }

    editAndApprove = (id) =>{

        var formData = new FormData()

        const token = localStorage.getItem('token');

        var options ={
            headers : 
            {
                'Authorization': `Bearer ${token}`,
                'Content-Type' : 'multipart/form-data'
            }
        }

   
        var data = {
            name : this.refs.inputnama.value,
            tanggalLahir : this.refs.inputdate.value,
            status : this.refs.inputstatus.value,
            gender : this.refs.inputgender.value,
            schoolId : this.refs.inputsekolah.value,
            pendidikanTerakhir : this.refs.inputpendidikan.value,
            story : this.refs.inputstory.value,
            dataStatus : 'Approved',

            changeImage : this.state.imageFile ? true : false,
        }

        
        formData.append('image', this.state.imageFile) 
        formData.append('data', JSON.stringify(data))

        Axios.put(`${URL_API}/student/putstudentdata/${id}`, formData, options)
        .then((res)=>{
            window.alert('edit success')
            this.setState({
                edit : false,
                imageFile : null,
                openModal : false
            })
            this.getStudentUnverified()
            
        })
        .catch((err)=>{
            console.log(err)
        })


        console.log(data)
    }

    

 
        

    render() {
        console.log(this.state.data)
        return (
            <div className='row m-0'>
                <Modal isOpen={this.state.openModal} toggle={()=>this.setState({ openModal : false, edit : false, imageFile : false})} size="lg">
                    <ModalHeader>
                        <div className="d-flex flex-row">

                            Student Details
                            <div className="ml-3">
                                <input type="button"  className="btn btn-success" value="edit" onClick={()=>this.setState({ edit : this.state.edit ? false : true })}/>
                            </div>
                        </div>
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



                <Modal isOpen={this.state.compareModal} toggle={()=>this.setState({ compareModal : false,  edit : false, imageFile : false})}  size="xl">
                    <ModalHeader>
                        Compare  Student
                    </ModalHeader>
                    <ModalBody>
                        {this.renderModalCompareDetails()}
                         
                    </ModalBody>
                        {this.renderModalFooterCompare()}
                </Modal>
               


                <center><h1> Admin Page</h1></center>
                <div className="d-flex flex-row mx-5">
                    <a href="/adminverify?type=new">
                        <input type="button" className="btn btn-primary mr-5" value="NEW USER VERIFICATION"/>
                    </a>
                    <a href="/adminverify?type=update">
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

export default AdminVerify