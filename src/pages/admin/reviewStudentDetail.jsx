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
        type: null,

        dataBaru: null,
        dataLama: null,
        idDetailSelected: null,

        rejectNote: null
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
            
            // console.log(res.data[0].StudentDetails)
            if(res.data.length === 0) {
                this.setState({
                    data: [],
                    name: null,
                    type: parsed.type,
                    
                    openModalCompare: false, 
                    openModalReject: false,
                    dataLama: null,
                    dataBaru: null, 
                    idDetailSelected: null,

                    rejectId : null,
                    rejectNote: null
                })
            } else {
                this.setState({
                    data: res.data[0].StudentDetails,
                    name: res.data[0].name,
                    type: parsed.type,

                    openModalCompare: false, 
                    openModalReject: false,
                    openModalEdit: false,
                    dataLama: null,
                    dataBaru: null, 
                    idDetailSelected: null,

                    rejectId : null,
                    rejectNote: null,

                    editDokumen: null
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
            // this.setState({
            //     openModalReject: false,
            //     rejectId: null
            // })
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
                                {item.class}
                            </td>
                            <td>
                                {item.deskripsi}
                            </td>
                            {
                                item.dataStatus === 'Unverified' || this.state.type === 'new' ?
                                <td>
                                    <input type='button' value='Accept' className='btn btn-success' onClick={() => this.onAcceptedDetail(item.id) }/>
                                    <input type='button' value='Rejected' className='btn btn-danger' onClick={() => this.setState({openModalReject: true, rejectId: item.id})}/>
                                    <input type='button' value='Edit Dokument' className='btn btn-edit' onClick={() => this.setState({openModalEdit: true, editDokumen: item})} />
                                </td>
                                :
                                null
                            }
                            {
                                item.dataStatus === 'Update Unverified' || this.state.type === 'update' ?
                                <td>

                                    {/* <input type='button' value='Accept Updated' className='btn btn-success' />
                                    <input type='button' value='Rejected Updated' className='btn btn-danger' /> */}
                                    <input type='button' className='btn btn-dark' value='Compare Changes' 
                                        onClick={() => this.showCompareDetails(item.id, {
                                            id: item.id,
                                            class: item.class,
                                            deskripsi: item.deskripsi,
                                            pictureReport: item.pictureReport
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
                dataLama: res.data[0],
                dataBaru,
                idDetailSelected: id
            }, () => {
                this.setState({
                    openModalCompare: true
                })
            })
            console.log(this.state.dataLama)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    updateDetailApprove = (idBaru, idLama) => {
        console.log(idBaru)
        console.log(idLama)

        let data = {
            detailId: this.state.idDetailSelected,
            idStudentDetail: idBaru,
            idrev: idLama
        }

        let token = localStorage.getItem('token')
        var options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + `/studentdetailrev/studentdetail-update-approve`, {data} , options)
            .then((res) => {
                console.log(res.data)
                alert('Data update diapprove')
                this.getDetailUnverified()
            //    this.setState({
            //        openModalCompare: false, 
            //        dataLama: null,
            //         dataBaru: null, 
            //         idDetailSelected: null
            //    })
                
            })
            .catch((err) => {
                console.log(err)
            })
    }

    updateDetailReject = (idBaru, idLama) => {
        console.log(idBaru)
        console.log(idLama)

        let data = {
            detailId: this.state.idDetailSelected,
            idStudentDetail: idBaru,
            idrev: idLama,
            statusNote: this.rejectNote.value
        }

        let token = localStorage.getItem('token')
        var options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + `/studentdetailrev/studentdetail-update-reject`, { data }, options)
            .then((res) => {
                console.log(res.data)
                // this.setState({
                //     openModalCompare: false,
                //     dataLama: null,
                //     dataBaru: null,
                //     idDetailSelected: null
                // })
                this.getDetailUnverified()
            })
            .catch((err) => {
                console.log(err)
            })
    }


    renderModalCompareDetails = () => {
        return (
            <div className='row m-0'>
                <div className='col-5'>
                    Data Lama 
                    <p>Kelas: {this.state.dataLama.class}</p>
                    <p>Deskripsi: {this.state.dataLama.deskripsi}</p>
                    <img src={URL_API + this.state.dataLama.pictureReport} alt={this.state.dataLama.pictureReport} className='img-fluid' />
                </div>
                <div className='col-1'>
                    <p>&raquo;</p>
                </div>
                <div className='col-5'>
                    Data Baru
                    <p>Kelas: {this.state.dataBaru.class}</p>
                    <p>Deskripsi: {this.state.dataBaru.deskripsi}</p>
                    <img src={URL_API + this.state.dataBaru.pictureReport} alt={this.state.dataBaru.pictureReport} className='img-fluid' />
                </div>
            </div>
        )
    }

    renderModalFooterCompare = () => {
        return (
            <div>
                <div className="p-3">
                    <h3 className="mx-2">Alasan Reject</h3>
                    <input type="text" className="form-control mx-2 " ref={(rejectNote) => this.rejectNote = rejectNote} onChange={() => this.setState({ rejectNote: this.rejectNote.value })} placeholder='Isi alasan untuk me-reject' />
                </div>

                <div className="d-flex flex-row my-4 mx-4">

                    

                    {
                        this.state.rejectNote ?
                            <input type="button" className="btn btn-danger form-control mx-2" value="reject update" onClick={() => this.updateDetailReject(this.state.dataBaru.id, this.state.dataLama.id)} />
                            :
                            <input type="button" className="btn btn-success form-control mx-2 " value="approve update" onClick={() => this.updateDetailApprove(this.state.dataBaru.id, this.state.dataLama.id)} />
                    }

                </div>

                {/* <div className="p-3">
                    <h3 className="mx-2">Alasan Reject</h3>
                    <input type="text" className="form-control mx-2 " ref="reject" />
                </div> */}
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

                {
                    this.state.dataLama ?
                        <Modal isOpen={this.state.openModalCompare} toggle={() => this.setState({ openModalCompare: false, dataLama: null, dataBaru: null, idDetailSelected: null })} size="xl">
                            <ModalHeader>
                                Compare  Student Details
                    </ModalHeader>
                            <ModalBody>
                                {this.renderModalCompareDetails()}

                            </ModalBody>
                            {this.renderModalFooterCompare()}
                        </Modal>
                        :
                        null
                }

                {/* Edit Modal */}

                <Modal isOpen={this.state.openModalEdit} toggle={()=>this.setState({ openModalEdit : false, editDokumen: null})} >
                    <ModalHeader>
                        Edit Dokumen
                    </ModalHeader>
                    <ModalBody>
                         {/* <h5>Plase enter your note here : </h5>
                         <small>Maks 45 karakter</small>
                         <input type="text" ref="rejectinput" className="form-control"/> */}
                         {console.log(this.state.editDokumen)}
                    </ModalBody>
                    <ModalFooter>
                        {/* <input type="button" onClick={()=>this.onRejectedDetail(this.state.rejectId, this.refs.rejectinput.value)} value="REJECT" className="form-control btn btn-danger"/> */}
                    </ModalFooter>
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