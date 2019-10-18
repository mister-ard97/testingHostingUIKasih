import React, { Component } from 'react';
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API';

class StudentDetail extends Component {
    state = {
        StudentDetaildata:null,
        raport:[]
    }
    componentDidMount(){
        Axios.get(URL_API+'/studentdetail/get-student-detail/1')
        .then(res=>{
            this.setState({StudentDetaildata:res.data[0],raport:res.data[0].StudentDetails})
        }).catch(err=>{
            console.log(err)
        })
    }
    renderRaport=()=>{

        return this.state.raport.map((item,index)=>{
            return(
                <img key={index} src={URL_API+item.pictureReport} />
            )
        })
    }
    render() {
        if(this.state.StudentDetaildata){
            return (
                <div>
                    <img src={URL_API+this.state.StudentDetaildata.studentImage} />
                    <h5>{this.state.StudentDetaildata.name}</h5>
                    <h5>{this.state.StudentDetaildata.tanggalLahir}</h5>
                    {this.renderRaport()}
                </div>
              );
        }
        return(
            <div>loading</div>
        )
    }
}
 
export default StudentDetail;