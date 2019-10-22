import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class PostStudent extends Component {
    constructor(props) {
        super(props)
        this.state = { text: '', imageFile : null } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this)
    }

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
   
        // var formData = new FormData()
        // let token = localStorage.getItem('token')
        // var headers ={
        //     headers : 
        //     {
        //         'Authorization': `Bearer ${token}`,
        //         'Content-Type' : 'multipart/form-data'
        //     }
        // }

        // var data = {
        //     name : this.refs.prname.value,
        //     description : this.state.text,
        //     totalTarget : this.refs.prtarget.value,
        //     projectCreated : this.refs.prdatestart.value,
        //     projectEnded : this.refs.prdateend.value,
        //     shareDescription: this.refs.shareDescription.value
        // }
        
        // formData.append('image', this.state.imageFile) 
        // formData.append('data', JSON.stringify(data))

        // console.log(data)

        // Axios.post(URL_API+'/project/postproject', formData, headers)
        // .then((res)=>{
        //     window.alert("insert success")
        // })
        // .catch((err)=>{
        //     window.alert(err)
        // })
    }

    render() {
        if(this.props.role === 'User Admin') {
            return (
                <div>
                    <h1 className="mb-4">Input Student</h1>
                    <h5>Nama Student</h5>
                    <input type="text" ref='prname' className="form-control mb-4" placeholder="Masukkan Nama Student"/>
                    <h5>Pendidikan Terakhir</h5>
                    <input type="text" ref='pendterakhir' className="form-control mb-4" placeholder="Masukkan Pendidikan Terkahir"/>
                    
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
    
                    <h5>Ajakan Campaign</h5>
                    <input type="text" ref='shareDescription' className="form-control mb-4" placeholder="Masukkan ajakan yang bisa mengajak orang lain untuk ikut berdonasi" maxLength={100}/>
                    <p>Maks 100 Karakter</p>
                    <input type="button" className="btn btn-dark" value="submit form" onClick={this.onSubmitClick}/>
                </div>
            )
        }

        return (
            <Redirect to='/' />
        )
    } 
}

const mapStateToProps = ({auth}) => {
    return {
        role: auth.role
    }
}

export default connect(mapStateToProps)(PostStudent)