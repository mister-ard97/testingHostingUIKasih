import React, {Component} from 'react'
import Axios from 'axios'
import { Table } from 'reactstrap'
import { URL_API } from '../../helpers/Url_API'

class ScholarshipDetail extends Component {
    state = {
        data: ''
    }

    componentDidMount(){
        let id = 3
        Axios.get(URL_API + '/scholarship/getScholarshipDetail?id='+id)
        .then((res) => {
            console.log(res.data)
            this.setState({data: res.data[0]})
        })
    }
    render(){
        if(!this.state.data){
            return <p>Loading</p>
        }
        const {namaSiswa, studentImage} = this.state.data.Student
        const { namaSekolah } = this.state.data.School
        const { judul, nominal, description, shareDescription, durasi, scholarshipStart, scholarshipEnded} = this.state.data
        return (
            <div className='container mt-4 mb-4'>
                <p>detail</p>
                <h3>{ judul }</h3>
                <div className='row'>
                
                    <div className='col-md-2'>
                        <img src={`http://localhost:1998/${studentImage}`} width='200px'/>
                    </div>
                    <div className='col-md-9 pl-5'>
                        
                        <Table>
                            <tr>
                                <td width='20%'>Nama</td>
                                <td>: {namaSiswa}</td>
                            </tr>
                            <tr>
                                <td width='20%'>Sekolah</td>
                                <td>: {namaSekolah}</td>
                            </tr>
                            <tr>
                                <td width='20%'>Target Donasi</td>
                                <td>: {nominal}</td>
                            </tr>
                            <tr>
                                <td width='20%'>Durasi</td>
                                <td>: {durasi} Bulan</td>
                            </tr>
                            <tr>
                                <td width='20%'>Deskripsi</td>
                                <td>: {description}</td>
                            </tr>
                            <tr>
                                <td width='20%'>Share Deskripsi</td>
                                <td>: {shareDescription}</td>
                            </tr>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}

export default ScholarshipDetail;