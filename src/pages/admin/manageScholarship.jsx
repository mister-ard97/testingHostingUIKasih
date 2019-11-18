import React, {Component} from 'react'
import { Table, Button, Modal, ModalBody, ModalHeader, ModalFooter, Input, Pagination, PaginationItem, PaginationLink, Progress} from 'reactstrap'

// import { Pagination, PaginationItem, PaginationLink, Progress } from 'reactstrap';
import { URL_API } from '../../helpers/Url_API'
import { TextField, MenuItem, makeStyles  } from '@material-ui/core'
import { connect } from 'react-redux'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Axios from 'axios';

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

class ManageScholarship extends Component{
    state = {
        data : '',
        detailData : '',
        openModal:false,
        openEditModal:false,
        openVerModal: false,
        detailId:'',
        bulan:'',
        deskripsi:'',
        sDeskripsi:'',
        nominal: 0,
        judul:'',
        verifikasi:'',
        verifikasiId:'',
        note:'',
        totalpage: ''
    }
    componentDidMount(){
        // let id= this.props.id
        let limit = 5

        
        const parsed = queryString.parse(this.props.location.search);
        
        if(!parsed.page) {
            parsed.page = 1
        }

        let data = {
            id: this.props.id,
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

        Axios.post(URL_API+'/scholarship/getScholarshipAllUserByAdmin', data, options)
        .then((res)=>{
            console.log(res.data)
            // var results = res.data.result.map((val)=>{
            //     var hasil = {...val, ...val.School, ...val.Student, ...val.Subscriptions[0]}
            //     hasil.totaldonation = parseInt(hasil.totaldonation)
               
            //     return hasil
            // })

            // console.log(results)
            this.setState({
                data: res.data.results,
                totalpage: Math.ceil(res.data.total / limit)
            })
            
        }).catch((err)=>{
            console.log(err)
        })
    }
    renderScholarshipList = () => {
        // if(this.state.data){
            // console.log(this.state.data[0].Student.namaSiswa)
        return this.state.data.map((val, i) => {
            // console.log(this.state.data[i].Student.namaSiswa)
            // console.log(val.Student.namaSiswa)
            // if(val.isOngoing == 'Cancelled'){
            //     this.setState({cancelled: 'disabled'})
            // }
            return (
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>{this.props.nama}</td>
                    <td>{val.Student.namaSiswa}</td>
                    {/* <td>{this.state.data[i].Student.namaSiswa}</td> */}
                    <td>Rp. {val.nominal}</td>
                    <td>{val.durasi} Bulan</td>
                    <td style={{textAlign:'center'}}>{val.isVerified}</td>
                    <td style={{textAlign:'center'}}>{val.isOngoing}</td>
                    <td style={{textAlign:'center'}}><Button color='primary' onClick={()=> this.setState({openModal: true, detailId: i})}>Detail</Button></td>
                    <td style={{textAlign:'center'}}><Button color='success' onClick={()=> this.setState({openEditModal: true, detailId: i})}>Edit</Button></td>
                    <td style={{textAlign:'center'}}><Button color='warning' onClick={()=> this.setState({openVerModal: true, verifikasiId: val.id})}>verifikasi</Button></td>
                </tr>
            )
        })
    // }
    }

    verifikasiBtn = () => {
        return (
            <Modal isOpen={this.state.openVerModal} toggle={()=> this.setState({ openVerModal: false, detailId:''})} size='lg'>
                <ModalHeader>Verifikasi Scholarship</ModalHeader>
                <ModalBody>
                    <Input type='textarea' onChange={(e)=>this.setState({note: e.target.value })} placeholder='catatan' maxLength='255'/>
                </ModalBody>
                <ModalFooter>
                    <Button color='success' onClick={()=> this.verificationActionBtn(1)}>Verified</Button>
                    <Button color='danger'onClick={()=> this.verificationActionBtn(0)}>Reject</Button>
                    <Button color='warning' onClick={()=>this.setState({openVerModal: false, detailId: ''})}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }

    verificationActionBtn = (status) => {
        // console.log(status)
        let data = {
            isVerified: status,
            isOngoing: status,
            note: this.state.note
        }

        let token = localStorage.getItem('token')
            var options = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

        console.log(data)
        Axios.put(URL_API+'/scholarship/putVerification?id='+this.state.verifikasiId, data, options)
        .then((res)=>{
            console.log(res.data)
            // this.setState({})

            Axios.get(URL_API+'/scholarship/getScholarshipPerUser?id=' + this.props.id, options)
        .then((res)=>{
            console.log(res.data)
            // var results = res.data.result.map((val)=>{
            //     var hasil = {...val, ...val.School, ...val.Student, ...val.Subscriptions[0]}
            //     hasil.totaldonation = parseInt(hasil.totaldonation)
               
            //     return hasil
            // })

            // console.log(results)
            this.setState({data: res.data, openVerModal:false, detailId: ''})
            
        }).catch((err)=>{
            console.log(err)
        })
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderModalDetail = () => {
        if(this.state.detailId !== ''){
            // this.setState({detailId: id, openModal: true})
        // console.log('masuk modal')
        // console.log(this.state.detailId)
        let Id = this.state.detailId    
        console.log(this.state.data[Id])
        const { namaSiswa, studentImage} = this.state.data[Id].Student
        const { namaSekolah } = this.state.data[Id].School
        const { judul, nominal, description, shareDescription, durasi, scholarshipStart, scholarshipEnded} = this.state.data[Id]
            return(
                <Modal isOpen={this.state.openModal} toggle={()=>this.setState({ openModal : false, detailId: ''})} size='xl'>
                    <ModalHeader>Detail Scholarship</ModalHeader>
                    <ModalBody>
                        <h3>{ judul }</h3>
                        <div className='row'>
                        
                            <div className='col-md-2'>
                                <img src={`${URL_API}/${studentImage}`} width='200px'/>
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
                    <ModalFooter>
                        <Button onClick={()=>this.setState({openModal: false})} color='danger'>Close</Button>
                    </ModalFooter>
                </Modal>
            )
        }
    }

    handleChangeBulan = name => event => {
        this.setState({ bulan: event.target.value})
    }

    renderEditModal = () => {
        if(this.state.detailId !== ''){
            // this.setState({detailId: id, openModal: true})
        // console.log('masuk modal')
        // console.log(this.state.detailId)
        let Id = this.state.detailId    
        // console.log(this.state.data[Id])
        
        const {textField, menu, formControl} = useStyles
        const { namaSiswa, studentImage} = this.state.data[Id].Student
        const { namaSekolah } = this.state.data[Id].School
        const {id, judul, nominal, description, shareDescription, durasi, scholarshipStart, scholarshipEnded} = this.state.data[Id]
            return(
                <Modal isOpen={this.state.openEditModal} toggle={()=>this.setState({ openEditModal : false, detailId: ''})} size='xl'>
                    <ModalHeader>Detail Scholarship</ModalHeader>
                    <ModalBody>
                        <div className='row'>
                        
                            <div className='col-md-2'>
                                <img src={`${URL_API}/${studentImage}`} width='200px'/>
                            </div>
                            <div className='col-md-9 pl-5'>
                                
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td width='20%'>Judul</td>
                                            <td>:<Input type='text' defaultValue={judul} onChange={(e)=>this.setState({judul: e.target.value})}/></td>
                                        </tr>
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
                                            <td>: <Input type='text' defaultValue={nominal} onChange={(e)=>this.setState({nominal: e.target.value})}/></td>
                                        </tr>
                                        <tr>
                                            <td width='20%'>Durasi</td>
                                            <td>: 
                                            <TextField
                                                id="bulan"
                                                multiple
                                                select
                                                label="Durasi galangan dana"
                                                className={textField, formControl}
                                                value={this.state.bulan ? this.state.bulan : durasi}
                                                onChange={this.handleChangeBulan()}
                                                SelectProps={{
                                                    MenuProps: {
                                                        className: menu,
                                                    },
                                                }}
                                                margin="normal"
                                                fullWidth
                                            >
                                                {/* Render dropwodn menu */}
                                                <MenuItem key={1} value={1}> 1 Bulan </MenuItem>
                                                <MenuItem key={2} value={2}> 2 Bulan </MenuItem>
                                                <MenuItem key={3} value={3}> 3 Bulan </MenuItem>
                                                <MenuItem key={4} value={4}> 4 Bulan </MenuItem>
                                                <MenuItem key={5} value={5}> 5 Bulan </MenuItem>
                                                <MenuItem key={6} value={6}> 6 Bulan </MenuItem>
                                                <MenuItem key={7} value={7}> 7 Bulan </MenuItem>
                                                <MenuItem key={8} value={8}> 8 Bulan </MenuItem>
                                                <MenuItem key={9} value={9}> 9 Bulan </MenuItem>
                                                <MenuItem key={10} value={10}> 10 Bulan </MenuItem>
                                                <MenuItem key={11} value={11}> 11 Bulan </MenuItem>
                                                <MenuItem key={12} value={12}> 12 Bulan </MenuItem>
                                            </TextField>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width='20%'>Deskripsi</td>
                                            <td>: 
                                                <CKEditor
                                                    editor={ ClassicEditor }
                                                    data={this.state.deskripsi ? this.state.deskripsi : description }
                                                    onInit={ editor => {
                                                        // You can store the "editor" and use when it is needed.
                                                        console.log( 'Editor is ready to use!', editor );
                                                    } }
                                                    onChange={ ( event, editor ) => {
                                                        const data = editor.getData();
                                                        // console.log( { event, editor, data } );
                                                        this.setState({deskripsi: data})
                                                        // console.log(this.state.deskripsi)
                                                    } }
                                                    onBlur={ ( event, editor ) => {
                                                        console.log( 'Blur.', editor );
                                                    } }
                                                    onFocus={ ( event, editor ) => {
                                                        console.log( 'Focus.', editor );
                                                    } }
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width='20%'>Share Deskripsi</td>
                                            <td>: <Input type='text' defaultValue={shareDescription} onChange={(text)=> this.sDeskripsi(text.target.value)} maxLength='240'/></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='success' onClick={()=>this.onSumbitClick({id, Id})}>Submit</Button>
                        <Button color='danger' onClick={()=>this.setState({openEditModal: false})}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            )
        }
    }

    sDeskripsi = (text) => {
        this.setState({sDeskripsi: text})
    }

    renderPagingButton = () =>{
        if(this.state.totalpage !== 0){
            
            var jsx = []
            const parsed = queryString.parse(this.props.location.search);
            for(var i = 0; i < this.state.totalpage; i++){
                if(parsed.search || parsed.orderby) {
                    jsx.push(
                        <PaginationItem key={i}>
                           <PaginationLink href={`/manageScholarship?page=${i+1}`}>
                               {i+1}
                           </PaginationLink>
                       </PaginationItem>
                    )
                } else {
                    jsx.push(
                        <PaginationItem key={i}>
                           <PaginationLink href={`/manageScholarship?page=${i+1}`}>
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
                        <PaginationLink first href={`/manageScholarship?page=1`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink previous
                         href={`/manageScholarship?&page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
                      </PaginationItem>
                        {this.renderPagingButton()}
                      <PaginationItem>
                        <PaginationLink next 
                        href={`/manageScholarship?page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
                        this.state.totalpage : parseInt(currentpage) + 1}`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink last href={`/manageScholarship?page=${this.state.totalpage}`} />
                      </PaginationItem>
                    </Pagination>
                )
            } else {
                return (
                    <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first href={`/manageScholarship?page=1`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink previous
                         href={`/manageScholarship?page=${parseInt(currentpage) === 1 || parseInt(currentpage) < 0 ? '1' : parseInt(currentpage)-1} `} />
                      </PaginationItem>
                        {this.renderPagingButton()}
                      <PaginationItem>
                        <PaginationLink next 
                        href={`/manageScholarship?page=${this.state.totalpage === parseInt(currentpage) || parseInt(currentpage) > this.state.totalpage ? 
                        this.state.totalpage : parseInt(currentpage) + 1}`} />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink last href={`/manageScholarship?page=${this.state.totalpage}`} />
                      </PaginationItem>
                    </Pagination>
                )
            }
        }
    }



    onSumbitClick = ({id, Id}) => {
        this.setState({openEditModal: false})
        let data = {
            id,
            judul : this.state.judul ? this.state.judul : this.state.data[Id].judul,
            nominal : this.state.nominal ? this.state.nominal : this.state.data[Id].nominal,
            durasi : this.state.bulan ? this.state.bulan : this.state.data[Id].durasi,
            description : this.state.deskripsi ? this.state.deskripsi : this.state.data[Id].description,
            shareDescription : this.state.sDeskripsi ? this.state.sDeskripsi :  this.state.data[Id].shareDescription
        }
        console.log(data)

        let token = localStorage.getItem('token')
            var options = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

        Axios.put(URL_API + '/scholarship/putScholarship', data, options)
        .then((res) => {
            // console.log(res.data)
            Axios.get(URL_API+'/scholarship/getScholarshipPerUser?id=' + this.props.id, options)
            .then((res)=>{
                console.log(res.data)
                // var results = res.data.result.map((val)=>{
                //     var hasil = {...val, ...val.School, ...val.Student, ...val.Subscriptions[0]}
                //     hasil.totaldonation = parseInt(hasil.totaldonation)
                
                //     return hasil
                // })

                // console.log(results)
                this.setState({data: res.data})
                
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }


    render(){
        if(!this.props.id){
            return <p>Loading</p>
        }
        if(!this.state.data){
            return <p>Loading</p>
        }
        if(this.state.data.length === 0){
            return <p>belum ada project yang anda buat</p>
        }
        return(
            <div className='container mt-5 mb-5'>
                <p>Admin - List Beasiswa</p>
                {/* <div><Button color='success'><Link to='/addScholarship' style={{textDecoration:'none', color:'#fff'}}>Add Scholarship</Link></Button></div> */}
                <Table>
                   <thead>
                        <tr >
                            <th>No.</th>
                            <th>Campaigner</th>
                            <th>Nama Siswa</th>
                            <th>Target Donasi</th>
                            <th>Durasi</th>
                            <th style={{textAlign:'center'}}>Verifikasi</th>
                            <th style={{textAlign:'center'}}>Status</th>
                            <th colSpan='3' style={{textAlign:'center'}}>Aksi</th>
                        </tr>
                   </thead>
                   <tbody>    
                        {this.renderScholarshipList()}
                   </tbody>
                    {this.renderModalDetail()}
                    {this.renderEditModal()}
                    {this.verifikasiBtn()}
                    <tfoot>
                    {this.printPagination()}
                    </tfoot>
                </Table>
            </div>
        )
    }
}

const mapStateToProps = ({auth}) => {
    return{
        id : auth.id,
        nama: auth.nama
    }
}

export default connect(mapStateToProps, {}) (ManageScholarship);