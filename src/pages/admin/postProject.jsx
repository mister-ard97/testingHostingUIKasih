import React from 'react'
import Axios from 'axios';
import { URL_API } from '../../helpers/Url_API';
import { Redirect } from 'react-router-dom';

// import {  DokumenEditor } from '../../components/Ckeditor'
// import CKEditor from '@ckeditor/ckeditor5-react';
// import DokumenEditor from '@ckeditor/ckeditor5-build-decoupled-document';

import { Modal, ModalBody} from 'reactstrap';

// Link custom toolbar reqct quiil (tombol menambahkan icon)
// https://codesandbox.io/s/6x93pk4rp3


class postProject extends React.Component{
    constructor(props) {
        super(props)
        this.state = { text: '', imageFile : null,imagequill:null,modalopen:false } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
        // this.addimagequillchange=this.addimagequillchange.bind(this)
    }
    modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link'],
          ['clean']
        ],
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

    onSubmitClick = () =>{
   
        var formData = new FormData()
        let token = localStorage.getItem('token')
        var headers ={
            headers : 
            {
                'Authorization': `Bearer ${token}`,
                'Content-Type' : 'multipart/form-data'
            }
        }

        var data = {
            name : this.refs.prname.value,
            description : this.state.text,
            totalTarget : this.refs.prtarget.value,
            projectCreated : this.refs.prdatestart.value,
            projectEnded : this.refs.prdateend.value,
            shareDescription: this.refs.shareDescription.value
        }
        
        formData.append('image', this.state.imageFile) 
        formData.append('data', JSON.stringify(data))

        console.log(data)

        Axios.post(URL_API+'/project/postproject', formData, headers)
        .then((res)=>{
            window.alert("insert success")
        })
        .catch((err)=>{
            window.alert(err)
        })
    }

    handleChange(value) {
       this.setState({
           text:value
       })
       console.log(this.state.text)
    }

    addimagequillchange=(e)=>{

        console.log (e.target.files[0])
        if(e.target.files[0]){
            var newtext=this.state.text
            var formData = new FormData()
            formData.append('image', e.target.files[0])
            Axios.post(URL_API + `/project/GenerateURL`, formData)
            .then((res) => {
                console.log(res.data)
                newtext+=`<img src=${URL_API+res.data}>`
                this.setState({ 
                   modalopen:false,
                   text:newtext
                })
            })
            .catch((err) => {
                console.log(err)
            })
        }else{

        }
    }

    render(){
        return(
            <div>
                <Modal isOpen={this.state.modalopen} toggle={()=>this.setState({modalopen:false})} >
                    <ModalBody>
                        <input type="file" onChange={this.addimagequillchange}/>
                    </ModalBody>
                </Modal>
                <h1 className="mb-4">GALANG DANA</h1>
                <h5>Nama Project</h5>
                <input type="text" ref='prname' className="form-control mb-4" placeholder="masukkan nama project"/>
                <button onClick={()=>this.setState({modalopen:true})}>add image</button>

                {/* <ReactQuill value={this.state.text}
                            modules={this.modules}
                            formats={this.formats}
                            onChange={this.handleChange} 
                /> */}
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
                </div>

                <h5>Ajakan Campaign</h5>
                <input type="text" ref='shareDescription' className="form-control mb-4" placeholder="Masukkan ajakan yang bisa mengajak orang lain untuk ikut berdonasi" maxLength={100}/>
                <p>Maks 100 Karakter</p>
                <input type="button" className="btn btn-dark" value="submit form" onClick={this.onSubmitClick}/>
            </div>
        )
    }
}

export default postProject
