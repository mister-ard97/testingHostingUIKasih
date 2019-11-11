import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, Modal, ModalBody, ModalFooter, ModalHeader, Input } from 'reactstrap'
import Axios from 'axios'
import { URL_API } from '../../helpers/Url_API'

class SchoolList extends Component{
    state = {
        data:'',
        selectedId: '',
        addModal: false,
        editModal: false
    }

    componentDidMount(){
        Axios.get(URL_API+'/school/getSchool')
        .then((res)=>{
            console.log(res.data)
            this.setState({data: res.data})
        })
    }

    renderSekolah=()=>{
        return this.state.data.map((val, i) => {
            return(
                <tr>
                    <td>{i+1}</td>
                    <td>{val.nama}</td>
                    <td>{val.alamat}</td>
                    <td>{val.telepon}</td>
                    <td>{val.email}</td>
                    <td>{val.namaPemilikRekening}</td>
                    <td>{val.nomorRekening}</td>
                    <td>{val.bank}</td>
                    <td>{val.isVerified? 'verified' : 'unverified'}</td>
                    <td><Link to={`/schooledit?id=${val.id}`}><Button color='warning'>Edit</Button></Link></td>
                    <td><Button color='danger' onClick={()=> this.deleteBtnClick(i)}>Delete</Button></td>
                </tr>
            )
        })
    }

    renderAddModal = () =>{
        return(
            <Modal isOpen={this.state.addModal} toggle={()=>this.setState({addModal: false})}>
                <ModalHeader toggle={()=>this.setState({addModal: false})}>
                    Add Sekolah
                </ModalHeader>
                <ModalBody>
                    <Input className='mb-2' type='text' ref='namaSekolah' innerRef='inamaSekolah' placeholder='Nama Sekolah' />
                    <Input className='mb-2' type='textarea' ref='alamat' innerRef='ialamat' placeholder='Alamat' />
                    <Input className='mb-2' type='number' ref='noTelepon' innerRef='inoTelepon' placeholder='No Telepon' />
                    <Input className='mb-2' type='email' ref='email' innerRef='iemail' placeholder='Email'/>
                    <Input className='mb-2' type='text' ref='pemilikRek' innerRef='ipemilikRek' placeholder='Nama Pemilik Rekening' />
                    <Input className='mb-2' type='number' ref='noRek' innerRef='inoRek' placeholder='No Rekening Sekolah' />
                    <Input className='mb-2' type='text' ref='bank' innerRef='ibank' placeholder='Nama Bank' />
                </ModalBody>
                <ModalFooter>
                    <Button color='success' onClick={this.addSekolahClick}>Simpan</Button>
                </ModalFooter>
            </Modal>
        )
    }

    addSekolahClick = () => {
        let nama = this.refs.namaSekolah.refs.inamaSekolah.value
        let alamat = this.refs.alamat.refs.ialamat.value
        let telepon = this.refs.noTelepon.refs.inoTelepon.value
        let namaPemilikRekening = this.refs.pemilikRek.refs.ipemilikRek.value
        let nomorRekening = this.refs.noRek.refs.inoRek.value
        let bank = this.refs.bank.refs.ibank.value
        let email = this.refs.email.refs.iemail.value

        let data = {
            nama,
            alamat,
            telepon,
            namaPemilikRekening,
            nomorRekening,
            bank,
            email
        }

        console.log(data)

        Axios.post(URL_API + '/school/addSchool', data)
        .then((res) => {
            console.log(res.data)
            Axios.get(URL_API+'/school/getSchool')
            .then((res)=>{
                this.setState({data: res.data, addModal: false})
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=> {
            console.log(err)
        })
        // console.log(nama)
    }

    renderEditModal = () =>{
        if(this.state.selectedId.length !== 0) {
            let {id, nama, alamat, telepon, namaPemilikRekening, nomorRekening, bank, email} = this.state.data[this.state.selectedId]
            return(
                <Modal isOpen={this.state.editModal} toggle={()=>this.setState({editModal: false})}>
                    <ModalHeader toggle={()=>this.setState({editModal: false})}>
                        Edit Data Sekolah
                    </ModalHeader>
                    <ModalBody>
                        <Input className='mb-2' type='text' ref='namaSekolah' innerRef='inamaSekolah' defaultValue={nama} />
                        <Input className='mb-2' type='textarea' ref='alamat' innerRef='ialamat' defaultValue={alamat} />
                        <Input className='mb-2' type='number' ref='noTelepon' innerRef='inoTelepon' defaultValue={telepon} />
                        <Input className='mb-2' type='email' ref='email' innerRef='iemail' defaultValue={email}/>
                        <Input className='mb-2' type='text' ref='pemilikRek' innerRef='ipemilikRek' defaultValue={namaPemilikRekening} />
                        <Input className='mb-2' type='number' ref='noRek' innerRef='inoRek' defaultValue={nomorRekening} />
                        <Input className='mb-2' type='text' ref='bank' innerRef='ibank' defaultValue={bank} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color='success' onClick={()=>this.updateSekolahClick(id)}>Update</Button>
                    </ModalFooter>
                </Modal>
            )
        }
    }

    updateSekolahClick = (id) => {
        let nama = this.refs.namaSekolah.refs.inamaSekolah.value
        let alamat = this.refs.alamat.refs.ialamat.value
        let telepon = this.refs.noTelepon.refs.inoTelepon.value
        let namaPemilikRekening = this.refs.pemilikRek.refs.ipemilikRek.value
        let nomorRekening = this.refs.noRek.refs.inoRek.value
        let bank = this.refs.bank.refs.ibank.value
        let email = this.refs.email.refs.iemail.value

        let data = {
            nama,
            alamat,
            telepon,
            namaPemilikRekening,
            nomorRekening,
            bank,
            email
        }

        Axios.post(URL_API + '/school/putSchool?id='+id, data)
        .then((res) => {
            Axios.get(URL_API+'/school/getSchool')
            .then((res)=>{
                this.setState({data: res.data, editModal: false})
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=> {
            console.log(err)
        })
    }

    deleteBtnClick = (i) => {
        const {id, nama} = this.state.data[i]
        // console.log(nama)
        let konfirmasi = window.confirm('Apakah anda yakin akan menghapus data sekolah'+ nama)
        console.log(konfirmasi)
        if(konfirmasi){
            console.log('masuk')
            Axios.post(URL_API+'/school/deleteSchool?id='+id)
            .then((res)=>{
                Axios.get(URL_API+'/school/getSchool')
                .then((res)=>{
                    this.setState({data: res.data})
                }).catch((err)=>{
                    console.log(err)
                }).catch((err)=>{
                    console.log(err)
                })
            })
        }
    }

    render(){
        console.log(this.state.addModal)
        if(this.state.data.length === 0){
            return <p>Loading</p>
        }
        return(
            <div>
                <div className='container mt-4 mb-4'>
                    <b>List Sekolah Terdaftar</b>
                    <Link to='/schooladd'>
                        <Button color='success' style={{float:'right', textDecoration: 'none'}} className='mb-3'>Add Sekolah</Button>
                    </Link>
                    <Table className='mt-4'>
                        <tr>
                            <th>No.</th>
                            <th>Nama Kelas</th>
                            <th>Alamat</th>
                            <th>No. Tlp</th>
                            <th>Email</th>
                            <th>Pemilik Rek.</th>
                            <th>No. Rek</th>
                            <th>Bank</th>
                            <th>Status</th>
                            <th colSpan='2' style={{textAlign:'center'}}>Action</th>
                        </tr>
                        {this.renderSekolah()}
                    </Table>
                </div>
                {this.renderAddModal()}
                {this.renderEditModal()}
            </div>
        )
    }
}

export default SchoolList;