import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../API'
import { CustomInput } from 'reactstrap';


class StudentDetails extends Component {
    state = { 
        data: [],
        raportUser: [],
        edit: false,
        addImageFileName: null,
        addImageFile: null,
        selectedId: 0
    }

    componentDidMount(){
        var id = this.props.location.search.split('=')[1]
        // Axios.get(API_URL + `/student/get-student-detail/1` )
        
        // Firliandy
        // Axios.get(API_URL + `/student-detail/get-student-detail/${id}`)
        // .then((res) => {
        //     this.setState({ data: res.data })
        //     console.log(this.state.data)
        // })

        // Dino
        Axios.get(URL_API+'/studentdetail/get-student-detail/1')
        .then(res=>{
            this.setState({data: res.data[0], raportUser:res.data[0].StudentDetails})
        }).catch(err=>{
            console.log(err)
        })

    }

    deleteDetail = (id) => {
        var studentId = this.props.location.search.split('=')[1]
        Axios.post(API_URL + `/student-detail/delete-student-detail/${id}`, { id, studentId })
        .then((res) => {
            console.log(res.data)
            this.setState({ data: res.data })
        })
    }

    renderRaport=()=>{

        return this.state.raportUser.map((item,index)=>{
            return(
                <img key={index} src={URL_API+item.pictureReport} alt={`${item.pictureReport}`}/>
            )
        })

    }


    renderStudentData = () => {
        // eslint-disable-next-line
        return this.state.data.map((val, index) => {
            if(val.id === this.state.selectedId){
                return(
                    <tbody>
                        <tr>
                            <td>
                                <CustomInput onChange={this.onAddImageFileChange} id='addImagePost'type='file' label={this.state.addImageFileName} />
                            </td>
                            <td>
                                <input type="text" defaultValue={val.deskripsi} ref='descEdit'/>
                            </td>
                            <td>
                                <button onClick={() => this.setState({ selectedId: 0})}>Cancel</button>
                                <button onClick={() => this.confirmEdit(val.id)}>Confirm</button>
                            </td>
                            
                        </tr>
                    </tbody>
                )

            }

            if(val.pictureReport !== null){
                return(
                    <tbody key={index}>
                        <th><img src={API_URL+val.pictureReport} alt={`${val.pictureReport}`} style={{ width: '50%' }} /></th>
                        <th>{val.deskripsi}</th>
                        {
                            this.props.role === 'User Admin' ?
                            <th>
                                <button onClick={() => this.setState({ selectedId: val.id })}>Edit</button>
                                <button onClick={() => this.deleteDetail(val.id)}>Delete</button>
                            </th>
                            :
                            null
                        }
                    </tbody>
                )
            }
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
        Axios.post(API_URL + `/student-detail/edit-student-detail/${newObj.studentId}`, formData)
        .then((res) => {
            console.log(res.data)
            this.setState({ data: res.data, selectedId: 0 })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    addNewDetail = () => {
        var formData = new FormData()
        var newObj = {
            deskripsi: this.refs.deskripsi.value,
            studentId: this.props.location.search.split('=')[1]
        }
        if(!this.state.addImageFile || !this.refs.deskripsi.value){
            return window.alert('fill all forms please')
        }
        formData.append('data', JSON.stringify(newObj))
        formData.append('image', this.state.addImageFile)
        Axios.post(API_URL + `/student-detail/add-student-detail/${newObj.studentId}`, formData)
        .then((res) => {
            console.log(res.data)
            this.setState({ 
                data: res.data,
                addImageFile: null,
                addImageFileName: null
            })
            this.refs.deskripsi.value = ''
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render() { 

        return ( 
            <div className='row'>
                    <div className='container'>

                    <table>
                        <thead>
                            <th className='pr-3'> Report Image</th>
                            <th className='pr-5'>Description</th>
                            <th>Actions</th>
                        </thead>
                        {this.renderStudentData()}
                        {
                            this.props.role === 'User Admin' ? 
                            <tbody style={{ marginTop: 60 }}>
                                <tr>
                                    <td>
                                        <button onClick={this.addNewDetail}>
                                            upload
                                        </button>
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
        );
    }
}

const mapStateToProps = ({auth}) => {
    return {
        role: auth.role
    }
}
 
export default connect(mapStateToProps)(StudentDetails);