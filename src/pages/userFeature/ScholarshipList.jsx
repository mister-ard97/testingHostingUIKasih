import React, {Component} from 'react'
import { Table, Button, Modal, ModalBody, ModalHeader, ModalFooter, Input } from 'reactstrap'
import { URL_API } from '../../helpers/Url_API'
import { TextField, MenuItem, makeStyles  } from '@material-ui/core'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Axios from 'axios'

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

class ScholarshipList extends Component{
    state = {
        data : '',
        detailData : '',
        openModal:false,
        openEditModal:false,
        detailId:'',
        bulan:'',
        deskripsi:'',
        sDeskripsi:'',
        nominal: 0,
        judul:''
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
        // if(this.state.data){
            // console.log(this.state.data[0].Student.namaSiswa)
        return this.state.data.map((val, i) => {
            // console.log(this.state.data[i].Student.namaSiswa)
            // console.log(val.Student.namaSiswa)
            // if(val.isOngoing == 'Cancelled'){
            //     this.setState({cancelled: 'disabled'})
            // }
            return (
                <tr>
                    <td>{i+1}</td>
                    <td>{val.Student.namaSiswa}</td>
                    {/* <td>{this.state.data[i].Student.namaSiswa}</td> */}
                    <td>Rp. {val.nominal}</td>
                    <td>{val.durasi} Bulan</td>
                    <td style={{textAlign:'center'}}>{val.isVerified}</td>
                    <td style={{textAlign:'center'}}>{val.isOngoing}</td>
                    <td style={{textAlign:'center'}}>{val.note}</td>
                    <td style={{textAlign:'center'}}><Link to={`/scholarshipDetail?id=${val.id}`}><Button color='primary'>Detail</Button></Link></td>
                    <td style={{textAlign:'center'}}><Button color='success' onClick={()=> this.setState({openEditModal: true, detailId: i})}>Edit</Button></td>
                    <td style={{textAlign:'center'}}><Button color='danger' onClick={val.isOngoing === 'cancelled' ? null : () => this.cancelBtnClick(val.id)}>Cancel</Button></td>
                </tr>
            )
        })
    // }
    }

    cancelBtnClick = (id) => {
        var yakin = window.confirm('yakin kamu????')
        if(yakin){
            Axios.put(URL_API +'/scholarship/cancelScholarship?id='+id)
            .then((res) => {
                // console.log(res.data)
                Axios.get(URL_API+'/scholarship/getScholarshipPerUser?id='+this.props.id)
                .then((res)=>{
                    console.log(res.data)
                    this.setState({data: res.data})
                }).catch((err)=>{
                    console.log(err)
                })
            })
        }
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
                    <ModalHeader toggle={()=>this.setState({ openModal : false, detailId: ''})}>Detail Scholarship</ModalHeader>
                    <ModalBody>
                        {/* <h3>{ judul }</h3> */}
                        <div>
                            <div className='row'>
                            
                                <div className='col-md-2'>
                                    <img src={`http://localhost:2019/${studentImage}`} width='200px'/>
                                </div>
                                <div className='col-md-9 pl-5'>
                                    
                                    <Table>
                                        <tr>
                                            <td colSpan='2'><h3>{judul}</h3></td>
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
                                <span>Dana Terkumpur Rp. 350.000</span>
                                <Button color='success' onClick={this.onClickPayout} style={{float:'right'}}>Cairkan Dana</Button>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        
                        {/* <Button onClick={()=>this.setState({openModal: false})} color='danger'>Close</Button> */}
                    </ModalFooter>
                </Modal>
            )
        }
    }

    onClickPayout=()=>{
        let nominal = this.state.nominal
        console.log(nominal)
        let body={
            "payouts": [
                {
                "beneficiary_name": 'andre',
                "beneficiary_account": "1298987678",
                "beneficiary_bank": "bni",
                "beneficiary_email": "beneficiary@apake.com",
                "amount": '350000',
                "notes": "Payout April 17"
                }
          ]
        }
        Axios.post(URL_API+'/payment/payout', body)
        .then((res)=>{
            console.log(res.data)
            this.setState({pendingPayout: res.data})
        }).catch((err)=>{
            console.log(err)
        })

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
                                <img src={`http://localhost:1998/${studentImage}`} width='200px'/>
                            </div>
                            <div className='col-md-9 pl-5'>
                                
                                <Table>
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
        Axios.put(URL_API + '/scholarship/putScholarship', data)
        .then((res) => {
            // console.log(res.data)
            Axios.get(URL_API+'/scholarship/getScholarshipPerUser?id='+this.props.id)
            .then((res)=>{
                // console.log(res.data)
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
        return(
            <div className='container mt-5 mb-5'>
                <p>List Beasiswa</p>
                <div className='mb-3'><Button color='success'><Link to='/addScholarship' style={{textDecoration:'none', color:'#fff'}}>Add Scholarship</Link></Button></div>
                <Table>
                    <tr >
                        <th>No.</th>
                        <th>Nama Siswa</th>
                        <th>Target Donasi</th>
                        <th>Durasi</th>
                        <th style={{textAlign:'center'}}>Verifikasi</th>
                        <th style={{textAlign:'center'}}>Status</th>
                        <th style={{textAlign: 'center'}}>Note From Admin</th>
                        <th colSpan='3' style={{textAlign:'center'}}>Aksi</th>
                    </tr>
                    {this.renderScholarshipList()}
                    {this.renderModalDetail()}
                    {this.renderEditModal()}
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