import React, { Component} from 'react'
import {  Input, Form, FormGroup, Label, FormText, Button, CustomInput } from 'reactstrap'
import Axios from 'axios'
import { Redirect } from 'react-router-dom'
import {URL_API} from '../../helpers/Url_API'
import { TextField, MenuItem, makeStyles  } from '@material-ui/core'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { connect } from 'react-redux'

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

class ScholarshipAdd extends Component{
    state = {
        existSiswa:'',
        datasiswa : '',
        siswa: '',
        sekolah: '',
        kelas:'',
        bulan:'',
        deskripsi:'',
        sDeskripsi:'',
        nominal: 0,
        judul:'',
        success: false

    }
    componentDidMount = () => {
        Axios.get( URL_API+'/student/getstudentperuser?id='+this.props.userId )
        .then((res) => {
            console.log(res.data)
            this.setState({datasiswa: res.data})
        })
        .catch((err) => {
            console.log(err)
        })

        Axios.get(URL_API+'/scholarship/getExistStudent?id='+this.props.userId)
        .then((res) => {
            console.log(res.data)
            this.setState({existSiswa: res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }
    renderSiswa = () =>{
        var data = this.state.datasiswa
        var exist = this.state.existSiswa
        var siswa = []
        let list =  data.map((val, i) =>{
            // return exist.map((item) =>{
            //     if(val.id === item.studentId){
                    return <MenuItem key={val.id} value={val.id}>{val.name}</MenuItem>
                // }
            // })
        })

        return list
    }


    renderBulan = () => {
        let bulan = 12
        let result = ''
        for(var i = 1; i< bulan; i++){
            result += `<MenuItem key = ${i} value=${i}>${i} Bulan</MenuItem>`
        }
        console.log(result)
        document.getElementById('bulan').innerHTML=`<MenuItem key =1 value=1>1 Bulan</MenuItem>`
        // return result
    }

    handleChangesiswa = name => event => {
        // console.log(event.target.value)
        this.setState({siswa: event.target.value})
        
        let id = event.target.value
        console.log(id)
        Axios.get(URL_API + '/studentdetail/get-student-detail/'+ id)
        .then((res) => {
            console.log(res.data)
            this.setState({kelas: res.data[0].StudentDetails[0].class, sekolah: res.data[0].School })
        })
        .catch((err)=> {
            console.log(err)
        })
    };
    
    handleChangeBulan = name => event => {
        this.setState({ bulan: event.target.value})
    }



    renderFormAddScholarship = () => {
        const {textField, menu, formControl} = useStyles
        var bulan = 12
        return(
            <div>
                <Form>
                    <FormGroup>
                        <Label for="judul">Judul Galangan Dana</Label>
                        <Input ref='judul' type="text" name='judul' id='judul' placeholder='Ringankan biaya sekolah agus' onChange={(e)=>this.setState({judul: e.target.value})}/>
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            id="siswa"
                            multiple
                            select
                            label="Pilih Nama Siswa "
                            className={textField, formControl}
                            value={this.state.siswa}
                            onChange={this.handleChangesiswa()}
                            SelectProps={{
                                MenuProps: {
                                    className: menu,
                                },
                            }}
                            margin="normal"
                            fullWidth
                        >
                            {/* Render dropwodn menu */}
                            {this.renderSiswa()} 
                        </TextField>
                    </FormGroup>
                    <FormGroup>
                        <Label for="Sekolah">Nama Sekolah/Perguruan tinggi</Label>
                        <Input type='text' name='sekolah' id='sekolah' defaultValue={this.state.sekolah.namaSekolah} disabled/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="Sekolah">Kelas/Semester</Label>
                        <Input type='text' name='kelas' id='kelas' defaultValue={this.state.kelas} disabled/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="Sekolah">Jurusan</Label>
                        <Input type='text' name='sekolah' id='sekolah' defaultValue='TKJ' disabled/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="Sekolah">Target Galangan Dana</Label>
                        <Input ref='nominal' type='number' name='nominal' id='nominal' onChange={(e)=>this.setState({nominal: e.target.value})}/>
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            id="bulan"
                            multiple
                            select
                            label="Durasi galangan dana"
                            className={textField, formControl}
                            value={this.state.bulan}
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
                        
                    </FormGroup>
                    <FormGroup>
                        <Label for="Sekolah">Description</Label>
                        {/* <Input type='textarea' name='description' id='description'/>
                     */}
                     <CKEditor
                        editor={ ClassicEditor }
                        data=""
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
                    
                    </FormGroup>
                    <FormGroup>
                        <Label for="Sekolah">Pesan ajakan</Label>
                        <Input type='textarea' name='shareDescription' id='shareDescription' onChange={(text)=> this.sDeskripsi(text.target.value)} maxLength='240'/>
                        <p style={{fontStyle:'italic'}}>{this.state.sDeskripsi.length} / 240</p>
                    </FormGroup>
                    <Button color='success' onClick={this.handleSubmitBtn}>Submit</Button>
                </Form>
            </div>
        )
    }
    sDeskripsi = (text) => {
        this.setState({sDeskripsi: text})
       
    }

    handleSubmitBtn = () => {
        let data = {
            judul : this.state.judul,
            studentId : this.state.siswa,
            schoolId : this.state.sekolah.id,
            userId : this.props.userId,
            nominal : this.state.nominal,
            durasi : this.state.bulan,
            description : this.state.deskripsi,
            shareDescription : this.state.sDeskripsi
        }
        console.log(data)
        Axios.post(URL_API + '/scholarship/addScholarship', data)
        .then((res) => {
            console.log(res.data)
            this.setState({success: true})
        }).catch((err)=>{
            console.log(err)
        })
    }
    render(){
        // console.log(this.state.detailSiswa.namaSekolah)
        // console.log(this.state.sDeskripsi)
        if(!this.state.datasiswa){
            return <h2>Loading</h2>
        }
        if(!this.state.existSiswa){
            return <h2>Loading</h2>
        }
        if(this.state.success){
            return <Redirect to='/scholarshipList'/>
        }
        return(
            <div className='container mt-5 mb-5'>
                <h2>Galang Dana Beasiswa Biasa Sekolah</h2>
                {this.renderFormAddScholarship()}
            </div>
        )
    }
}

const mapStatetoProps = ({auth}) =>{
    return{
        userId : auth.id
    }
}
export default connect(mapStatetoProps,{}) (ScholarshipAdd);