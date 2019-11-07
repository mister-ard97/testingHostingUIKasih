import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Table, Button, Modal, ModalBody, ModalFooter, ModalHeader, Input } from 'reactstrap'
import { TextField, MenuItem, makeStyles } from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab'
import Axios from 'axios'
import _ from 'lodash'
import { URL_API } from '../../helpers/Url_API'

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
}));

class ManageSchool extends Component{
    state = {
        data:'',
        listBank:'',
        bank:'',
        selectedId: '',
        addModal: false,
        editModal: false,
        verifiedModal: false,
        errorMsg:''
    }

    componentDidMount(){
        Axios.get(URL_API+'/school/getSchool')
        .then((res)=>{
            console.log(res.data)
            this.setState({data: res.data})
        })

        Axios.get(URL_API+'/payment/beneficiary_banks')
        .then((res)=>{
            console.log(res.data)
            this.setState({listBank: res.data.beneficiary_banks})
        }).catch((err)=>{
            console.log(err)
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
                    <td><Button color='primary' onClick={()=>this.setState({verifiedModal: true, selectedId: i})}>Verifikasi</Button></td>
                    <td><Button color='warning' onClick={()=>this.setState({editModal: true, selectedId: i})}>Edit</Button></td>
                    <td><Button color='danger' onClick={()=> this.deleteBtnClick(i)}>Delete</Button></td>
                    {/* <td><Button onClick={()=> this.verifikasiSekolah(i)}>test</Button></td> */}
                </tr>
            )
        })
    }

    renderVerModal = () => {
        if(this.state.selectedId.length !== 0){
            const index = this.state.selectedId
            const {id, nama} = this.state.data[index]
            return (
                <Modal isOpen={this.state.verifiedModal} toggle={()=>this.setState({verifiedModal: false})}>
                    <ModalHeader toggle={()=>this.setState({verifiedModal: false})}>
                        
                    </ModalHeader>
                    <ModalBody>
                        <p>Verifikasi Data Sekolah : <b>{nama}</b></p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={()=> this.verifikasiSekolah(id, index)} color='success'>Verifikasi</Button>
                        <Button color='danger'>Reject</Button>
                    </ModalFooter>
                </Modal>
            )
        }
    }

    verifikasiSekolah = (id, index) => {
        const {nama, namaPemilikRekening , nomorRekening, bank, email } = this.state.data[index]

        // let nama = 'SMK masku dsad'
        let string = _.camelCase(nama).slice(0,20)
        let alias = string.charAt(0).toUpperCase() + string.slice(1)
        console.log(alias +' panjang = '+ alias.length)
        
        const data = {
            "name": namaPemilikRekening,
            "account": nomorRekening,
            "bank": bank,
            "alias_name": alias,
            "email": email
        }
        
        Axios.post(URL_API+'/school/verifiedSchool?id='+id)
        .then((res)=>{
            // console.log(res.data)
            Axios.get(URL_API+'/school/getSchool')
            .then((res)=>{
                // console.log(res.data)
                this.setState({data: res.data, verifiedModal: false})
            }).catch((err)=>{
                console.log(err)
            })

            Axios.post(URL_API+'/payment/beneficiaries', data)
            .then((ress)=>{
                // console.log(ress.data)
            }).catch((err)=>{
                    if(err.response.data.message.error_message === 'An error occurred when creating beneficiary'){
                        window.alert(err.response.data.message.errors)
                    }
            })
            
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderAddModal = () =>{
        const {textField, menu, formControl} = useStyles
        return(
            <Modal isOpen={this.state.addModal} toggle={()=>this.setState({addModal: false, bank: ''})}>
                <ModalHeader toggle={()=>this.setState({addModal: false, bank:''})}>
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
                    <TextField
                            id="bank"
                            multiple
                            select
                            label="Bank"
                            className={textField, formControl}
                            value={this.state.bank}
                            onChange={this.handleChangebank()}
                            SelectProps={{
                                MenuProps: {
                                    className: menu,
                                },
                            }}
                            margin="normal"
                            fullWidth
                        >
                            {/* Render dropwodn menu */}
                            {this.renderBank()} 
                        </TextField>
                            
                        <Autocomplete
                            options={this.state.listBank}
                            getOptionLabel={option => option.name}
                            style={{width: 300}}
                            // freeSolo
                            // options={this.state.listBank.map(option => option.name)}
                            renderInput={params=>(
                                <TextField  {...params} placeholder='Bank' variant='outlined' fullWidth/>
                            )}
                            />
                </ModalBody>
                <ModalFooter>
                    <Button color='success' onClick={this.addSekolahClick}>Simpan</Button>
                </ModalFooter>
            </Modal>
        )
    }

    handleChangebank = name => event => {
        this.setState({bank: event.target.value})
    }

    renderBank = () => {
        let data = this.state.listBank
        return data.map((val, i)=>{
            return <MenuItem key={i} value={val.code}>{val.name}</MenuItem>
        })
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
        // console.log(this.state.addModal)
        if(this.state.data.length === 0){
            return <p>Loading</p>
        }
        if(this.state.listBank.length === 0){
            return <p>Loading</p>
        }
        return(
            <div>
                
                <div className='container mt-4 mb-4'>
                    <b>List Sekolah Terdaftar</b>
                    <Link to='/schooladd'>
                        <Button color='success' style={{float:'right', textDecoration: 'none'}} className='mb-3' onClick={()=>this.setState({addModal:true})}>Add Sekolah</Button>
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
                            <th colSpan='3' style={{textAlign:'center'}}>Action</th>
                        </tr>
                        {this.renderSekolah()}
                    </Table>
                </div>
                {this.renderAddModal()}
                {this.renderEditModal()}
                {this.renderVerModal()}

                
            
            </div>
        )
    }
}

export default ManageSchool;