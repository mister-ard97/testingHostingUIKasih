import React from 'react'
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ReactQuill from 'react-quill'; // ES6
import User from './User'

class ProjectList extends React.Component{
    state = {
        data : [],
        editNum : null,
        modalOpen : false,
        text : '',
        imageFile : null
    }

    componentDidMount(){
        this.getProjectList()
    }

    getProjectList(){
        Axios.get(URL_API+'/project/getproject')
        .then((res)=>{
         

            var results = res.data.result.map((val,id)=>{
                var hasil = {...val, ...val.User}
                delete hasil.User
                return hasil
            })

            this.setState({
                data : results
            })
            console.log(this.state.data)
        })
        .catch((err)=>{
            console.log(err)
        })
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

    deleteProject =(id) =>{
        var confirm = window.confirm('delete this project ?')
        if(confirm){
            Axios.put(URL_API+`/project/deleteproject/${id}`)
            .then((res)=>{
                console.log(res)
                window.alert("delete success")
                this.getProjectList()
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }



    renderProjectList = () =>{
        if(this.state.data.length !== 0 ){
            var jsx = this.state.data.map((val,i)=>{
                // if(this.state.editNum === i ){
                //     return (
                       
                //     )
                // }

                return (
                    <tr>
                        <th>{i+1}</th>
                        <th>{val.projectName}</th>
                        <th>{val.projectCreator}</th>
                        <th>
                            <div dangerouslySetInnerHTML={{__html:val.description? val.description : null}}></div>
                        </th>
                        <th>{val.projectCreated.split('T')[0]}</th>
                        <th>{val.projectEnded.split('T')[0]}</th>
                        <th>{val.totalTarget}</th>
                        <th><img src={`${URL_API}${val.projectImage}`} height={150} width={150}/></th>
                        <th className="d-flex flex-column">
                            <input type="button" className="btn btn-primary form-control mb-4" value="edit" onClick={()=>this.setState({ editNum : i, modalOpen : true, text : val.description })}/>
                            <input type="button" className="btn btn-danger form-control" value="delete" onClick={()=>this.deleteProject(val.projectId)}/>
                        </th> 
                    </tr>
                )
            })
            return jsx
        }
    }
    
    handleChange = (value) =>{
        
        this.setState({
            text : value
        })
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

    editProject = (id) =>{
        console.log(id)
        
        var formData = new FormData()

        var headers ={
            headers : 
            {'Content-Type' : 'multipart/form-data'}
        }

        var data = {
            // OLD
            oldimg : this.state.data[this.state.editNum].projectImage, 
            changeImage : this.state.imageFile ? true : false,
            
            name : this.refs.prname.value,
            description : this.state.text,
            totalTarget : this.refs.prtarget.value,
            projectEnded : this.refs.prdateend.value ? this.refs.prdateend.value : this.state.data[this.state.editNum].projectEnded
        }
        console.log(data)

        formData.append('image', this.state.imageFile) 
        formData.append('data', JSON.stringify(data))


        Axios.put(`${URL_API}/project/editproject/${id}`, formData, headers)
        .then((res)=>{
            window.alert('edit success')
            this.getProjectList()
            this.setState({
                modalOpen : false,
                text : '',
                editNum : null
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    renderModalBody = () =>{
        console.log(this.state.editNum)
        if(this.state.editNum || this.state.editNum === 0) {
            var data = this.state.data
            var i = this.state.editNum
            return (
                <div>
                    <h5>Project Creator </h5>

                    <div className="mb-4">{data[i].projectCreator}</div>
                <h5>Project Name</h5>
             
                <input type="text" ref="prname" className="form-control mb-4" defaultValue={data[i].projectName} />
              
       
                <h5>Description </h5>
                <ReactQuill value={this.state.text}
                            modules={this.modules}
                            formats={this.formats}
                            onChange={this.handleChange} 
                            className="mb-4"
                />

                    {/* <input type="text" className="form-control" defaultValue={val.description} /> */}
                    {/* <div dangerouslySetInnerHTML={{__html:val.description? val.description : null}}></div> */}
                    <h5>Project Created </h5>
                    <div className="mb-4"> 
              {data[i].projectCreated.split('T')[0]}

                    </div>
     
                {/* {val.projectEnded.split('T')[0]} */}
                <h5>Project Ended </h5>
                    <input type="date" ref="prdateend" className="form-control mb-4"/>
  
                    {/* {val.totalTarget} */}
                    <h5>Total Target</h5>
                    <input type="number" ref="prtarget" className="form-control mb-4" defaultValue={data[i].totalTarget} />
                    <div className="mt-2 mb-4">
                        <h5> Current Image </h5>
                        <img src={`${URL_API}${data[i].projectImage}`} height={150} width={150}/>
                    </div>
                    
                    <div className="mt-2 mb-4">
                        <h5>INsert new image here (OPTIONAL)</h5>
                    <img id="imgpreview" width="200px" height="200px"/>
                    <input type="file" id="imgprojectinput" className="form-control mb-4" placeholder="masukkan project description" onChange={this.previewFile}/>
                    </div>
              
       
           
           
                    <input type="button" className="btn btn-danger form-control mb-4" value="cancel" onClick={()=>this.setState({ editNum : null})}/>
                    <input type="button" className="btn btn-success form-control" value="finish" onClick={()=>this.editProject(data[i].projectId)}/>
                    </div>
            )
        }
    }

    render(){
        return(
            <div>
                 <Modal isOpen={this.state.modalOpen} toggle={()=>this.setState({ modalOpen : false, editNum : null, text : ''})} size="lg" centered>
                        <ModalHeader>
                            EDIT PRODUCT
                        </ModalHeader>
                        <ModalBody >
                            {this.renderModalBody()}
                              
                        </ModalBody>
                        <ModalFooter>
                        
                        </ModalFooter>
                </Modal>
                    <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">No</th>
                            <th scope="col">ProjectName</th>
                            <th scope="col">Created by</th>
                            <th scope="col">Description</th>
                            <th scope="col">Created Date </th>
                            <th scope="col">Ended Date</th>
                            <th scope="col">Total Target</th>
                            <th scope="col">Project Image</th>
                            <th>EDIT DELETE</th>
                            </tr>
                        </thead>
                        <tbody>
                           
                            {this.renderProjectList()}
                        </tbody>
                        </table>

            </div>
        )
    }
}

export default ProjectList