import React, { Component} from 'react'
import {  Input, Form, FormGroup, Label, FormText, Button, CustomInput } from 'reactstrap'
import Axios from 'axios'
import {URL_API} from '../helpers/Url_API'
import { TextField, MenuItem, makeStyles  } from '@material-ui/core'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
        datasiswa : '',
        siswa: ''
    }
    componentDidMount = () => {
        let token = localStorage.getItem('token')
        var param = {
            params:{
                userId: 1
            }
        }
        Axios.get( URL_API+'/student/getstudentperuser?id=1' )
        .then((res) => {
            console.log(res.data)
            this.setState({datasiswa: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }
    onChangeSiswa = (name) => {
        console.log(this.refs.siswa.value)
    }
    renderSiswa = () =>{
        var data = this.state.datasiswa
        return data.map((val, i) =>{
            return (
                <MenuItem key={val.id} value={val.name}>{val.name}</MenuItem>
            )
        })
    }

    handleChangesiswa = name => event => {
        console.log(event.target.value)
        this.setState({siswa: event.target.value})
    // setValues({ ...values, [name]: event.target.value });
    };
    renderFormAddScholarship = () => {
        const {textField, menu, formControl} = useStyles
        var bulan = 12
        return(
            <div>
                <Form>
                    <FormGroup>
                        <Label for="judul">Judul Galangan Dana</Label>
                        <Input type="text" name='judul' id='judul' placeholder='Ringankan biaya sekolah agus'/>
                    </FormGroup>
                    <FormGroup>
                        {/* <Label for="namaSiswa">Pilih siswa</Label> */}
                        {/* <select name='siswa' id='siswa' multiple  ref='siswa' >
                            {this.state.datasiswa.map((val)=>{
                                return (
                                    <option value={val.name} name='siswa' >{val.name}</option>
                                )
                            })} */}
                        {/* </select> */}
                        <TextField
                            id="kelas"
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
                        <Input type='text' name='sekolah' id='sekolah' defaultValue='SMA satu dua' disabled/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="Sekolah">Kelas/Semester</Label>
                        <Input type='text' name='kelas' id='kelas' defaultValue='XI IPA' disabled/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="Sekolah">Jurusan</Label>
                        <Input type='text' name='sekolah' id='sekolah' defaultValue='TKJ' disabled/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="Sekolah">Targer Galangan Dana</Label>
                        <Input type='number' name='nominal' id='nominal'/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="namaSiswa">Durasi Galangan dana</Label>
                        <Input type='select' name='siswa' id='bulan'>
                            <option> 1 Bulan </option>
                            <option> 2 Bulan </option>
                            <option> 3 Bulan </option>
                            <option> 4 Bulan </option>
                            <option> 5 Bulan </option>
                            <option> 6 Bulan </option>
                            <option> 7 Bulan </option>
                            <option> 8 Bulan </option>
                            <option> 9 Bulan </option>
                            <option> 10 Bulan </option>
                            <option> 11 Bulan </option>
                            <option> 12 Bulan </option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="Sekolah">Description</Label>
                        {/* <Input type='textarea' name='description' id='description'/>
                     */}
                     <CKEditor
                        editor={ ClassicEditor }
                        data="<p>Hello from CKEditor 5!</p>"
                        onInit={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            console.log( { event, editor, data } );
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
                        <Label for="Sekolah">Targer Galangan Dana</Label>
                        <Input type='textarea' name='shareDescription' id='shareDescription'/>
                    </FormGroup>
                    <Button color='success'>Submit</Button>
                </Form>
            </div>
        )
    }

    renderBulan = () => {
        var bulan = 12
        var result = "<option>${i} bulan</option>"
        for(var i = 1 ; i<= bulan ; i++){
            // result += `<option>${i} bulan</option>`
            console.log(i)
        }
        console.log(result)
        return document.getElementById('bulan').innerHTML = "<option>masuk</option>"
    }
    render(){
        
        if(!this.state.datasiswa){
            return <h2>Loading</h2>
        }
        return(
            <div className='container mt-5 mb-5'>
                <h2>Galang Dana Beasiswa Biasa Sekolah</h2>
                {this.renderFormAddScholarship()}
            </div>
        )
    }
}

export default ScholarshipAdd;