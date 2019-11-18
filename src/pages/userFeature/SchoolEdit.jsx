import React, {Component} from 'react'
import {Input, Button, Spinner, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'
import { Paper, TextField} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';

import Axios from 'axios'
import {Redirect} from 'react-router-dom'
import _ from 'lodash'
import queryString from 'query-string'
import LoadingOverlay from 'react-loading-overlay'
import { URL_API } from '../../helpers/Url_API'

class SchoolEdit extends Component{
    state={
        editData: '',
        listBank:'',
        bank:'',
        codeBank:'',
        account_name:'',
        success: false,
        loading: false,
        openModal: false,
    }

    componentDidMount(){

        let token = localStorage.getItem('token')
        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.get(URL_API+'/payment/beneficiary_banks')
        .then((resBank)=>{
            // console.log(res.data)
            console.log('List Bank')
            console.log(resBank.data.beneficiary_banks)

            let url = queryString.parse(this.props.location.search)
            Axios.post(`${URL_API}/school/getSelectedSchool?id=${url.id}`, {}, options)
            .then((res)=>{
           
            console.log(res.data)

            let namaBank;
            let codeBank

            resBank.data.beneficiary_banks.forEach((val) => {
                if(val.code === res.data.bank) {
                    
                    namaBank = val.name
                    codeBank = val.code
                    

                    return true
                }
            })

            // console.log(namaBank, codeBank)

            this.setState({
                listBank: resBank.data.beneficiary_banks,
                editData: res.data,
                bank: namaBank,
                codeBank: codeBank                
            })

            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })

        
    }

    handleChangeBank = (value) => {
        // console.log(value.name)
        this.setState({
            bank: value.name, codeBank: value.code
        })
    }

    editSekolahClick = () => {
        let nama = this.refs.namaSekolah.refs.inamaSekolah.value
        let alamat = this.refs.alamat.refs.ialamat.value
        let telepon = this.refs.noTelepon.refs.inoTelepon.value
        let namaPemilikRekening = this.refs.pemilikRek.refs.ipemilikRek.value
        let nomorRekening = this.refs.noRek.refs.inoRek.value
        let bank = this.state.codeBank
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

        let url = queryString.parse(this.props.location.search)
        let token = localStorage.getItem('token')
        var options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/school/putSchool?id='+url.id, data, options)
        .then((res) => {
            this.setState({success: true})
        }).catch((err)=> {
            console.log(err)
        })

        // Axios.post(URL_API + '/school/addSchool', data)
        // .then((res) => {        
        //     this.setState({success: true})
        // }).catch((err)=> {
        //     console.log(err)
        // })
    }

    validateAccount = () => {
        // console.log('masuk validate accound')
        let data = {
            "code" : this.state.codeBank,
            "account": this.refs.noRek.refs.inoRek.value
        }
        if(data.code !== '' && data.account !== ''){
            this.setState({loading: true})
            console.log(data)
                Axios.post(URL_API+'/payment/validateBankAccount', data)
                .then((res)=>{
                    console.log(res.data)       
                    this.setState({account_name: res.data.account_name, loading: false})
                    console.log(this.state.account_name)
                }).catch((err)=>{
                    console.log(err.response.data)
                    this.setState({loading: false})
                    // console.log(status)
                    if(err.response.data.message.error_message === 'An error occured when doing account validation'){
                        window.alert(err.response.data.message.errors.account)
                        document.getElementById('norek').value=''
                        
                    }
                })
        }
    }

    confirmationModal = (params) => {
        if(params) {
            return (
                <Modal isOpen={this.state.openModal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>
                        Confirmation
                    </ModalHeader>
                    <ModalBody>
                        <h4>Apa anda yakin ingin keluar dari halaman edit sekolah?</h4>
                        <small>Semua perubahan akan hilang jika anda keluar dari halaman ini</small>
                    </ModalBody>
                    <ModalFooter>
                        <a href='/schoollist' className='btn btn-success'>
                            Kembali ke halaman sekolah list
                        </a>
                        <Button onClick={this.toggle} color='danger'>Reject</Button>
                    </ModalFooter>
                </Modal>
            )
        }
    }


    toggle = () => {
        this.setState(prevState => ({openModal: !prevState.openModal}))
    }
   
    render(){
        
        if(this.state.listBank.length === 0){
            return <p>Loading</p>
        }
        if(this.state.success){
            return <Redirect to='/schoollist'/>
        }
        const {nama, alamat, bank, email, namaPemilikRekening, nomorRekening, telepon} = this.state.editData
        return(
            <div className='container mt-5 p-3'>

                {this.confirmationModal(this.state.openModal)}
            
                <center><h3>Edit Data Sekolah " {nama} "</h3></center>
                
                <Paper className='p-4'>
                    <Input className='mb-2' ref='namaSekolah' innerRef='inamaSekolah' type='text'  defaultValue={nama} placeholder='Masukkan nama sekolah' />
                    <Input className='mb-2' type='textarea' ref='alamat' innerRef='ialamat' defaultValue={alamat} placeholder='Masukkan alamat sekolah' />
                    {console.log(this.state.bank)}
                    <Autocomplete
                        options={this.state.listBank}
                        getOptionLabel={(option) => 
                           option.name
                        }
                        // style={{width: 300}}
                        onChange={(event, value)=> value ? this.handleChangeBank(value) : null}
                        className='mb-2'
                        renderInput={params=>(
                            <TextField {...params} variant='outlined' fullWidth />
                        )}
                    />
                    <p>{this.state.bank}</p>
                    
                    <Input className='mb-2' type='number' ref='noRek' innerRef='inoRek' defaultValue={nomorRekening} id='norek' onBlur={this.validateAccount} placeholder='Masukkan nomor rekening sekolah' />
                    <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        styles={{
                            spinner: (base) => ({
                              ...base,
                              marginTop: '1px',
                              width: '34px',                              
                            })
                          }}
                        >
                            <Input className='mb-2' type='text' ref='pemilikRek' innerRef='ipemilikRek' value={this.state.account_name ? this.state.account_name : namaPemilikRekening} disabled placeholder='Nama pemilik rekening' />
                    </LoadingOverlay>
                    <Input className='mb-2' type='number' ref='noTelepon' innerRef='inoTelepon' defaultValue={telepon} placeholder='Masukkan nomor telepon' />
                    <Input className='mb-2' type='email' ref='email' innerRef='iemail' defaultValue={email} placeholder='Masukkan alamat email'/>

                    <div className='d-flex mt-4'>
                        <Button className='mr-4' color='success' onClick={this.editSekolahClick}>Simpan Perubahan</Button>
                        <Button className='mr-4' color='danger' onClick={() => { this.setState(prevState => ({openModal: !prevState.openModal}))} }>Kembali ke halaman sekolah</Button>
                    </div>
                </Paper>
            </div>
        )
    }
}

export default SchoolEdit;