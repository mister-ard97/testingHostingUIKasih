import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import { CustomInput } from 'reactstrap';
import { URL_API } from '../helpers/Url_API';


class StudentDetails extends Component {
    state = { 
        data: [],
        raportUser: [],
        detail: [],
        edit: false,
        addImageFileName: null,
        addImageFile: null,
        selectedId: 0,
        pendidikan: null
    }

    componentDidMount(){


        // GANTI JADI POST YANG NERIMA REQ.BODY


        var id = this.props.location.search.split('=')[1]
        // Axios.get(API_URL + `/student/get-student-detail/1` )
        console.log(id)
        Axios.get(URL_API + `/studentdetail/get-student-detail/${id}`)
        .then((res) => {
            this.setState({ data: res.data, pendidikan: res.data[0].pendidikanTerakhir })
            console.log(this.state.data)
        })
        .catch((err) => {
            console.log(err)
        })

        // Dino
        // Axios.get(API_URL+'/studentdetail/get-student-detail/1')
        // .then(res=>{
        //     this.setState({data: res.data[0], raportUser:res.data[0].StudentDetails})
        // }).catch(err=>{
        //     console.log(err)
        // })

    }

    deleteDetail = (id) => {
        var studentId = this.props.location.search.split('=')[1]
        Axios.post(URL_API + `/studentdetail/delete-student-detail/${id}`, { id, studentId })
        .then((res) => {
            // Axios.get(API_URL + `/studentdetail/get-student-detail/${id}`)
            // .then((res) => {
                this.setState({ data: res.data })
                console.log(this.state.data)
            // })
        })
    }

    // renderRaport=()=>{
    //     if(this.state.raportUser.length !==0){
    //         return this.state.raportUser.map((item,index)=>{
    //             return(
    //                 <img key={index} src={API_URL+item.pictureReport} alt={`${item.pictureReport}`}/>
    //             )
    //         })
    //     }

    // }

    renderStudentDetailForGuest = () => {
        return this.state.data.map((val) => {
            return (
             <div className='col-12'>
                 <p>Foto Siswa</p>
                 <img src={URL_API + val.studentImage} alt={val.studentImage} style={{width: '300px'}}/>
                 <p>Nama: {val.name}</p>
                 <p>Pendidikan Terakhir: {val.pendidikanTerakhir}</p>
                 <p>Gender: {val.gender}</p>
                 <p>Status Keluarga: {val.status}</p>
                 <p>Story : {val.story}</p>
                 <p></p>
                  <table>
                    <thead>
                        <th className='pr-3'> Report Image</th>
                        <th className='pr-5'>Description</th>
                    </thead>
                {
                    this.props.role === 'User' ?
                    null
                    :

                    <tbody>
                    {
                         val.StudentDetails.map((item) => {
                            return(
                                
                                <tr>
                                    <td>
                                        <img src={URL_API + item.pictureReport} alt={item.pictureReport} style={{ width: '50%' }}/>
                                    </td>
                                    <td>
                                        {item.class}
                                    </td>
                                    <td>
                                        {item.deskripsi}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
                }
              </table>
             </div>
            )
        })
    }


    renderStudentDetail = () => {
        return this.state.data.map((val) => {
            return val.StudentDetails.map((item) => {
                if(item.id === this.state.selectedId){
                    return(
                        <tbody className='border-bottom'>
                            <tr className='py-5'>
                                <td>
                                    <CustomInput onChange={this.onAddImageFileChange} id='addImagePost'type='file' label={this.state.addImageFileName} />
                                </td>
                                <td>
                                    <input type="text" defaultValue={item.deskripsi} ref='descEdit'/>
                                </td>
                                <td>
                                    <input type="button" value='cancel' onClick={() => this.setState({ selectedId: 0 })}/>
                                </td>
                                <td>
                                    <input type="button" value='confirm' onClick={() => this.confirmEdit(item.id)}/>
                                </td>
                            </tr>
                        </tbody>
                )}
                return(
                    <tbody className='border-bottom'>
                            <tr className='py-5'>
                                <td>
                                    <img src={URL_API + item.pictureReport} alt={item.pictureReport} style={{ width: '50%' }}/>
                                </td>
                                <td>
                                    {item.class}
                                </td>
                                <td>
                                    {item.deskripsi}
                                </td>
                                <td>
                                    {
                                        item.dataStatus === 'Unverified' ?
                                        <input type='text' value='Waiting For Confirmation' disabled />
                                        :
                                        null
                                    }
                                    {/* <input type="button" value='edit' onClick={() => this.setState({ selectedId: item.id })}/> */}
                                </td>
                                <td>
                                    {/* <input type="button" value='delete' onClick={() => this.deleteDetail(item.id)}/> */}
                                </td>
                            </tr>
                        </tbody>
                )
            })
        })    
    }

    onAddImageFileChange = (e) => {
        console.log(e.target.files[0])
        if(e.target.files[0]){
            this.setState({ addImageFileName: e.target.files[0].name, addImageFile : e.target.files[0] })
        }else{
            this.setState({ addImageFileName : 'Select Image', addImageFile : undefined })
        }
    }

    confirmEdit = (id) => {
        var formData = new FormData()
        var newObj = {
            id,
            deskripsi: this.refs.descEdit.value,
            studentId: this.props.location.search.split('=')[1]
        }
        console.log(newObj)
        formData.append('data', JSON.stringify(newObj))
        formData.append('image', this.state.addImageFile)
        Axios.post(URL_API + `/studentdetail/edit-student-detail/${newObj.studentId}`, formData)
        .then(() => {
            // console.log(res.data)
            id = this.props.location.search.split('=')[1]
            Axios.get(URL_API + `/studentdetail/get-student-detail/${id}`)
            .then((res) => {
                this.setState({ data: res.data, selectedId: 0 })
                console.log(this.state.data)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    addNewDetail = () => {
        console.log(this.Kelas.value)
        if(!this.state.addImageFile || !this.refs.deskripsi.value || this.Kelas.value === ''){
            return window.alert('fill all forms please')
        }

        var formData = new FormData()
        var newObj = {
            deskripsi: this.refs.deskripsi.value,
            studentId: this.props.location.search.split('=')[1],
            dataStatus: 'Unverified',
            kelas: this.Kelas.value
        }

        formData.append('data', JSON.stringify(newObj))
        formData.append('image', this.state.addImageFile)
        Axios.post(URL_API + `/studentdetail/add-student-detail/${newObj.studentId}`, formData)
        .then((res) => {
            Axios.get(URL_API + `/studentdetail/get-student-detail/${newObj.studentId}`)
            .then((res) => {
                this.setState({ 
                    data: res.data,
                    addImageFile: null,
                    addImageFileName: null
                })
                console.log(this.state.data)
            })
            
            this.refs.deskripsi.value = ''
        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderDataKelas = () => {
        
        if(this.state.pendidikan) {
            if(this.state.pendidikan === 'TK') {
                return (
                    <select ref={(Kelas) => this.Kelas = Kelas}>
                        <option value=''>Pilih Kelas</option>
                        <option value='TK A'>Kelas TK A</option>
                        <option value='TK B'>Kelas TK A</option>
                    </select>
                )
            }

            if(this.state.pendidikan === 'SD') {
                return (
                    <select ref={(Kelas) => this.Kelas = Kelas}>
                         <option value=''>Pilih Kelas</option>
                        <option value='1'>Kelas 1</option>
                        <option value='2'>Kelas 2</option>
                        <option value='3'>Kelas 3</option>
                        <option value='4'>Kelas 4</option>
                        <option value='5'>Kelas 5</option>
                        <option value='6'>Kelas 6</option>
                    </select>
                )
            }

            if(
                this.state.pendidikan === 'SMP' || 
                this.state.pendidikan === 'SMA' || 
                this.state.pendidikan === 'SMK'
            ) {
                return (
                    <select ref={(Kelas) => this.Kelas = Kelas}>
                         <option value=''>Pilih Kelas</option>
                        <option value='1'>Kelas 1</option>
                        <option value='2'>Kelas 2</option>
                        <option value='3'>Kelas 3</option>
                    </select>

                )                
            }

            if(this.state.pendidikan === 'KULIAH') {
                return (
                    <select ref={(Kelas) => this.Kelas = Kelas}>
                         <option value=''>Pilih Semester</option>
                        <option value='Semester 1'>Semester 1</option>
                        <option value='Semester 2'>Semester 2</option>
                        <option value='Semester 3'>Semester 3</option>
                        <option value='Semester 4'>Semester 4</option>
                        <option value='Semester 5'>Semester 5</option>
                        <option value='Semester 6'>Semester 6</option>
                        <option value='Semester 7'>Semester 7</option>
                        <option value='Semester 8'>Semester 8</option>
                    </select>
                )
            }
        }

    }

    render() { 
       if(this.props.role === 'User') {
        return ( 
            <div className='container'>
                    <div className='row'>
                    {this.renderStudentDetailForGuest()}
                        <div className='col-12'>
                            
                        <table>
                        <thead>
                            <tr>
                                <th>Gambar</th>
                                <th>Kelas</th>
                                <th>Deskripsi</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        {this.renderStudentDetail()}
                        {
                            this.props.role === 'User' ? 
                            <tbody style={{ marginTop: 60 }}>
                                <tr>
                                    <td>
                                        <button onClick={this.addNewDetail}>
                                            upload
                                        </button>
                                    </td>
                                    <td>
                                        {this.renderDataKelas()}
                                    </td>
                                    <td>
                                        <input type='text' ref='deskripsi' placeholder='description'/>
                                        <CustomInput onChange={this.onAddImageFileChange} id='addImagePost'type='file' label={this.state.addImageFileName} />
                                    </td>
                                </tr>
                            </tbody>
                            :
                            null
                        }
                  </table>
                        </div>
                </div>
            </div>
        );
       }
       
       return ( 
        <div className='container'>
                <div className='row'>
                    {this.renderStudentDetailForGuest()}
                </div>
        </div>
    );
    }
}

const mapStateToProps = ({auth}) => {
    return {
        role: auth.role
    }
}
 
export default connect(mapStateToProps)(StudentDetails);