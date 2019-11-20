import React, {Component} from 'react'
// import { Link } from 'react-router-dom'
import { 
    Table, 
    Button,
    Modal, 
    ModalBody, 
    ModalFooter, 
    ModalHeader, 
    Input,
    Pagination, 
    PaginationItem, 
    PaginationLink
} from 'reactstrap'

import { TextField, MenuItem, makeStyles } from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab'
import Axios from 'axios'
import _ from 'lodash'
import { URL_API } from '../../helpers/Url_API'
import { isDataValid } from '../../helpers/helpers'

import queryString from 'query-string';

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
        errorMsg:'', 
        totalpage: ''
    }

    componentDidMount(){
        let limit = 5

        
        const parsed = queryString.parse(this.props.location.search);
        
        if(!parsed.page) {
            parsed.page = 1
        }

        let data = {
            name: '',
            page: parsed.page,
            date: 'ASC',
            limit
        }

        let token = localStorage.getItem('token')
            var options = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

        Axios.post(URL_API+'/school/getSchoolAdmin', data, options)
        .then((res)=>{
            console.log(res.data)
            this.setState({
                data: res.data.results,
                totalpage: Math.ceil(res.data.total / limit)
            })
        })
        .catch((err) => {
            console.log(err)
        })

        Axios.get(URL_API+'/payment/beneficiary_banks')
        .then((res)=>{
            console.log(res.data)
            this.setState({listBank: res.data.beneficiary_banks})
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderPagingButton = () =>{
        if(this.state.totalpage !== 0){
            
            var jsx = []
            const parsed = queryString.parse(this.props.location.search);
            for(var i = 0; i < this.state.totalpage; i++){
                if(parsed.search || parsed.orderby) {
                    jsx.push(
                        <PaginationItem key={i}>
                           <PaginationLink href={`/manageSchool?page=${i+1}`}>
                               {i+1}
                           </PaginationLink>
                       </PaginationItem>
                    )
                } else {
                    jsx.push(
                        <PaginationItem key={i}>
                           <PaginationLink href={`/manageSchool?page=${i+1}`}>
                               {i+1}
                           </PaginationLink>
                       </PaginationItem>
                   )
                }
            }
            return jsx
        }
    }

    printPagination = () =>{
        if(this.state.totalpage !== 0){
            const parsed = queryString.parse(this.props.location.search);
            var currentpage = parsed.page
            if(!parsed.page) {
                currentpage =  1
            }
            if (parsed.search || parsed.orderby) {
                console.log('Masuk')
                return (
                    <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first href={`/manageSchool?page=1`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink previous
                         href={`/manageSchool?&page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
                      </PaginationItem>
                        {this.renderPagingButton()}
                      <PaginationItem>
                        <PaginationLink next 
                        href={`/manageSchool?page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
                        this.state.totalpage : parseInt(currentpage) + 1}`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink last href={`/manageSchool?page=${this.state.totalpage}`} />
                      </PaginationItem>
                    </Pagination>
                )
            } else {
                return (
                    <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first href={`/manageSchool?page=1`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink previous
                         href={`/manageSchool?page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
                      </PaginationItem>
                        {this.renderPagingButton()}
                      <PaginationItem>
                        <PaginationLink next 
                        href={`/manageSchool?page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
                        this.state.totalpage : parseInt(currentpage) + 1}`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink last href={`/manageSchool?page=${this.state.totalpage}`} />
                      </PaginationItem>
                    </Pagination>
                )
            }
        }
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
                    <td><a className='btn btn-warning' href={`/schooledit?id=${val.id}`}>Edit</a></td>
                    <td>
                        {
                            val.isDeleted === 0 ? 
                            <Button color='danger' onClick={()=> this.deleteBtnClick(i)}>Delete</Button>
                            :
                            <p>Status sekolah: <span className='text-danger'>Terhapus</span></p>
                        }
                    </td>
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

        let token = localStorage.getItem('token')
        var options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        
        Axios.post(URL_API+'/school/verifiedSchool?id='+id, options)
        .then((res)=>{
            // console.log(res.data)
            let limit = 5

        
            const parsed = queryString.parse(this.props.location.search);
            
            if(!parsed.page) {
                parsed.page = 1
            }
    
            let data = {
                name: '',
                page: parsed.page,
                date: 'ASC',
                limit
            }
    
            let token = localStorage.getItem('token')
                var options = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
    
            Axios.post(URL_API+'/school/getSchoolAdmin', data, options)
            .then((res)=>{
                // console.log(res.data)
                this.setState({
                    data: res.data.results, 
                    verifiedModal: false,
                    totalpage: Math.ceil(res.data.total / limit)
                })
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

        if(!isDataValid(data)){
            return window.alert('harap untuk mengisi semua form')
        }

        console.log(data)

        let token = localStorage.getItem('token')
        var options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/school/addSchool', data, options)
        .then((res) => {
            // console.log(res.data)

                let limit = 5

            
            const parsed = queryString.parse(this.props.location.search);
            
            if(!parsed.page) {
                parsed.page = 1
            }

            let data = {
                name: '',
                page: parsed.page,
                date: 'ASC',
                limit
            }

            let token = localStorage.getItem('token')
                var options = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }

            Axios.post(URL_API+'/school/getSchoolAdmin', data, options)
            .then((res)=>{
                this.setState({
                    data: res.data.results, 
                    addModal: false,
                    totalpage: Math.ceil(res.data.total / limit)
                })
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

        let token = localStorage.getItem('token')
        var options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/school/putSchool?id='+id, data, options)
        .then((res) => {
            let limit = 5

        
        const parsed = queryString.parse(this.props.location.search);
        
        if(!parsed.page) {
            parsed.page = 1
        }

        let data = {
            name: '',
            page: parsed.page,
            date: 'ASC',
            limit
        }

        let token = localStorage.getItem('token')
            var options = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

        Axios.post(URL_API+'/school/getSchoolAdmin', data, options)
            .then((res)=>{
                this.setState({
                    data: res.data.results, 
                    editModal: false,
                    totalpage: Math.ceil(res.data.total / limit)
                })
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

            let token = localStorage.getItem('token')
            var options = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            Axios.post(URL_API+'/school/deleteSchool?id='+id, options)
            .then((res)=>{

                let limit = 5

        
                const parsed = queryString.parse(this.props.location.search);
                
                if(!parsed.page) {
                    parsed.page = 1
                }
        
                let data = {
                    name: '',
                    page: parsed.page,
                    date: 'ASC',
                    limit
                }
        
                let token = localStorage.getItem('token')
                    var options = {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
        
                Axios.post(URL_API+'/school/getSchoolAdmin', data, options)
                .then((res)=>{
                    this.setState({
                        data: res.data.results,
                        totalpage: Math.ceil(res.data.total / limit)
                    })
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
                    <b>List Sekolah Seluruh Sekolah</b>
                    {/* <Link to='/schooladd'>
                        <Button color='success' style={{float:'right', textDecoration: 'none'}} className='mb-3' onClick={()=>this.setState({addModal:true})}>Add Sekolah</Button>
                    </Link> */}

                    <a href='/schooladd'>
                        <Button color='success' style={{float:'right', textDecoration: 'none'}} className='mb-3' >Add Sekolah</Button>
                    </a>

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
                    {this.printPagination()}
                </div>
                {/* {this.renderAddModal()} */}
                {this.renderEditModal()}
                {this.renderVerModal()}
            </div>
        )
    }
}

export default ManageSchool;