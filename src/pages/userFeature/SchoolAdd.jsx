import React, {Component} from 'react'
import {Input, Button, Spinner} from 'reactstrap'
import { Paper, TextField} from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab'
import Axios from 'axios'
import {Redirect} from 'react-router-dom'
import _ from 'lodash'
import LoadingOverlay from 'react-loading-overlay'
import { URL_API } from '../../helpers/Url_API'

class SchoolAdd extends Component{
    state={
        listBank:'',
        bank:'',
        codeBank:'',
        account_name:'',
        success: false,
        loading: false
    }

    componentDidMount(){
        Axios.get(URL_API+'/payment/beneficiary_banks')
        .then((res)=>{
            // console.log(res.data)
            this.setState({listBank: res.data.beneficiary_banks})
        }).catch((err)=>{
            console.log(err)
        })
    }

    handleChangeBank = (value) => {
        // console.log(value.name)
        this.setState({bank: value.name, codeBank: value.code})

    }

    addSekolahClick = () => {
        console.log('Masuk ke add school')
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

        let token = localStorage.getItem('token')
        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/school/addSchool', data, options)
        .then((res) => {        
            this.setState({success: true})
        }).catch((err)=> {
            console.log(err)
        })
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
   
    render(){
        
        if(this.state.listBank.length === 0){
            return <p>Loading</p>
        }
        if(this.state.success){
            return <Redirect to='/schoollist'/>
        }
        return(
            <div className='container mt-5 p-3'>
                <center><h3>Data Sekolah</h3></center>
                <Paper className='p-4'>
                    <Input className='mb-2' ref='namaSekolah' innerRef='inamaSekolah' type='text'  placeholder='Nama Sekolah' />
                    <Input className='mb-2' type='textarea' ref='alamat' innerRef='ialamat' placeholder='Alamat' />
                    <Autocomplete
                        options={this.state.listBank}
                        getOptionLabel={option => option.name}
                        // style={{width: 300}}
                        onChange={(event, value)=> value ? this.handleChangeBank(value) : null}
                        className='mb-2'
                        renderInput={params=>(
                            <TextField  {...params} placeholder='Bank' variant='outlined' fullWidth />
                        )}
                    />
                    <Input className='mb-2' type='number' ref='noRek' innerRef='inoRek' placeholder='No Rekening Sekolah' id='norek' onBlur={this.validateAccount}/>
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
                            <Input className='mb-2' type='text' ref='pemilikRek' innerRef='ipemilikRek' placeholder='Nama Pemilik Rekening' defaultValue={this.state.account_name} disabled/>
                    </LoadingOverlay>
                    <Input className='mb-2' type='number' ref='noTelepon' innerRef='inoTelepon' placeholder='No Telepon' />
                    <Input className='mb-2' type='email' ref='email' innerRef='iemail' placeholder='Email'/>

                    <Button className='mt-4' color='primary' onClick={this.addSekolahClick}>Simpan</Button>
                </Paper>
            </div>
        )
    }
}

export default SchoolAdd;