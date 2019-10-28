import React, { Component } from 'react';
import Axios from 'axios';
import { URL_API } from '../../helpers/Url_API';


class AdminVerifyDetail extends Component {
    state = {
        studentDetailList: []
    }
    
    componentDidMount() {
        const token = localStorage.getItem('token');
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
        Axios.get(URL_API + '/studentdetailrev/student-detail-unverified', options)
        .then((res) => {
            console.log(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }
    
    render() {
        return (
            <div>
                <p>Ini Halaman Verify Detail Student</p>
            </div>
        )
    }
} 

export default AdminVerifyDetail