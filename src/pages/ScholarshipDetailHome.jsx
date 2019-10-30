import React, { Component } from 'react';
import Axios from 'axios';
import {Link} from 'react-router-dom'
import Numeral from 'numeral'
import { connect } from 'react-redux';
import { Input } from 'reactstrap'
import Moment from 'moment'
import { URL_API, UI_LINK } from '../helpers/Url_API';
import {
    FacebookShareButton,
    WhatsappShareButton,
    FacebookIcon, 
    WhatsappIcon
} from 'react-share';

import queryString from 'query-string'

class ScholarshipDetailHome extends Component {

    state = {
        ScholarshipDetail: null,
        listDonasi: ''
    }

    componentDidMount() {
        let params = queryString.parse(this.props.location.search)
        console.log(params.id)
        Axios.get(URL_API + '/scholarship/getScholarshipDetail?id='+ params.id)
        .then((res) => {
            console.log(res.data[0])
            this.setState({ScholarshipDetail: res.data[0]})
        })
        .catch((err) => {
            console.log(err)
        })

        // let parameter = {
        //     projectId : params.id
        // }  

        // Axios.post(`${URL_API}/payment/getDonasiProject`, parameter)
        // .then((res)=>{
        //     console.log(res.data)
        //     this.setState({ listDonasi: res.data})
        // })
    }

    getNamaScholarship = (scholarId, scholarName) => {
        let nama = {
            scholarId,
            scholarName
        }
        localStorage.setItem('namaScholarship', JSON.stringify(nama))

    }

    renderScholarshipDetails = () => {
        // let params = queryString.parse(this.props.location.search)
        if(this.state.ScholarshipDetail) {

            const {namaSiswa, studentImage} = this.state.ScholarshipDetail.Student
            const { namaSekolah } = this.state.ScholarshipDetail.School
            const {id, judul, nominal, description, shareDescription, durasi, scholarshipStart, scholarshipEnded} = this.state.ScholarshipDetail

            console.log(namaSekolah)
            return (
                    <div className='card mt-3'>
                        {console.log(this.state.ScholarshipDetail)}
                        <div className='row'>
                            <div className='col-2'>
                                <img src={`${URL_API}${studentImage}`} alt={`${judul}-banner`} className='img-fluid'/>
                            </div>

                            <div className='col-10 img-small'>
                                <h5>{judul}</h5>
                                <p>{namaSekolah}</p>
                                <p>Nama Siswa : {namaSiswa}</p>
                                <hr/>
                                <h6>Description</h6>
                                <div dangerouslySetInnerHTML={{__html: description ? description : null}}></div>
                                <hr/>
                                <p className='font-weight-bold'>Tanggal Dibuat</p>
                                <p>{new Date(scholarshipStart).toLocaleDateString('id-IND')}</p>
                                <hr/>
                                <p className='font-weight-bold'>Tanggal Berakhir</p>
                                <p>{new Date(scholarshipEnded).toLocaleDateString('id-IND')}</p>
                                <hr/>
                                <h6>Rp. {nominal} / perbulan</h6>

                                <FacebookShareButton url={`${UI_LINK}/scholarship-student?id=${id}`} className='btn btn-primary'>
                                    Share Facebook
                                </FacebookShareButton>
                        
                                
                                <WhatsappShareButton url={`${UI_LINK}/scholarship-student?id=${id}`} className='btn btn-success'>
                                    Share Whatsapp
                                </WhatsappShareButton>
                                {
                                    this.props.email ?
                                    <a href={`/payment?id=${id}&scholarship-name=${judul}`} onClick={() => this.getNamaScholarship(id, judul)}> 
                                        <button>
                                            Donasi
                                        </button>
                                    </a>
                                    :
                                    <a href={`/login`}> 
                                        <button>
                                            Donasi
                                        </button>
                                    </a>
                                }
                                
                            </div>
                            </div>
                    </div>    
                )
        } else {
            return (
                        <h4>Loading...</h4>
                    )
        }
        // console.log(this.state.ScholarshipDetail)
        
            // if(this.state.ScholarshipDetail) {
            
        //         return (
        //             <div className='card mt-3'>
                        
        //                 <div className='row'>
        //                     <div className='col-2'>
        //                         <img src={`${URL_API}${studentImage}`} alt={`${judul}-banner`} className='img-fluid'/>
        //                     </div>

        //                     <div className='col-10 img-small'>
        //                         <h5>{judul}</h5>
        //                         <p>{namaSekolah}</p>
        //                         <p>Nama Siswa : {namaSiswa}</p>
        //                         <hr/>
        //                         <h6>Description</h6>
        //                         <div dangerouslySetInnerHTML={{__html: description ? description : null}}></div>
        //                         <hr/>
        //                         <p className='font-weight-bold'>Tanggal Dibuat</p>
        //                         <p>{new Date(scholarshipStart).toLocaleDateString('id-IND')}</p>
        //                         <hr/>
        //                         <p className='font-weight-bold'>Tanggal Berakhir</p>
        //                         <p>{new Date(scholarshipEnded).toLocaleDateString('id-IND')}</p>
        //                         <hr/>
        //                         <h6>Rp. {nominal} / perbulan</h6>

        //                         <FacebookShareButton url={`${UI_LINK}/scholarship-student?id=${id}`} className='btn btn-primary'>
        //                             Share Facebook
        //                         </FacebookShareButton>
                        
                                
        //                         <WhatsappShareButton url={`${UI_LINK}/scholarship-student?id=${id}`} className='btn btn-success'>
        //                             Share Whatsapp
        //                         </WhatsappShareButton>
        //                         {
        //                             this.props.email ?
        //                             <a href={`/payment?id=${id}&scholarship-name=${judul}`} onClick={() => this.get(id, )}> 
        //                                 <button>
        //                                     Donasi
        //                                 </button>
        //                             </a>
        //                             :
        //                             <a href={`/login`}> 
        //                                 <button>
        //                                     Donasi
        //                                 </button>
        //                             </a>
        //                         }
                                
        //                     </div>
        //                     </div>
        //             </div>    
        //         )
        // } else {
        //     return (
        //         <h4>Loading...</h4>
        //     )
        // }
    }

    render() {
        // if(this.state.listDonasi.length === 0){
        //     return <h2>Loading</h2>
        // }


        return (
            <div className='container'>
                <div className='row'>
                    <div className='offset-2 col-8'>
                        {this.renderScholarshipDetails()}
                    </div>
                </div>
                {/* {
                    this.state.listDonasi.length !==0 ?
                    <div>
                        <div className='row mt-4'>
                            <div className='offset-2 col-8 containerListDonasi'>
                                    {this.renderDonasiList()}
                            </div>
                        </div>
                    </div>
                    :
                    null
                } */}
            </div>
        )
    }
}

const mapStateToProps = ({auth}) => {
return {
    email: auth.email
}
}

export default connect(mapStateToProps)(ScholarshipDetailHome)