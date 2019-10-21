import React, { Component } from 'react';
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API';
import {Table} from 'reactstrap'
import {Link} from 'react-router-dom'

class Studentlist extends Component {
    state = {
        studentdata:[],
        countstudent:0
      }
    componentDidMount(){
        Axios.get(URL_API+'/student/getstudentdatapaging',{
            params:{
                limit:2,
                page:1
            }
        }).then(res=>{
            this.setState({studentdata:res.data.rows,countstudent:res.data.count})
        })
    }
    renderListstudent=()=>{
        return this.state.studentdata.map((item,index)=>{
            return (
                <tr key={item.id}>
                    <td >{index+1}</td>
                    <td>{item.name}</td>
                    <td><img src={URL_API+item.studentImage} alt="" width='200'/></td>
                    <td>{item.sekolah}</td>
                    <td>
                    <a href={`/studentdetail?id=${item.id}`} style={{textDecoration:'none'}}>
                        <button className='btn btn-primary'>Lihat student</button>
                    </a>    
                    </td>
                </tr>
            )
        })
    }
    render() { 
        return (
            <div>
                <Table className='mt-2' striped hover>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama murid</th>
                                <th>foto murid</th>
                                <th>sekolah</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderListstudent()}
                        </tbody>
                </Table>
            </div>
          );
    }
}
 
export default Studentlist;