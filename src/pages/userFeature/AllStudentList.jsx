import React, { Component } from 'react';
import Axios from 'axios'
import { URL_API, GETTOKENURL, APIWILAYAHURL } from '../../helpers/Url_API';
import {Table, Modal, ModalBody, ModalHeader, ModalFooter, Button, Form, FormGroup, Label, CustomInput} from 'reactstrap'
// import {Link} from 'react-router-dom';
import { connect } from 'react-redux'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import queryString from 'query-string'
import { isDataValid } from '../../helpers/helpers';

class Studentlist extends Component {
    state = {
        studentdata: null,
        totalpage : 0,
        addImageFileName: null,
        addImageFile: null,
        schooldata : [],
        editselected : null,
        imageFile : null,
        editmodal : false,
        province : [],
        searchTextStudent: '',
        selectOrderStudent: 'desc',
      }
    componentDidMount(){
          // formatbody : {
        //     sekolah : 'namaSekolah',
        //     pendidikan : ['SMA','SD'],
        //     page : '1',
        //     limit : '3'
        // }

        window.scrollTo(0, 0)

        const parsed = queryString.parse(this.props.location.search);

        
        // this.getSchool()
        
        if(parsed.search || parsed.orderby) {
            
            let searchOrder = document.getElementById('filterStudents').options
            
            for(let x = 0; x < searchOrder.length; x++) {
               if(searchOrder[x].value === parsed.orderby) {
                    searchOrder[x].selected = true
               }
            }

            this.selectOrderStudent.value = parsed.orderby
            this.searchTextStudent.value = parsed.search

            let datafilter = {
                limit : 3,
                page : parseInt(parsed.page),
                name: parsed.search,
                orderby: parsed.orderby
            }

            console.log(datafilter)

            this.getStudentData(datafilter)

            this.getProvinsiList()

        } else {

            if(!parsed.page){
                parsed.page = 1
            }

            if(!parsed.orderby) {
                parsed.orderby = 'desc'
            }

            if(!parsed.search) {
                parsed.search = ''
            }

            let searchOrder = document.getElementById('filterStudents').options
            
            for(let x = 0; x < searchOrder.length; x++) {
               if(searchOrder[x].value === parsed.orderby) {
                    searchOrder[x].selected = true
               }
            }
            
            let datafilter = {
                limit : 3,
                page : parseInt(parsed.page),
                name: parsed.search,
                orderby: parsed.orderby
            }

            this.getStudentData(datafilter)
            
            this.getProvinsiList()
        }

    }    
    
    getProvinsiList = () =>{
        Axios.get(GETTOKENURL)
        .then((res)=>{
          var token = res.data.token
          token = token + '/m/wilayah/provinsi'
          Axios.get(APIWILAYAHURL+token)
          .then((res)=>{
              console.log(res.data)
            this.setState({
              province : res.data.data
            })
          })
          .catch((err)=>{
            console.log(err)
          })
        })
        .catch((err)=>{
          console.log(err)
        })
      
    }

    printDataProvinsi = () => {
        if(this.state.province.length === 0 ){
          return (
            <option value="" disabled selected hidden>Loading...</option>
          )
        }else{
          var list = this.state.province.map((val, id)=>{
            return (
                <option key={id} value={val.name}> {val.name} </option>
            )
        })
        
        return list 
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
                           <PaginationLink href={`/studentlist?search=${this.searchTextStudent.value}&orderby=${this.selectOrderStudent.value}&page=${i+1}`}>
                               {i+1}
                           </PaginationLink>
                       </PaginationItem>
                    )
                } else {
                    jsx.push(
                        <PaginationItem key={i}>
                           <PaginationLink href={`/studentlist?page=${i+1}`}>
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
                        <PaginationLink first href={`/studentlist?search=${this.searchTextStudent.value}&orderby=${this.selectOrderStudent.value}&page=1`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink previous
                         href={`/studentlist?search=${this.searchTextStudent.value}&orderby=${this.selectOrderStudent.value}&page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
                      </PaginationItem>
                        {this.renderPagingButton()}
                      <PaginationItem>
                        <PaginationLink next 
                        href={`/studentlist?search=${this.searchTextStudent.value}&orderby=${this.selectOrderStudent.value}&page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
                        this.state.totalpage : parseInt(currentpage) + 1}`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink last href={`/studentlist?search=${this.searchTextStudent.value}&orderby=${this.selectOrderStudent.value}&page=${this.state.totalpage}`} />
                      </PaginationItem>
                    </Pagination>
                )
            } else {
                return (
                    <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first href={`/studentlist?page=1`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink previous
                         href={`/studentlist?page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
                      </PaginationItem>
                        {this.renderPagingButton()}
                      <PaginationItem>
                        <PaginationLink next 
                        href={`/studentlist?page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
                        this.state.totalpage : parseInt(currentpage) + 1}`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink last href={`/studentlist?page=${this.state.totalpage}`} />
                      </PaginationItem>
                    </Pagination>
                )
            }
        }
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

    getStudentData(obj){
        console.log(obj)
        obj.userId = this.props.id

        let token = localStorage.getItem('token')
        var options ={
            headers : 
            {
                'Authorization': `Bearer ${token}`
            }
        }
        
        Axios.post(URL_API+`/student/getstudentdatapaging`, obj, options)
        .then(res=>{
            // console.log(res.data)
            // var results = res.data.rows.map((val,id)=>{
            //     var hasil = {...val, ...val.School}
            //     delete hasil.School
            //     return hasil
            // })
            console.log(res.data)
            console.log(res)
            this.setState({
                studentdata:res.data.rows,
                totalpage: Math.ceil(res.data.count / obj.limit),
                selectOrderStudent: obj.orderby
            })
        
        })
        .catch((err) => {
            console.log(err)
        })
    }
    
    renderOptionSchool = () =>{
        if(this.state.schooldata.length !== 0){
            console.log(this.state.schooldata)
            var options = this.state.schooldata.map((val,i)=>{
                return (
                    <option key={i} value={val.id}>{val.nama}</option>
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

    revertChanges = async (id) =>{
        try{

            const token = localStorage.getItem('token');
            const options = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }

            var result = await Axios.get(URL_API+'/studentrev/revertchange/'+id, options)
            window.alert('success revert')
            // this.getSchool()

            const parsed = queryString.parse(this.props.location.search);

        let datafilter = {
            limit : 3,
            page : parseInt(parsed.page),
            name: parsed.search,
            orderby: parsed.orderby
        }

            this.getStudentData(datafilter)
            console.log(result)
        }
        catch(err){
            window.alert(err)
        }
    }



    renderButtonStatus= (type, id, index) =>{
        if(type === 'Update Unverified'){
            return (
                <input type="text" className='form-control' value="Please wait for your verification..." disabled/>
            )

        }else if ( type === 'Rejected'){
            return (
                <div>
                <input type="button" className='btn btn-danger mr-3' value="Revert Changes" onClick={()=>this.revertChanges(id)} />
                {/* <button className='btn btn-dark ' onClick={() =>this.setState({editselected : index, editmodal : true})}>edit again</button>  */}
            </div>
                )

        }else if ( type === 'Register Rejected'){
            return (
                <div>
                {/* <button className='btn btn-dark ' onClick={() =>this.setState({editselected : index, editmodal : true})}>edit again</button>  */}
            </div>
                )

        }else {
            return (
                <div>
                    {/* <button className='btn btn-danger mr-3' onClick={() => this.deleteStudent(id)}>delete student</button>  */}
                    {/* <button className='btn btn-dark ' onClick={() =>this.setState({editselected : index, editmodal : true})}>edit student</button>  */}
                </div>
            )

        }
    }




    renderListstudent=()=>{
       if(this.state.studentdata) {
           if(this.state.studentdata.length !== 0) {
            return this.state.studentdata.map((item,index)=>{
         
                return (
                    <tr key={item.id}>
                        <td >{index+1}</td>
                        <td>{item.name}</td>
                        <td><img src={URL_API+item.studentImage} alt="" width='100'/></td>
                        <td>{item.namaSekolah}</td>
                        <td>
                            {/* {item.dataStatus === 'Rejected' || item.dataStatus === 'Unverified' ? null :  */}
                        
                        <a href={`/studentdetail?id=${item.id}`} className='btn btn-primary' style={{textDecoration:'none'}}>
                            Lihat student
                        </a>   
                        {/* } */}
                        </td>
            
                        {/* <td>
                            <div className="d-flex flex-row ">
                                
                                {item.dataStatus === 'Update Unverified' ?
                                       <input type="text" className='form-control' value="Please wait for your verification..." disabled/>
                                :
                                item.dataStatus === 'Rejected' ?
                                <div>
                                    <input type="button" className='btn btn-danger mr-3' value="Revert Changes" onClick={()=>this.revertChanges(item.id)} />
                                    <button className='btn btn-dark ' onClick={() =>this.setState({editselected : index, editmodal : true})}>edit again</button> 
                                </div>
                                :
                                item.dataStatus === 'Register Rejected'?
                                <div>
                                    <button className='btn btn-dark ' onClick={() =>this.setState({editselected : index, editmodal : true})}>edit again</button> 
                                </div>
                                :
                                <div>
                                <button className='btn btn-danger mr-3' onClick={() => this.deleteStudent(item.id)}>delete student</button> 
                                <button className='btn btn-dark ' onClick={() =>this.setState({editselected : index, editmodal : true})}>edit student</button> 
                                </div>
                            }
                            {this.renderButtonStatus(item.dataStatus, item.id, index)}
               
                            </div>
                        </td> */}
    
                        <td>
                            {item.dataStatus !== 'Rejected' 
                        ?
                        item.dataStatus
                        :
                            <div>
                                <div className="mb-3 text-danger">{item.dataStatus}</div>
                                <div>Note : {item.statusNote}</div>
                            </div>
                        }
                        </td>
                        
                    </tr>
                )
                
            })
           } else {
               return (
                   <tr>
                       <td colSpan='6'>
                            Data tidak ditemukan
                       </td>
                   </tr>
               )
           }
       
        } else {
            return (
                <tr>
                    <td colSpan='6'>
                         Loading
                    </td>
                </tr>
            )
        }
    }

    updateRevisionStudent = (id) =>{

        var formData = new FormData()

        const token = localStorage.getItem('token');

        var options ={
            headers : 
            {
                'Authorization': `Bearer ${token}`,
                'Content-Type' : 'multipart/form-data'
            }
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
            userId : this.props.id,
            alamat : data[i].alamat,
            provinsi : data[i].provinsi,
            status : data[i].status,
            schoolId : data[i].schoolId,
            studentId : id
            //input province 
        }

        var updated = {
            id : id, // dipakai buat where, bukan insert
            changeImage : this.state.imageFile ? true : false,
            pendidikanTerakhir : this.refs.editpendidikan.value,
            story :       this.refs.editstory.value,
            alamat :         this.refs.editalamat.value,
            provinsi : this.refs.editprovinsi.value,
            status :    this.refs.editstatus.value,
            schoolId : this.refs.editsekolah.value
        }
        var obj ={
            result : [current, updated]
        } 

        formData.append('image', this.state.imageFile) 
        formData.append('data', JSON.stringify(obj))


        Axios.post(URL_API +'/studentrev/poststudentrev', formData, options)
        .then((res) => {
            window.alert('Update Success! Your update will be verified by the admin')
            

            const parsed = queryString.parse(this.props.location.search);

        let datafilter = {
            limit : 3,
            page : parseInt(parsed.page),
            name: parsed.search,
            orderby: parsed.orderby
        }
            
            this.getStudentData(datafilter)
            this.setState({
                editmodal : false
            })

    
        })
        

    }

    deleteStudent = (id) => {

        const token = localStorage.getItem('token');

        var options ={
            headers : 
            {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.delete(URL_API + `/student/deletestudentdata/${id}`, options)
        .then((res) => {
            window.alert('delete success')

            const parsed = queryString.parse(this.props.location.search);

        let datafilter = {
            limit : 3,
            page : parseInt(parsed.page),
            name: parsed.search,
            orderby: parsed.orderby
        }

            this.getStudentData(datafilter)
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
                            <Label>Temppat Lahir</Label>
                        <select required id="myList" ref="provinsi" className="form-control" placeholder="Choose New Residence">
                                <option value="">CHOOSE PROVINCE</option>
                                {this.printDataProvinsi()}
                        </select>
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
                                <option value='normal'>Normal</option>
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
       if(this.state.studentdata) {
        if(this.state.studentdata.length !== 0 && (this.state.editselected || this.state.editselected ===0 )) {
            let i = this.state.editselected
            return(
                <div>
                <Modal isOpen={this.state.editmodal} toggle={()=>this.setState({ editmodal : false})} size='xl'  >
                  <ModalHeader toggle={()=>this.setState({ editmodal : false})}> Student</ModalHeader>
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
                            <Label>Tempat Lahir</Label>
                        <select required id="myList" ref="editprovinsi" className="form-control" placeholder="Choose New Residence" defaultValue={this.state.studentdata[i].provinsi}>
                                <option value="">CHOOSE PROVINCE</option>
                                {this.printDataProvinsi()}
                        </select>
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
           provinsi : this.refs.provinsi.value,
           alamat: this.refs.alamat.value,
           tanggalLahir: this.refs.tanggalLahir.value,
           userId: this.props.id,
           story: this.refs.story.value,
           schoolId: this.refs.sekolah.value
        }

        if(!isDataValid(newObj) || !this.state.addImageFile){
            return window.alert('harap untuk mengisi semua form')
        }
        console.log(newObj)
        var formData = new FormData()
        formData.append('data', JSON.stringify(newObj))
        formData.append('image', this.state.addImageFile)

        const token = localStorage.getItem('token');
       const options = {
           headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type' : 'multipart/form-data'
           }
       }

        Axios.post(URL_API +'/student/poststudentdata', formData, options)
        .then((res) => {
            window.alert('Add Success! Your submission will be verified by the admin')
            this.setState({
                openModal : false
            })

            const parsed = queryString.parse(this.props.location.search);

        let datafilter = {
            limit : 3,
            page : parseInt(parsed.page),
            name: parsed.search,
            orderby: parsed.orderby
        }


            this.getStudentData(datafilter)
        })

        
    }

    toggle = () => {
        if(this.state.openModal) {
            this.setState({
                openModal: !this.state.openModal
            })
        }
    }

    filterName(e) {
        console.log(e.target.value)
        if(e.target.value) {
            this.setState({
                searchTextStudent: e.target.value
            })
        }
        
    }

    filterOrderBy(e) {
        console.log(e.target.value)
        this.setState({
            selectOrderStudent: e.target.value
        })
    }

    render() { 
        console.log(this.state.studentdata)
            return (
                <div>
                    <div className='container'>
                    <div className='row'>
                            <div className='col-6'>
                                <input type='text' className='form-control' onChange={(e) => this.filterName(e)} ref={(searchTextStudent) => this.searchTextStudent = searchTextStudent} placeholder='Masukkan kata pencarian' />
                            </div>
                            <div className='col-6'>
                                <select id='filterStudents' className='form-control' onChange={(e) => this.filterOrderBy(e)} ref={(selectOrderStudent) => this.selectOrderStudent = selectOrderStudent}>
                                    <option value='desc'>Data Terbaru</option>
                                    <option value='asc'>Data Lama</option>
                                </select>
                            </div>
                        </div>
                        <a className='btn btn-success' href={`/studentlist?search=${this.state.searchTextStudent}&orderby=${this.state.selectOrderStudent}&page=1`}>Search</a>
                    </div>

                    <div className='container'>
                        <div className="row">
                            <div className='col-12 d-flex justify-content-end'>
                                <a href="/register-student" className='btn btn-success'>Tambah Student</a>
                            </div>
                        </div>
                    </div>
                    
                    <Table className='mt-2' striped hover>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama murid</th>
                                    <th>foto murid</th>
                                    <th>sekolah</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderListstudent()}
                            </tbody>
                            
                    </Table>
                    <div className="d-flex flex-row justify-content-center">

                        {this.printPagination()}    
                    </div>
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