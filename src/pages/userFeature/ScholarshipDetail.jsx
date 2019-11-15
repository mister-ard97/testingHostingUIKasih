import React, {Component} from 'react'
import Axios from 'axios'
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import queryString from 'query-string'
import { URL_API } from '../../helpers/Url_API'

class ScholarshipDetail extends Component {
    state = {
        data: '',
        modalPayout: false
    }

    componentDidMount(){
        let url = queryString.parse(this.props.location.search)
        console.log(url)
        // let id = 12
        Axios.get(URL_API + '/scholarship/getScholarshipDetail?id='+ url.id)
        .then((res) => {
            console.log(res.data)
            this.setState({data: res.data[0]})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderModalPayout=()=>{
        const { namaSekolah, bank, email, namaPemilikRekening, nomorRekening  } = this.state.data.School
        const { nominal} = this.state.data
        return(
            <Modal isOpen={this.state.modalPayout} toggle={()=>this.setState({modalPayout: false})}>
                <ModalHeader toggle={()=>this.setState({modalPayout: false})}>
                    Konfirmasi Pencairan Dana
                </ModalHeader>
                <ModalBody>
                    <Table>
                        <tr>
                            <td>Sekolah :</td>
                            <td>{namaSekolah}</td>
                        </tr>
                        <tr>
                            <td>Bank :</td>
                            <td>{bank}</td>
                        </tr>
                        <tr>
                            <td>Nama Pemilik Rekening</td>
                            <td>{namaPemilikRekening}</td>
                        </tr>
                        <tr>
                            <td>No. Rekening :</td>
                            <td>{nomorRekening}</td>
                        </tr>
                        <tr>
                            <td>Nominal : </td>
                            <td>{nominal}</td>
                        </tr>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.onCairkanClick} color='primary'>Cairkan</Button>
                    <Button onClick={()=>this.setState({modalPayout: false})} color='danger'>Batal</Button>
                </ModalFooter>
            </Modal>
        )
    }

    onCairkanClick = () => {
        // let nominal = this.state.nominal
        // console.log(nominal)
        const {namaSiswa} = this.state.data.Student
        const { namaSekolah, bank, email, namaPemilikRekening, nomorRekening  } = this.state.data.School
        const { id, nominal} = this.state.data
        let body={
            "payouts": [
                {
                "beneficiary_name": namaPemilikRekening,
                "beneficiary_account": nomorRekening,
                "beneficiary_bank": bank,
                "beneficiary_email": email,
                "amount": nominal,
                "notes": `Payout ${namaSiswa} `
                }
          ]
        }
        console.log(body)
        console.log(id)
        Axios.post(`${URL_API}/payout/payout?sId=${id}`, body)
        .then((res)=>{
            console.log(res.data)
            // this.setState({pendingPayout: res.data})
            this.setState({modalPayout: false})
        }).catch((err)=>{
            console.log(err)
        })
    }
    
    render(){
        if(!this.state.data){
            return <p>Loading</p>
        }
        const {namaSiswa, studentImage} = this.state.data.Student
        const { namaSekolah, bank, email, namaPemilikRekening, nomorRekening  } = this.state.data.School
        const { judul, nominal, description, shareDescription, durasi, scholarshipStart, scholarshipEnded} = this.state.data
        return (
            <div className='container mt-4 mb-4'>
                <p>detail</p>
                <h3>{ judul }</h3>
                <div className='row'>
                
                    <div className='col-md-2'>
                        <img src={`${URL_API}${studentImage}`} width='200px'/>
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
                <div>
                    <p>Total Dana terkumpul Rp. <b>{nominal}</b></p>
                    <Button color='success' style={{float: 'right'}} onClick={()=>this.setState({modalPayout:true})}>Cairkan Dana</Button>
                </div>
                {this.renderModalPayout()}
            </div>
        )
    }
}

export default ScholarshipDetail;