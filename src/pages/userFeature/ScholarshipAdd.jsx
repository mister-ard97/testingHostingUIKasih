import React, { Component} from 'react'
import {  Input, Form, FormGroup, Label, FormText, Button, CustomInput } from 'reactstrap'
import Axios from 'axios'
import { Redirect } from 'react-router-dom'
import {URL_API} from '../../helpers/Url_API'
// import { TextField, MenuItem, makeStyles  } from '@material-ui/core'

// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import {ImageDrop} from 'quill-image-drop-module'

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
import Typography from '@material-ui/core/Typography';
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

class ScholarshipAdd extends Component{
    constructor(props) {
        super(props)
        this.state = { 
            datasiswa : '',
            siswa: '',
            sekolah: '',
            kelas:'',
            bulan:'',
            deskripsi:'',
            sDeskripsi:'',
            nominal: 0,
            judul:'',
            success: false,
            listOfImages : [],


            steps : ['Masukkan Data Siswa', 'Masukkan Data Beasiswa', 'Selesai'],
            activeStep : 0,
            completed : {},
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
        // toolbar: [
        //   [{ 'header': [1, 2, false] }],
        //   ['bold', 'italic', 'underline','strike', 'blockquote'],
        //   [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        //   ['link'],
        //   ['clean'],
        
        // ],
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
        // const token = localStorage.getItem('token');
        // const options = {
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //     }
        // } 


        //--------------------------------------------------------------------------------------------
        // KLIK MANUAL JUGA DI STEPPER
        // if(localStorage.getItem('form1')){
        //     console.log(JSON.parse(localStorage.getItem('form1')))
        //     if(isDataValid(JSON.parse(localStorage.getItem('form1')))){
        //         const { judul, siswa, sekolah, kelas } = JSON.parse(localStorage.getItem('form1'))
        //         this.setState({
        //             judul,
        //             siswa,
        //             sekolah : sekolah,
        //             kelas,
        //             activeStep : 1,
        //             completed : {
        //                 0 : true
        //             }
        //         })
        //     }
        // }
        // if(localStorage.getItem('form2')){
        //     console.log(JSON.parse(localStorage.getItem('form2')))
        // }
        // if(localStorage.getItem('form3')){
        //     console.log(JSON.parse(localStorage.getItem('form3')))
        // }

        const token = localStorage.getItem('token');

        var options ={
            headers : 
            {
                'Authorization': `Bearer ${token}`
            }
        }
    
        Axios.get( URL_API+'/student/getstudentperuser?id=' + this.props.userId, options)
        .then((res) => {
            console.log(res.data)
            this.setState({datasiswa: res.data})
        })
        .catch((err) => {
            console.log(err)
        })

        Axios.get(URL_API+'/scholarship/getExistStudent?id='+this.props.userId, options)
        .then((res) => {
            console.log(res.data)
            this.setState({
                existSiswa: res.data
            })
        }).catch((err)=>{
            console.log(err)
        })
    }


    // getSteps() {
    //     return 
    //   }
      
    getStepContent(step) {
        const {textField, menu, formControl} = useStyles
        switch (step) {
          case 0:
            return [ 
                <Form>
            <FormGroup>
                <Label for="judul">Judul Galangan Dana</Label>
                <Input ref='judul' type="text" name='judul' id='judul' placeholder='Ringankan biaya sekolah agus' onChange={(e)=>this.setState({judul: e.target.value})} value={this.state.judul}/>
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
            </Form>]
          case 1:
            return [<Form>
                <FormGroup>
                        <Label for="Sekolah">Target Galangan Dana</Label>
                        <Input ref='nominal' type='number' name='nominal' id='nominal' onChange={(e)=>this.setState({nominal: e.target.value})} value={this.state.nominal}/>
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
                       
                        <ReactQuill value={this.state.deskripsi}
                            modules={this.modules}
                            formats={this.formats}
                            onChange={this.handleChange} 
                        />
               
                    
                    </FormGroup>
            </Form>];
          case 2:
            return [<Form>
                   <FormGroup>
                        <Label for="Sekolah">Pesan ajakan</Label>
                        <Input type='textarea' name='shareDescription' id='shareDescription' onChange={(text)=> this.sDeskripsi(text.target.value)} maxLength='240' value={this.state.sDeskripsi}/>
                        <p style={{fontStyle:'italic'}}>{this.state.sDeskripsi.length} / 240</p>
                    </FormGroup>
                    <Button color='success' onClick={this.handleSubmitBtn}>Submit</Button>
            </Form>];
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
                const { judul, siswa, sekolah, kelas } = this.state
                if(isDataValid({judul,siswa, sekolah : sekolah.namaSekolah, kelas})){
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
                const { nominal, bulan, deskripsi } = this.state
                if(isDataValid({nominal, bulan, deskripsi})){
                    // let form = 
                    // let formjson = JSON.stringify({
                    //     nominal,
                    //     bulan,
                    //     deskripsi
                    // })

                    // localStorage.setItem('form2' , formjson)
                    return true
                }
                return isDataValid({nominal, bulan, deskripsi}) 
            case 2:
                const {sDeskripsi} = this.state
                if(isDataValid({sDeskripsi})){
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



    // renderFormAddScholarship = () => {
    //     const {textField, menu, formControl} = useStyles
    //     var bulan = 12
    //     return(
    //         <div>
       
    //             <Form>
    //                 <FormGroup>
    //                     <Label for="judul">Judul Galangan Dana</Label>
    //                     <Input ref='judul' type="text" name='judul' id='judul' placeholder='Ringankan biaya sekolah agus' onChange={(e)=>this.setState({judul: e.target.value})}/>
    //                 </FormGroup>
    //                 <FormGroup>
    //                     <TextField
    //                         id="siswa"
    //                         multiple
    //                         select
    //                         label="Pilih Nama Siswa "
    //                         className={textField, formControl}
    //                         value={this.state.siswa}
    //                         onChange={this.handleChangesiswa()}
    //                         SelectProps={{
    //                             MenuProps: {
    //                                 className: menu,
    //                             },
    //                         }}
    //                         margin="normal"
    //                         fullWidth
    //                     >
    //                         {/* Render dropwodn menu */}
    //                         {this.renderSiswa()} 
    //                     </TextField>
    //                 </FormGroup>
    //                 <FormGroup>
    //                     <Label for="Sekolah">Nama Sekolah/Perguruan tinggi</Label>
    //                     <Input type='text' name='sekolah' id='sekolah' defaultValue={this.state.sekolah.namaSekolah} disabled/>
    //                 </FormGroup>
    //                 <FormGroup>
    //                     <Label for="Sekolah">Kelas/Semester</Label>
    //                     <Input type='text' name='kelas' id='kelas' defaultValue={this.state.kelas} disabled/>
    //                 </FormGroup>
    //                 {/* <FormGroup>
    //                     <Label for="Sekolah">Jurusan</Label>
    //                     <Input type='text' name='sekolah' id='sekolah' defaultValue='TKJ' disabled/>
    //                 </FormGroup> */}
    //                 <FormGroup>
    //                     <Label for="Sekolah">Target Galangan Dana</Label>
    //                     <Input ref='nominal' type='number' name='nominal' id='nominal' onChange={(e)=>this.setState({nominal: e.target.value})}/>
    //                 </FormGroup>
    //                 <FormGroup>
    //                     <TextField
    //                         id="bulan"
    //                         multiple
    //                         select
    //                         label="Durasi galangan dana"
    //                         className={textField, formControl}
    //                         value={this.state.bulan}
    //                         onChange={this.handleChangeBulan()}
    //                         SelectProps={{
    //                             MenuProps: {
    //                                 className: menu,
    //                             },
    //                         }}
    //                         margin="normal"
    //                         fullWidth
    //                     >
    //                         {/* Render dropwodn menu */}
    //                         <MenuItem key={1} value={1}> 1 Bulan </MenuItem>
    //                         <MenuItem key={2} value={2}> 2 Bulan </MenuItem>
    //                         <MenuItem key={3} value={3}> 3 Bulan </MenuItem>
    //                         <MenuItem key={4} value={4}> 4 Bulan </MenuItem>
    //                         <MenuItem key={5} value={5}> 5 Bulan </MenuItem>
    //                         <MenuItem key={6} value={6}> 6 Bulan </MenuItem>
    //                         <MenuItem key={7} value={7}> 7 Bulan </MenuItem>
    //                         <MenuItem key={8} value={8}> 8 Bulan </MenuItem>
    //                         <MenuItem key={9} value={9}> 9 Bulan </MenuItem>
    //                         <MenuItem key={10} value={10}> 10 Bulan </MenuItem>
    //                         <MenuItem key={11} value={11}> 11 Bulan </MenuItem>
    //                         <MenuItem key={12} value={12}> 12 Bulan </MenuItem>
    //                     </TextField>
    //                 </FormGroup>
    //                 <FormGroup>
    //                     <Label for="Sekolah">Description</Label>
                       
    //                     <ReactQuill value={this.state.deskripsi}
    //                         modules={this.modules}
    //                         formats={this.formats}
    //                         onChange={this.handleChange} 
    //                     />
               
                    
    //                 </FormGroup>
                   
    //                 <FormGroup>
    //                     <Label for="Sekolah">Pesan ajakan</Label>
    //                     <Input type='textarea' name='shareDescription' id='shareDescription' onChange={(text)=> this.sDeskripsi(text.target.value)} maxLength='240'/>
    //                     <p style={{fontStyle:'italic'}}>{this.state.sDeskripsi.length} / 240</p>
    //                 </FormGroup>
    //                 <Button color='success' onClick={this.handleSubmitBtn}>Submit</Button>
    //             </Form>
    //         </div>
            
    //     )
    // }
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
        console.log(this.state.completed)
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
                <h2 className="mt-5">Galang Dana Beasiswa Biasa Sekolah</h2>
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
export default connect(mapStatetoProps,{}) (ScholarshipAdd);