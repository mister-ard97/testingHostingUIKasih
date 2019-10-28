import React, { Component } from 'react'
import Axios from 'axios';
import { URL_API } from '../../helpers/Url_API'
import queryString from 'query-string'
import {Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'

class AdminReviewStudentDetail extends Component {
    state = {
        data: null,
        openModalReject: false,
        openModalCompare: false,
        rejectId : null,

        dataBaru: null,
        dataLama: null
    }
    componentDidMount(){
        this.getDetailUnverified()
    }  

    getDetailUnverified = () => {
        var parsed = queryString.parse(this.props.location.search)
        // Axios.get(API_URL + `/student/get-student-detail/1` )
        console.log(parsed.id)
        let token = localStorage.getItem('token')
        var options ={
            headers : 
            {
                'Authorization': `Bearer ${token}`
            }
        }
        Axios.get(URL_API + `/studentdetailrev/get-student-detailrev/${parsed.id}/?type=${parsed.type}`, options)
        .then((res) => {
            // console.log(res.data)
            // console.log(res.data[0].StudentDetails)
            if(res.data.length === 0) {
                this.setState({
                    data: [],
                    name: null,
                })
            } else {
                this.setState({
                    data: res.data[0].StudentDetails,
                    name: res.data[0].name,
                })
            }
            
        })
        .catch((err) => {
            console.log(err)
        })

    }

    onAcceptedDetail = (id) => {
        let token = localStorage.getItem('token')
        var options ={
            headers : 
            {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + `/studentdetailrev/newStudentDetailApprove/${id}`, {}, options)
        .then((res) => {
            console.log(res)
            alert('Data telah diapprove')
            this.getDetailUnverified();

        })
        .catch((err) => {
            console.log(err)
        })
    }

    onRejectedDetail = (id, text) => {
        let token = localStorage.getItem('token')
        var options ={
            headers : 
            {
                'Authorization': `Bearer ${token}`
            }
        }

        let obj = {
            id, text
        }

        Axios.post(URL_API + `/studentdetailrev/StudentDetailRejected`, obj, options)
        .then((res) => {
            alert('Data telah direject')
            this.setState({
                openModalReject: false,
                rejectId: null
            })
            this.getDetailUnverified();

        })
        .catch((err) => {
            console.log(err)
        })
    }

    onUpdateDetailAccepted = () => {

    }

    onUpdateDetailRejected = () => {

    }
 
    renderListDetailsStudent = () => {
        if(this.state.data) {
            if(this.state.data.length !== 0) {
                return this.state.data.map((item, id) => {
                    return (
                        <tr key={id}>
                            <td>
                                <img src={URL_API + item.pictureReport} alt={item.pictureReport} style={{ width: '20%' }}/>
                            </td>
                            <td>
                                {item.kelas}
                            </td>
                            <td>
                                {item.deskripsi}
                            </td>
                            {
                                item.dataStatus === 'Unverified' ?
                                <td>
                                    <input type='button' value='Accept' className='btn btn-success' onClick={() => this.onAcceptedDetail(item.id) }/>
                                    <input type='button' value='Rejected' className='btn btn-danger' onClick={() => this.setState({openModalReject: true, rejectId: item.id})}/>
                                </td>
                                :
                                null
                            }
                            {
                                item.dataStatus === 'Update Unverified' ?
                                <td>

                                    {/* <input type='button' value='Accept Updated' className='btn btn-success' />
                                    <input type='button' value='Rejected Updated' className='btn btn-danger' /> */}
                                    <input type='button' className='btn btn-dark' value='Compare Changes' 
                                        onClick={() => this.showCompareDetails(item.id, {
                                            newKelas: item.kelas,
                                            newDeskripsi: item.deskripsi,
                                            newPictureReport: item.pictureReport
                                        })}
                                    />
                                </td>
                                :
                                null
                            }
                        </tr>
                    )
                })
            } else {
                return (
                    <tr>
                        <td colSpan='4'>
                            Data detail yang di review tidak ada.
                        </td>
                    </tr>
                )
            }
        }
        
       
    }

    showCompareDetails = (id, dataBaru) => {

        console.log(dataBaru)

        let token = localStorage.getItem('token')
        var options ={
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.get(URL_API + `/studentdetailrev/student-detail-compare/${id}`, options)
        .then((res) => {
            console.log(res.data)
            this.setState({
                openModalCompare: true,
                dataLama: res.data[0],
                dataBaru
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderModalCompareDetails = () => {
        return (
            <div className='row m-0'>
                <div className='col-6'>
                    Data Lama
                    <p>Kelas {this.state.dataLama.kelas}</p>
                </div>
                <div className='col-6'>
                    Data Baru
                    <p>Kelas {this.state.dataBaru.kelas}</p>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className='container-fluid'>

                { /* Modal Rejected */}
                <Modal isOpen={this.state.openModalReject} toggle={()=>this.setState({ openModalReject : false, rejectId: null})} >
                    <ModalHeader>
                        Detail Reject
                    </ModalHeader>
                    <ModalBody>
                         <h5>Plase enter your note here : </h5>
                         <small>Maks 45 karakter</small>
                         <input type="text" ref="rejectinput" className="form-control"/>
                    </ModalBody>
                    <ModalFooter>
                        <input type="button" onClick={()=>this.onRejectedDetail(this.state.rejectId, this.refs.rejectinput.value)} value="REJECT" className="form-control btn btn-danger"/>
                    </ModalFooter>
                </Modal>

                {/* Modal Compare */}

                <Modal isOpen={this.state.openModalCompare} toggle={()=>this.setState({ openModalCompare : false})}  size="xl">
                    <ModalHeader>
                        Compare  Student Details
                    </ModalHeader>
                    <ModalBody>
                        {this.renderModalCompareDetails()}
                         
                    </ModalBody>
                        {/* {this.renderModalFooterCompare()} */}
                </Modal>

                <div className='row m-0'>
                    {
                        this.state.name ?
                        <h3>Detail {this.state.name}</h3>
                        :
                        <h3>Tidak ada dokumen yang direview untuk murid ini</h3>
                    }
                    
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                        <th scope="col">Image</th>
                        <th scope="col">Kelas</th>
                        <th scope="col">Deskripsi</th>
                        <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderListDetailsStudent()}
                    </tbody>
                </table>
                </div>
            </div>
        )
    }
}

export default AdminReviewStudentDetail