import React, { Component} from 'react'
import {  Input, Form, FormGroup, Label, FormText, Button, CustomInput, InputGroup, InputGroupAddon } from 'reactstrap'
import Axios from 'axios'
import { Redirect } from 'react-router-dom'
import {URL_API, GETTOKENURL, APIWILAYAHURL} from '../../helpers/Url_API'
// import { TextField, MenuItem, makeStyles  } from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab'
import LoadingOverlay from 'react-loading-overlay'

// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import {ImageDrop} from 'quill-image-drop-module'zz

import ReactQuill, {Quill} from 'react-quill'
import ImageResize from 'quill-image-resize-module'
// import 'react-quill/dist/quill.snow.css'; // ES6
 
import { TextField, MenuItem, makeStyles, Modal, ModalBody, ModalHeader, ModalFooter,  } from '@material-ui/core'
import { connect } from 'react-redux'

// STEPPER
// import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
// import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
import { isDataValid } from '../../helpers/helpers'



Quill.register('modules/imageResize', ImageResize);

// import { Quill } from 'react-quill';





// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { EditorState } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


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
    root: {
        width: '90%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

class RegisterStudent extends Component{
    constructor(props) {
        super(props)
        this.state = { 
            nama : '',
            pendidikan : '',
            gender : '',
            status : '',
            tanggalLahir : '',
            provinsi : '',
            alamat : '',
            shareDescription : '',
            saudara : '',
            deskripsi : '',

            sekolah : '',
            alamatSekolah : '',
            telp : '', 
            kelas : '',
          
            scholarshipNominal : '',


            

            //StudentImage
            StudentImageName: 'Pilih Gambar ...',
            StudentImageFile: URL_API + '/defaultPhoto/defaultUser.png', 
            StudentImageDB: null,

            SchoolImageName: 'Pilih Gambar ...',
            SchoolImageFile: URL_API + '/defaultPhoto/defaultUser.png', 
            SchoolImageDB: null,

            StudentCardImageName: 'Pilih Gambar ...',
            StudentCardImageFile: URL_API + '/defaultPhoto/defaultUser.png', 
            StudentCardImageDB: null,

            FamilyCardImageName: 'Pilih Gambar ...',
            FamilyCardImageFile: URL_API + '/defaultPhoto/defaultUser.png', 
            FamilyCardImageDB: null,

            IncomeCardImageName: 'Pilih Gambar ...',
            IncomeCardImageFile: URL_API + '/defaultPhoto/defaultUser.png', 
            IncomeCardImageDB: null,
            //

            listOfImages : [],
            province : [],

            account_name : '',
            rekening : '',
            cabangBank : '',
            listBank : [],
            bank : '',
            codeBank : '',


            steps : ['Masukkan Biodata Siswa', 'Lengkapi Data Sekolah', 'Lengkapi Data Tambahan'],
            activeStep : 0,
            completed : {
                0 : true
            },
            totalSteps : 3

           
            } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
        // this.addimagequillchange=this.addimagequillchange.bind(this)
    }

    // REACTQUILL 
    modules = {

        imageResize: {
            handleStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
                // other camelCase styles for size display
            },
            displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
                // other camelCase styles for size display
            }
        },
   
        toolbar : {
            container : [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline','strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link'],
                ['clean'],
                ['image']

            ],
            handlers : {
                'image' :  function () { 
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                        input.click();
                        input.onchange =  function() {
                          const file = input.files[0];
                          console.log('User trying to uplaod this:', file);
                          console.log(file)
                          var formData = new FormData()
                        formData.append('image',file)

                        let token = localStorage.getItem('token')

                        var options ={
                            headers : 
                            {
                                'Authorization': `Bearer ${token}`
                            }
                        }

                        Axios.post(URL_API + `/scholarship/GenerateURL`, formData, options)
                        .then((res) => {
                            console.log(res.data)
                            this.quill.insertEmbed(this.quill.getSelection().index, 'image', URL_API+res.data); 
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                        }.bind(this); 
                   
                                                      
                                    
                }
            }

        }
        
        // toolbar : [
        //     'image',
        //      this.handleChange = this.addimagequillchange
        // ]
       
  
    }

    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]


    // REACTQUILL


    componentDidMount = () => {

        this.getProvinsiList()
        this.getBeneficiaryBank()
    }

    handleChangeBank = (value) => {
        // console.log(value.name)
        this.setState({bank: value.name, codeBank: value.code})

    }

    getBeneficiaryBank = () =>{
        Axios.get(URL_API+'/payment/beneficiary_banks')
        .then((res)=>{
            // console.log(res.data)
            this.setState({listBank: res.data.beneficiary_banks})
        }).catch((err)=>{
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
   

    printDataProvinsi = () => {
        if(this.state.province.length === 0 ){
          return (
            <option value="" disabled selected hidden>Loading...</option>
          )
        }else{
          var list = this.state.province.map((val, id)=>{
            return (
                <option key={id} value={val.name}> {val.name} </option>
            )
        })

        
        return list 
        }
        
    }

    getProvinsiList = () =>{
        Axios.get(GETTOKENURL)
        .then((res)=>{
          var token = res.data.token
          token = token + '/m/wilayah/provinsi'
          Axios.get(APIWILAYAHURL+token)
          .then((res)=>{
              console.log(res.data)
            this.setState({
              province : res.data.data
            })
          })
          .catch((err)=>{
            console.log(err)
          })
        })
        .catch((err)=>{
          console.log(err)
        })
      
    }

    addUserImageChange = (e, type) => {
        const ImageName = type + 'ImageName'
        const ImageFile = type + 'ImageFile'
        const ImageDB = type + 'ImageDB'

        if(e.target.files[0]) {
 
            this.setState({ 
                [ImageName]: e.target.files[0].name,
                [ImageFile]: URL.createObjectURL(e.target.files[0]), 
                [ImageDB]: e.target.files[0]
            })
        } else {
            this.setState({ 
                [ImageName]: 'Pilih Gambar ', 
                [ImageFile]: URL_API + '/defaultPhoto/defaultUser.png' ,
                [ImageDB]: undefined
            })
        }
    }

    formatDisplay (num) {
        let number = parseInt(num.split(',').join('')) 

        if (num.split(',').join('') === '' ) {
            this.setState({scholarshipNominalDisplay: '0', scholarshipNominal: 0})
        } else {
            this.setState({
                scholarshipNominalDisplay: number.toLocaleString(),
                scholarshipNominal: number
            })
        }
    }

    
    allowPositivesOnly(event) {
        return (event.keyCode? (parseInt(event.keyCode) === 69 ? false : event.keyCode >= 48 && event.keyCode <= 57) : (event.charCode >= 48 && event.charCode <= 57))? true : event.preventDefault();
    }

    
      
    getStepContent(step) {
        const {textField, menu, formControl} = useStyles
        switch (step) {
          case 0:
            return [ 
                <Form>
            <FormGroup>
                <Label for="nama">Nama Murid</Label>
                <Input ref='nama' type="text" name='nama' id='nama' placeholder='Masukkan nama murid' onChange={(e)=>this.setState({nama: e.target.value})} value={this.state.nama}/>
            </FormGroup>
            <div className="row">
                <div className="col-md-6">
                    <FormGroup>
                        <Label>Pendidikan Terakhir</Label>
                        <select className='form-control' ref='pendidikan' onChange={(e)=>this.setState({ pendidikan : e.target.value})} value={this.state.pendidikan}>
                            <option value='' className="text-muted">Pilih Pendidikan</option>
                            <option value='TK'>TK</option>
                            <option value='SD'>SD</option>
                            <option value='SMP'>SMP</option>
                            <option value='SMA'>SMA</option>
                            <option value='SMK'>SMK</option>
                            <option value='S1'>S1</option>
                        </select>
                    </FormGroup>
                </div>
                <div className="col-md-6">
                    <FormGroup>
                        <Label>Gender</Label>
                        <select className='form-control' ref='gender' onChange={(e)=>this.setState({ gender : e.target.value})} value={this.state.gender}>
                            <option value='' className="text-muted">Pilih gender</option>
                            <option value='Pria'>Pria</option>
                            <option value='Wanita'>Wanita</option>
                        </select>
                    </FormGroup>
                </div>
            </div>
  
         
            <FormGroup>
                <Label>Status</Label>
                <select className='form-control' ref='status' onChange={(e)=>this.setState({ status : e.target.value})} value={this.state.status}>
                    <option value='' className="text-muted">Pilih Status</option>
                    <option value='Normal'>Normal</option>
                    <option value='Piatu'>Piatu</option>
                    <option value='Yatim'>Yatim</option>
                    <option value='YatimPiatu'>Yatim Piatu</option>
                </select>
            </FormGroup>
            <FormGroup>
                <Label>Tanggal Lahir</Label>
                <Input ref='date' type='date' name='date' id='date' onChange={(e)=>this.setState({tanggalLahir: e.target.value})} value={this.state.tanggalLahir}/>
            </FormGroup>
            <FormGroup>
                <Label>Provinsi</Label>
                <select className='form-control' ref='provinsi' onChange={(e)=>this.setState({ provinsi : e.target.value})} value={this.state.provinsi}>
                    <option value='' className="text-muted" >Pilih Provinsi </option>
                    {this.printDataProvinsi()}
                </select>
            </FormGroup>
            <FormGroup>
                <Label>Alamat</Label>
                <Input ref='alamat' type='textarea' name='alamat' id='alamat' placeholder="tulis alamat anda" onChange={(e)=>this.setState({alamat: e.target.value})} value={this.state.nominal}/>
            </FormGroup>
            <FormGroup>
                <div className="d-flex flex-column">
                    <Label>
                        Cerita Singkat Siswa
                    </Label>
                    <ReactQuill value={this.state.deskripsi}
                        modules={this.modules}
                        formats={this.formats}
                        onChange={this.handleChange} 
                    />
                </div>
               
            </FormGroup>
            <FormGroup>
                <div className="d-flex flex-column">
                    <Label>Foto Siswa</Label>
                    <img src={`${this.state.StudentImageFile}`} alt="user-default" className='userImage my-3' />
                    <CustomInput id='up_i_u' type='file' label={this.state.StudentImageName} onChange={(e)=>this.addUserImageChange(e, 'Student')} />
                {/* <Label>Foto Siswa</Label>
                <Input ref='alamat' type='file' name='siswaimg' id='siswaimg' onChange={(e)=>this.setState({alamat: e.target.value})} value={this.state.nominal}/> */}
                </div>
        
            </FormGroup>
            


            </Form>]
          case 1:
            return [
                <Form>
                    <FormGroup>
                        <Label for="sekolah">Nama Sekolah</Label>
                        <Input ref='sekolah' type="text" name='sekolah' id='sekolah' placeholder='Masukkan nama sekolah' onChange={(e)=>this.setState({sekolah: e.target.value})} value={this.state.sekolah}/>
                    </FormGroup>    
                    
                    <FormGroup>
                        <Label>Alamat Sekolah</Label>
                        <Input ref='alamatsekolah' type='textarea' name='alamatsekolah' id='alamatsekolah' onChange={(e)=>this.setState({alamatSekolah: e.target.value})} value={this.state.alamatSekolah}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="telp">Telepon Sekolah</Label>
                        <Input ref='telp' type="number" name='telp' id='telp' placeholder='Masukkan nomor telepon sekolah' onChange={(e)=>this.setState({telp: e.target.value})} value={this.state.telp}/>
                    </FormGroup>   
                    <FormGroup>
                        <Label for="kelas">Kelas Siswa Sekarang</Label>
                        <Input ref='kelas' type="text" name='kelas' id='kelas' placeholder='Masukkan kelas siswa sekarang' onChange={(e)=>this.setState({kelas: e.target.value})} value={this.state.kelas}/>
                    </FormGroup> 
                    {/* <FormGroup>
                        <Label for="bank">Nama Bank Sekolah</Label>
                        <Input ref='bank' type="text" name='bank' id='bank' placeholder='Masukkan nama bank sekolah' onChange={(e)=>this.setState({bank: e.target.value})} value={this.state.bank}/>
                    </FormGroup>     */}
                    <FormGroup>
                        <Label for="rekening">Data Bank Sekolah</Label>
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
                        <Input className='mb-2' type='number' ref='noRek' innerRef='inoRek' placeholder='No Rekening Sekolah' id='norek' onBlur={this.validateAccount} onChange={(e)=>this.setState({rekening: e.target.value})} value={this.state.rekening}/>
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
                        <Input ref='cabangBank' type="text" name='cabangBank' id='cabangBank' placeholder='Masukkan nama cabang bank' onChange={(e)=>this.setState({cabangBank: e.target.value})} value={this.state.cabangBank}/>
                        {/* <Input ref='rekening' type="text" name='rekening' id='rekening' placeholder='Masukkan no rekening sekolah' onChange={(e)=>this.setState({rekening: e.target.value})}  */}
                    </FormGroup> 
                  
                    <FormGroup>
                            <Label for="scholarshipNominal">Biaya Sekolah</Label>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                <Button className="bg-white text-dark border-right-0"   disabled style={{borderColor : '#CED4DA' , border : '1px solid #CED4DA', opacity: 1}}>Rp. </Button>
                                </InputGroupAddon>
                                <Input style={{border : '1px 1px 1px 0 solid #CED4DA'}}  innerRef='nominalBebas' ref='nominalBebas' onChange={(text)=>this.formatDisplay(text.target.value)} onKeyPress={this.allowPositivesOnly} value={this.state.scholarshipNominalDisplay}/>
                            </InputGroup>
                        
                        {/* <Input ref='scholarshipNominal' type="number" name='scholarshipNominal' id='scholarshipNominal' placeholder='Masukkan biaya sekolah per bulan' onChange={(e)=>this.setState({scholarshipNominal: e.target.value})} value={this.state.scholarshipNominal}/> */}
                    </FormGroup>    
                    {/* <FormGroup>
                      
                    </FormGroup> */}
                    <FormGroup>
                        <div className="d-flex flex-column">
                            <Label>Masukkan Raport Terakhir Siswa</Label>
                            <img src={`${this.state.SchoolImageFile}`} alt="user-default" className='userImage my-3' />
                            <CustomInput  type='file' label={this.state.SchoolImageName} onChange={(e)=>this.addUserImageChange(e, 'School')} />
                                {/* <Label>Foto Siswa</Label>
                                <Input ref='alamat' type='file' name='siswaimg' id='siswaimg' onChange={(e)=>this.setState({alamat: e.target.value})} value={this.state.nominal}/> */}
                        </div>
                       
                    </FormGroup>
                   

                </Form>
            ];
          case 2:
            return [
                <Form>
                      <FormGroup>
                          <div className="d-flex flex-column">
                                <h3>Upload Kartu Siswa</h3>
                                <img src={`${this.state.StudentCardImageFile}`} alt="user-default" className='userImage my-3' />
                                <CustomInput  type='file' label={this.state.StudentCardImageName} onChange={(e)=>this.addUserImageChange(e, 'StudentCard')} />
                                {/* <Label>Foto Siswa</Label>
                                <Input ref='alamat' type='file' name='siswaimg' id='siswaimg' onChange={(e)=>this.setState({alamat: e.target.value})} value={this.state.nominal}/> */}
                          </div>
                        
                      </FormGroup>
                      <FormGroup>
                            <div className="d-flex flex-column">
                                <h3>Upload Kartu Keluarga</h3>
                                <img src={`${this.state.FamilyCardImageFile}`} alt="user-default" className='userImage my-3' />
                                <CustomInput  type='file' label={this.state.FamilyCardImageName} onChange={(e)=>this.addUserImageChange(e, 'FamilyCard')} />
                                {/* <h3>Foto Siswa</h3>
                                <Input ref='alamat' type='file' name='siswaimg' id='siswaimg' onChange={(e)=>this.setState({alamat: e.target.value})} value={this.state.nominal}/> */}
                            </div>
                        
                      </FormGroup>
                      <FormGroup>
                            <div className="d-flex flex-column">
                                <h3>Upload Slip Penghasilan</h3>
                                <img src={`${this.state.IncomeCardImageFile}`} alt="user-default" className='userImage my-3' />
                                <CustomInput  type='file' label={this.state.IncomeCardImageName} onChange={(e)=>this.addUserImageChange(e, 'IncomeCard')} />
                                {/* <h2>Foto Siswa</h2>
                                <Input ref='alamat' type='file' name='siswaimg' id='siswaimg' onChange={(e)=>this.setState({alamat: e.target.value})} value={this.state.nominal}/> */}
                            </div>
                      </FormGroup>
                      <FormGroup>
                            <Label for="saudara">Jumlah Saudara Kandung</Label>
                            <Input ref='saudara' type="number" name='saudara' id='saudara' placeholder='Masukkan nomor telepon sekolah' onChange={(e)=>this.setState({saudara: e.target.value})} value={this.state.saudara}/>
                      </FormGroup>

                      <FormGroup>
                            <Label for="shareDescription">Deskripsi Singkat (Tagline)</Label>
                            <Input ref='shareDescription' type="textarea" name='shareDescription' id='shareDescription' placeholder='Masukkan nomor telepon sekolah' onChange={(e)=>this.setState({shareDescription: e.target.value})} value={this.state.shareDescription}/>
                      </FormGroup>
                      <input type="button" onClick={()=>{
                          window.alert('success');
                          console.log(this.state)
                      }}  className="btn btn-success" value="submit"/>
                </Form>
            ];
            
          default:
            return 'Unknown step';
        }
      }

       totalSteps = () => {
        return this.state.steps.length;
      };
    
       completedSteps = () => {
        return Object.keys(this.state.completed).length;
      };
    
       isLastStep = () => {
        return this.state.activeStep === this.totalSteps() - 1;
      };

      allStepsCompleted = () => {
        return this.completedSteps() === this.totalSteps();
      };

      handleNext = () => {

        //1 judul,siswa,sekolah,kelas
        //2

        const newActiveStep =
          this.isLastStep() && !this.allStepsCompleted()
            ? // It's the last step, but not all steps have been completed,
              // find the first step that has been completed
              this.state.steps.findIndex((step, i) => !(i in this.state.completed))
            : this.state.activeStep + 1;
        this.setState({
            activeStep : newActiveStep
        });
      };

    handleBack = () => {
        // this.setState({
        //     activeStep : newActiveStep
        // });
        console.log('hendelbekc')
        this.setState((prevState) => ({
            activeStep: prevState.activeStep -1
        }));
        // setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    handleStep = (step) => {
        console.log(step)
        let checkStep = this.state.completed
        if(checkStep[step] || checkStep[step-1]){
            this.setState({
                activeStep : step
            })
        }else {
            return window.alert('Mohon Cek Form terlebih Dahulu')
        }
    };

    validateData = (index) =>{
     

        switch (index) {

            case 0:
                const { nama, pendidikan, gender, status, tanggalLahir, provinsi, alamat, StudentImageName } = this.state
                if(isDataValid({nama, pendidikan, gender, status, tanggalLahir, provinsi, alamat, StudentImageName})){
                    // var form = 
                    // let formjson = JSON.stringify({
                    //     judul,
                    //     siswa,
                    //     sekolah : sekolah.namaSekolah,
                    //     kelas
                    // })

                    // localStorage.setItem('form1' , formjson)
                    return true
                }
                return  false
            case 1:
                const { sekolah, alamatSekolah, telp, kelas, codeBank, bank, cabangBank, account_name, rekening, scholarshipNominal, SchoolImageName } = this.state
                if(isDataValid({sekolah, alamatSekolah, telp, kelas, codeBank, bank, cabangBank, account_name, rekening, scholarshipNominal, SchoolImageName})){
                    // let form = 
                    // let formjson = JSON.stringify({
                    //     nominal,
                    //     bulan,
                    //     deskripsi
                    // })

                    // localStorage.setItem('form2' , formjson)
                    return true
                }
                return false
            case 2:
                const {StudentCardImageName, FamilyCardImageName, IncomeCardImageName, saudara, shareDescription} = this.state
                if(isDataValid({StudentCardImageName, FamilyCardImageName, IncomeCardImageName, saudara, shareDescription})){
                    // let formjson = JSON.stringify({
                    //     sDeskripsi
                    // })
                    // localStorage.setItem('form3' , formjson)
                    return true
                }
                return false
            default:
              return false
        
        }
    }

    handleComplete = () => {
        const currentSteps = this.state.activeStep
        if(!this.validateData(currentSteps)){
            console.log('validdata false')
            return window.alert("Mohon Lengkapi Data Terlebih Dahulu")
        }
        
        window.scrollTo(0,0)



        const newCompleted = this.state.completed;
        newCompleted[this.state.activeStep] = true;

        this.setState({
            completed : newCompleted
        })


        // setCompleted(newCompleted);
        this.handleNext();
    };
    
    handleReset = () => {
        this.setState({
            activeStep : 0,
            completed : {}
        })
        // setActiveStep(0);
        // setCompleted({});
    };

    // onContentStateChange = (contentState) => {
    //     this.setState({contentState})
    //     console.log(contentState)

    // }

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
        // document.getElementById('satu').innerHTML=`<MenuItem key =1 value=1>1 Bulan</MenuItem>`
        document.getElementById('satu').innerHTML='coba'
        // return result
    }

    handleChangesiswa = name => event => {
        // console.log(event.target.value)
        this.setState({siswa: event.target.value})
        
        var id = event.target.value
        let exist = this.state.existSiswa
        let ada = false
        // exist.map((val) => {
        //     if(val.studentId === id){
        //         ada = true
             
               
        //     }
        // })

        for(let y = 0 ; y < exist.length ; y++) {
            if(exist[y].studentId === id ){
                ada = true
                break;
            }
        }
        if(ada){
            this.setState({
                siswa : ''
            })
            return window.alert('Penggalangan dana beasiswa untuk siswa ini sudah dibuat, silahkan pilih siswa lain')
        }
        console.log(id)
        if(!ada){
            console.log('masuk if ')
            Axios.get(URL_API + '/studentdetail/get-student-detail/'+ id)
            .then((res) => {
                console.log(res.data)
                this.setState({kelas: res.data[0].StudentDetails[0].class, sekolah: res.data[0].School })
            })
            .catch((err)=> {    
                console.log(err)
            })
        }
    };
    
    handleChangeBulan = name => event => {
        this.setState({ bulan: event.target.value})
    }

    
    handleChange(value) {
        if(this.state.listOfImages.length === 0 ){
            if(value.includes('img src=')){
                console.log('NEW image true')
                // let newImage = `img src=${value.split('img src=')[1].split('>')[0]}>`
                let newImage = value.split('img src="')[1].split('"')[0]
                let array = this.state.listOfImages
                array.push(newImage)
                this.setState({
                    listOfImages : array,
                    deskripsi : value
                })
            }else { 
                this.setState({
                    deskripsi:value
                })
            }
        }else {
            console.log(value)
            // var check = false
            var removeIndex = []
            var array = this.state.listOfImages
            var filtertext = value

            this.state.listOfImages.forEach( async (element,i)  => {
                if(!value.includes(element)){
                    console.log(`gambar dengan ${element} hilang!!!`)
                    this.deleteFile(element)
                    removeIndex.push(i)
                    var regeximg = new RegExp(`img src="${element}"`,"g");
                    filtertext = filtertext.replace(regeximg, '')
                }else {
                  var regeximg = new RegExp(`img src="${element}"`,"g");
                  filtertext = filtertext.replace(regeximg, '')
                }
            });
            if(removeIndex.length !== 0) {
                for(var y = removeIndex.length -1; y >= 0; y--){
                    array.splice(removeIndex[y], 1)
                }
                if(filtertext.includes('img src="')){
                    console.log('NEW image true')
                    // let newImage = `img src=${value.split('img src=')[1].split('>')[0]}>`
                    let newImage = value.split('img src="')[1].split('"')[0]
                    let array = this.state.listOfImages
                    array.push(newImage)
                }
            }else {
                if(filtertext.includes('img src="')){
                    console.log('NEW image true')
                    let newImage = filtertext.split('img src="')[1].split('"')[0]
                    let array = this.state.listOfImages
                    array.push(newImage)
                }
            }
             this.setState({
                listOfImages : array,
                deskripsi : value
            })
        }
     }

     async deleteFile (filepath) {
        console.log('delete file function')
        filepath = filepath.replace('http://localhost:2019', '')
        console.log(filepath)
        try {
            var res = await Axios.post(URL_API + '/project/deleteFileQuill', { filepath : filepath})
            console.log(res.data.message)
        }catch(err){
            console.log(err)
        }
    }

    sDeskripsi = (text) => {
        this.setState({sDeskripsi: text})
       
    }

    handleSubmitBtn = () => {
        if(Object.keys(this.state.completed).length !== 3){
            return window.alert('Mohon Lengkapi Seluruh Form')
        }
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

        let token = localStorage.getItem('token')
        var options = {
            headers: {
                'Authorization': `Bearer ${token}`
            } 
        }

        Axios.post(URL_API + '/scholarship/addScholarship', data, options)
        .then((res) => {
            console.log(res.data)
            this.setState({success: true, loadingButton: false})
        }).catch((err)=>{
            console.log(err)
        })
    }
    render(){
        // console.log(completed)
        // console.log(this.state.completed)
        // console.log(this.state.detailSiswa.namaSekolah)
        // console.log(this.state.sDeskripsi)
        // if(!this.state.datasiswa){
        //     return <h2>Loading</h2>
        // }
        // if(!this.state.existSiswa){
        //     return <h2>Loading</h2>
        // }
        // if(this.state.success){
        //     return <Redirect to='/scholarshipList'/>
        // }
        const {activeStep, steps, completed} = this.state
        return(
    
            <div className='container mt-5 mb-5'>
                <Stepper nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => (
                    <Step key={label}>
                        {/* <StepButton onClick={this.handleComplete} completed={completed[index]}>
                        {label}
                        </StepButton> */}
                        <StepButton onClick={()=>this.handleStep(index)} completed={completed[index]}>
                        {label}
                        </StepButton>
                    </Step>
                    ))}
                </Stepper>
                {/* <h3 id='satu'>{this.renderBulan()}</h3> */}
                <h2 className="mt-5">Pendaftaran Murid Untuk Beasiswa</h2>
                <div>
            {this.allStepsCompleted() ? (
                <div className="mt-5">
                    <div>
                    All steps completed - you&apos;re finished
                    </div>
                    <Button onClick={()=>this.handleReset}>Reset</Button>
                </div>
                ) : (
                <div className="mt-5">
                    <div className="mb-5">
                        {/* <Form> */}
                            {this.getStepContent(activeStep)}
                        {/* </Form> */}
                    </div>
                    <div>
                    <Button disabled={activeStep === 0} onClick={()=>this.handleBack()} color="danger" >
                        Back
                    </Button>
                    {this.state.activeStep === 2
                    ?
                    
                        console.log('asjdaisjd')
                    :
             
                        <Button
                      
                        variant="contained"
                        color="primary"
                        onClick={this.handleComplete}
                        className="mx-5"
                        // className={classes.button}
                        
                        >
                            Next
                        </Button>
                    }
                {/* <Button
                variant="contained"
                color="primary"
                onClick={this.handleComplete}
                className="mx-5"
                // className={classes.button}
                
            >
                Next
            </Button> */}
           
                  
                    {/* {activeStep !== steps.length &&
                        (completed[activeStep] ? (
                        <div>
                            Step {activeStep + 1} already completed
                        </div>
                        ) : (
                        <Button variant="contained" color="primary" onClick={this.handleComplete}>
                            {this.completedSteps() === this.totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                        </Button>
                        ))} */}
                    </div>
                </div>
                )}
            </div>
                {/* {this.renderFormAddScholarship()} */}
              
            </div>
        )
    }
}

const mapStatetoProps = ({auth}) =>{
    return{
        userId : auth.id
    }
}
export default connect(mapStatetoProps,{}) (RegisterStudent);