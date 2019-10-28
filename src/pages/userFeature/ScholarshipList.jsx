import React, {Component} from 'react'
import { Table, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import { URL_API } from '../../helpers/Url_API'
import { connect } from 'react-redux'
import Axios from 'axios'

class ScholarshipList extends Component{
    state = {
        data : '',
        openModal:false,
        detailId:''

    }
    componentDidMount(){
        let id= this.props.id
        Axios.get(URL_API+'/scholarship/getScholarshipPerUser?id='+id)
        .then((res)=>{
            console.log(res.data)
            this.setState({data: res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }
    renderScholarshipList = () => {
        return this.state.data.map((val, i) => {
            return (
                <tr>
                    <td>{i+1}</td>
                    <td>{val.Student.namaSiswa}</td>
                    <td>Rp. {val.nominal}</td>
                    <td>{val.durasi} Bulan</td>
                    <td style={{textAlign:'center'}}>{val.isVerified == '1' ? 'Accepted' : val.isVerified == '2' ? 'rejected' : 'Waiting' }</td>
                    <td style={{textAlign:'center'}}>{val.isOngoing ? 'Ongoing' : 'ended' }</td>
                    <td style={{textAlign:'center'}}><Button color='primary' onClick={()=> this.renderModalDetail({openModal: true, detailId: val.id})}>Detail</Button></td>
                    <td style={{textAlign:'center'}}><Button color='danger'>Stop</Button></td>
                </tr>
            )
        })
    }

    renderModalDetail = (modal) => {
        this.setState({modal})
        console.log('masuk modal')
        let id = this.state.detailId
        Axios.get(URL_API + '/scholarship/getScholarshipDetail?id='+id)
        .then((res) => {
            console.log(res.data)
            this.setState({data: res.data[0]})
        })
        const {namaSiswa, studentImage} = this.state.data.Student
        const { namaSekolah } = this.state.data.School
        const { judul, nominal, description, shareDescription, durasi, scholarshipStart, scholarshipEnded} = this.state.data
        return(
            <Modal isOpen={this.state.openModal} toggle={()=>this.setState({ openModal : false})} >
                <ModalHeader>Detail Scholarship</ModalHeader>
                <ModalBody>
                    <h3>{ judul }</h3>
                    <div className='row'>
                    
                        <div className='col-md-2'>
                            <img src={`http://localhost:1998/${studentImage}`} width='200px'/>
                        </div>
                        <div className='col-md-9 pl-5'>
                            
                            <Table>
                                <tr>
                                    <td width='20%'>Nama</td>
                                    <td>: {namaSiswa}</td>
                                </tr>
                                <tr>
                                    <td width='20%'>Sekolah</td>
                                    <td>: {namaSekolah}</td>
                                </tr>
                                <tr>
                                    <td width='20%'>Target Donasi</td>
                                    <td>: {nominal}</td>
                                </tr>
                                <tr>
                                    <td width='20%'>Durasi</td>
                                    <td>: {durasi} Bulan</td>
                                </tr>
                                <tr>
                                    <td width='20%'>Deskripsi</td>
                                    <td>: {description}</td>
                                </tr>
                                <tr>
                                    <td width='20%'>Share Deskripsi</td>
                                    <td>: {shareDescription}</td>
                                </tr>
                            </Table>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        )
    }


    render(){
        if(!this.props.id){
            return <p>Loading</p>
        }
        if(!this.state.data){
            return <p>Loading</p>
        }
        return(
            <div className='container mt-5 mb-5'>
                <p>List Beasiswa</p>
                <Table>
                    <tr >
                        <th>No.</th>
                        <th>Nama Siswa</th>
                        <th>Target Donasi</th>
                        <th>Durasi</th>
                        <th colSpan='2' style={{textAlign:'center'}}>Status</th>
                        <th colSpan='2' style={{textAlign:'center'}}>Aksi</th>
                    </tr>
                    {this.renderScholarshipList()}
                </Table>
            </div>
        )
    }
}

const mapStateToProps = ({auth}) => {
    return{
        id : auth.id
    }
}

export default connect(mapStateToProps, {}) (ScholarshipList);