import React from 'react'
import Axios from 'axios';
import { URL_API } from '../../helpers/Url_API';
import { Redirect } from 'react-router-dom';
// import ReactQuill, {Quill} from 'react-quill'
// import {ImageDrop} from 'quill-image-drop-module'
// import ImageResize from 'quill-image-resize-module'
 

// import { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ES6


import { CloudinaryContext } from 'cloudinary-react';
// import {Modal,ModalBody} from 'reactstrap'
import{  Progress } from 'reactstrap';
import { dateCheck, isDataValid } from '../../helpers/helpers';

// Quill.register('modules/imageResize', ImageResize);




// function insertStar() {
//     const cursorPosition = this.quill.getSelection().index
//     this.quill.insertText(cursorPosition, "♥");
//   this.quill.setSelection(cursorPosition + 1);
//   console.log('asdiasi')
//     // console.log(cursorPosition);
//   }
// const tombol = `button`

class postProject extends React.Component{
    constructor(props) {
        super(props)
        this.state = { 
            text: '',
            // filteredtext : '',
            imageFile : null,
            imagequill:null,
            modalopen:false ,
            uploadProgress : 0,
            redirectHome : false,
            listOfImages : []
           
            } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
        // this.addimagequillchange=this.addimagequillchange.bind(this)
    }
    modules = {
        // imageDrop: true,
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

                        Axios.post(URL_API + `/project/GenerateURL`, formData, options)
                        .then((res) => {
                        
                            console.log(res.data)

                            // const ImageBlot = Quill.import('formats/image');
                            // const Parchment = Quill.import('parchment');

                            // this.quill.root.addEventListener('click', (ev) => {
                            // let image = Parchment.find(ev.target);

                            // if (image instanceof ImageBlot) {
                            //     this.quill.setSelection(image.offset(this.quill.scroll), 1, 'user');
                            // }
                            // });
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

    

    previewFile = (event) => {
        var preview = document.getElementById('imgpreview')
        var file    = document.getElementById('imgprojectinput').files[0];
        // console.log(file.size)
        // var size = document.getElementById('myfile').files[0].size;

        var imgfile = event.target.files[0]

       
        var reader  = new FileReader();
        console.log(reader)
      
        reader.onloadend = function () {
          preview.src = reader.result;
        }
      
        if (file) {
          reader.readAsDataURL(file);
          this.setState({
              imageFile : imgfile
          })

        } else {
          preview.src = "";
          this.setState({
            imageFile : null
        })
        }
    }

    updateUploadProgress = (progress) =>{
        this.setState({
            uploadProgress : progress
        })
    }

    onSubmitClick = () =>{
   
        var formData = new FormData()
        let token = localStorage.getItem('token')
        var headers ={
            onUploadProgress: (progressEvent) => {
                const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                console.log("onUploadProgress", totalLength);
                if (totalLength !== null) {
                    this.updateUploadProgress(Math.round( (progressEvent.loaded * 100) / totalLength ));
                    console.log(Math.round( (progressEvent.loaded * 100) / totalLength ))
                }
            },
            headers : 
            {
                'Authorization': `Bearer ${token}`,
                'Content-Type' : 'multipart/form-data',
              
            },
        }

        var data = {
            name : this.refs.prname.value,
            description : this.state.text,
            totalTarget : this.refs.prtarget.value,
            projectCreated : this.refs.prdatestart.value,
            projectEnded : this.refs.prdateend.value,
            shareDescription: this.refs.shareDescription.value
        }
        console.log(isDataValid(data))
        if(!isDataValid(data)){
            return window.alert('Harap Untuk mengisi semua form')
        }

        if(dateCheck(this.refs.prdatestart.value , this.refs.prdateend.value)){
            return window.alert('Mohon di cek kembali tanggal project ')
        }

        


        
        
        formData.append('image', this.state.imageFile) 
        formData.append('data', JSON.stringify(data))

        console.log(data)

        Axios.post(URL_API+'/project/postproject', formData, headers)
        .then((res)=>{
            window.alert("insert success")
            this.setState({
                redirectHome : true
            })
        })
        .catch((err)=>{
            console.log(err.response)
            this.updateUploadProgress(0)
            window.alert(err.response.data.error)
        })
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

    handleChange (value) {
        if(this.state.listOfImages.length === 0 ){
            if(value.includes('img src=')){
                console.log('NEW image true')
                // let newImage = `img src=${value.split('img src=')[1].split('>')[0]}>`
                let newImage = value.split('img src="')[1].split('"')[0]
                let array = this.state.listOfImages
                array.push(newImage)
                this.setState({
                    listOfImages : array,
                    text : value
                })
            }else { 
                this.setState({
                    text:value
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
                text : value
            })
        }
    }

    

    render(){
        console.log(this.state.text)
        console.log(this.state.listOfImages)
        if(this.state.redirectHome){
            return <Redirect to="/"/>
        }
        return(
            // <CloudinaryContext
            // cloudName='purwadhika-startup-and-coding-school'
            // uploadPreset='enverdl'
            //  >
/* 
                <Image
                    publicId="https://cloudinary.com/images/logo.png"
                    fetch-format="auto"
                    quality="auto"
                /> */
            <div>
                <div className="editorxd row">
                    <div className="col-8 offset-2">
                        <h1 className="mb-4">GALANG DANA</h1>
                        <h5>Nama Project</h5>
                        <input type="text" ref='prname' className="form-control mb-5" placeholder="masukkan nama project"/>
                        {/* <button onClick={()=>this.setState({modalopen:true})} className="toolbar">add image</button> */}
                        {/* <ReactQuill value={this.state.text}
                                    modules={this.modules}
                                    formats={this.formats}
                                    onChange={this.handleChange} 
                                    className="mb-5"
                        />  */}
                        {/* <CKEditor
                            editor={ DokumenEditor }
                        /> */}

                        <h5>Project Target</h5>
                        <input type="number" ref='prtarget' className="form-control mb-4" placeholder="masukkan project description"/>
                        <h5>Project Date Start</h5>
                        <input type="date" ref='prdatestart' className="form-control mb-4" placeholder="masukkan project description"/>
                        <h5>Project Date End</h5>
                        <input type="date" ref='prdateend' className="form-control mb-4" placeholder="masukkan project description"/>
                        <h5>Insert Image Here</h5>
                        <input type="file" id="imgprojectinput" className="form-control mb-4" placeholder="masukkan project description" onChange={this.previewFile}/>
                        <div className="mt-2 mb-4">
                            <img id="imgpreview" alt='imgpreview' width="200px" height="200px"/>

                            {this.state.uploadProgress ? 
                            <Progress  className="font-weight-bold mb-3" animated value={this.state.uploadProgress}  color="primary">
                            {this.state.uploadProgress}
                            </Progress>
                            :
                            null
                            }
                            
                        </div>


                        <h5>Ajakan Campaign</h5>
                        <input type="text" ref='shareDescription' className="form-control mb-4" placeholder="Masukkan ajakan yang bisa mengajak orang lain untuk ikut berdonasi" maxLength={100}/>
                        <p>Maks 100 Karakter</p>
                        <input type="button" className="btn btn-dark" value="submit form" onClick={this.onSubmitClick}/>

                    </div>
                </div>
            </div>
            // </CloudinaryContext>
        )
    }
}

export default postProject



