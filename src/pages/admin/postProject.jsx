import React from 'react'
import Axios from 'axios';
import { URL_API } from '../../helpers/Url_API';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6


class postProject extends React.Component{
    constructor(props) {
        super(props)
        this.state = { text: '', imageFile : null } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
    }
    modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
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

        var headers ={
            headers : 
            {'Content-Type' : 'multipart/form-data'}
        }

        var data = {
            name : this.refs.prname.value,
            description : this.state.text,
            totalTarget : this.refs.prtarget.value,
            projectCreated : this.refs.prdatestart.value,
            projectEnded : this.refs.prdateend.value
        }
        
        formData.append('image', this.state.imageFile) 
        formData.append('data', JSON.stringify(data))

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


    render(){
        return(
            <div>
                <h1 className="mb-4">GALANG DANA</h1>
                <h5>Nama Project</h5>
                <input type="text" ref='prname' className="form-control mb-4" placeholder="masukkan nama project"/>
                <ReactQuill value={this.state.text}
                            modules={this.modules}
                            formats={this.formats}
                            onChange={this.handleChange} 
                />

                <h5>Project Target</h5>
                <input type="number" ref='prtarget' className="form-control mb-4" placeholder="masukkan project description"/>
                <h5>Project Date Start</h5>
                <input type="date" ref='prdatestart' className="form-control mb-4" placeholder="masukkan project description"/>
                <h5>Project Date End</h5>
                <input type="date" ref='prdateend' className="form-control mb-4" placeholder="masukkan project description"/>
                <h5>Insert Image Here</h5>
                <input type="file" id="imgprojectinput" className="form-control mb-4" placeholder="masukkan project description" onChange={this.previewFile}/>
                <div className="mt-2 mb-4">
                    <img id="imgpreview" width="200px" height="200px"/>
                </div>

                <input type="button" className="btn btn-dark" value="submit form" onClick={this.onSubmitClick}/>
            </div>
        )
    }
}

export default postProject