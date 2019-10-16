import React, { Component } from 'react';
import Axios from 'axios';
import { API_URL } from '../API'
import { CustomInput } from 'reactstrap'

class StudentDetails extends Component {
    state = { 
        data: [],
        edit: false,
        addImageFileName: null,
        addImageFile: null,
        selectedId: 0
    }

    componentDidMount(){
        // var id = this.props.location.search.split('=')[1]
        // Axios.get(API_URL + `student/get-student/${id}`)
        Axios.get(API_URL + `/student/get-student-detail/1` )
        .then((res) => {
            this.setState({ data: res.data })
            console.log(this.state.data)
        })
    }

    deleteDetail = (id) => {

        Axios.post(API_URL + `/student/delete-student-detail/${id}`, {id, studentId: 1})
        .then((res) => {
            console.log(res.data)
            this.setState({ data: res.data })
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
                                <input type="text" defaultValue={val.deskripsi} />
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
                        <th><img src={API_URL+val.pictureReport} alt='report.jpeg' style={{ width: '50%' }} /></th>
                        <th>{val.deskripsi}</th>
                        <th>
                            <button onClick={() => this.setState({ selectedId: val.id })}>Edit</button>
                            <button onClick={() => this.deleteDetail(val.id)}>Delete</button>
                        </th>
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
            deskripsi: this.refs.deskripsi.value,
            studentId: 1
        }
        console.log(newObj)
        formData.append('data', JSON.stringify(newObj))
        formData.append('image', this.state.addImageFile)
        Axios.post(API_URL + `/student/edit-student-detail/${newObj.studentId}`, formData)
        .then((res) => {
            console.log(res.data)
            this.setState({ data: res.data })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    addNewDetail = () => {
        var formData = new FormData()
        var newObj = {
            deskripsi: this.refs.deskripsi.value,
            studentId: 2
        }
        if(!this.state.addImageFile || !this.refs.deskripsi.value){
            return window.alert('fill all forms please')
        }
        formData.append('data', JSON.stringify(newObj))
        formData.append('image', this.state.addImageFile)
        Axios.post(API_URL + `/student/add-student-detail/${1}`, formData)
        .then((res) => {
            console.log(res.data)
            this.setState({ data: res.data })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render() { 
        if(this.state.edit){
            return(
                <div className='row'>
                    {this.renderEditStudent()}
                </div>
            )
        }
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
                        <tbody>
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
                    </table>
                </div>
            </div>
        );
    }
}
 
export default StudentDetails;