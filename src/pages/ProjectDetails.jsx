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

class ProjectDetails extends Component {
    state = {
        ProjectDetail: null,
        listDonasi: ''
    }

    componentDidMount() {
        let params = queryString.parse(this.props.location.search)
        console.log(params.id)
        Axios.get(URL_API + `/project/getDetailProject?id=${params.id}`)
        .then((res) => {
            console.log(res.data)
            this.setState({
                ProjectDetail : res.data.results,
            })
        })
        .catch((err) => {
            console.log(err)
        })

        let parameter = {
            projectId : params.id
        }  

        Axios.post(`${URL_API}/payment/getDonasiProject`, parameter)
        .then((res)=>{
            console.log(res.data)
            this.setState({ listDonasi: res.data})
        })
    }

    getNamaProject = (projectId, projectName) => {
        let nama = {
            projectId,
            projectName
        }
        localStorage.setItem('nama', JSON.stringify(nama))

    }

    renderProjectList = () => {
        let params = queryString.parse(this.props.location.search)
        if(this.state.ProjectDetail) {
            return this.state.ProjectDetail.map((val, index) =>{ 
                return (
                    <div className='card mt-3' key={index}>
                        
                        <div className='row'>
                            <div className='col-2'>
                                <img src={`${URL_API}${val.projectImage}`} alt={`${val.projectName}-banner`} className='img-fluid'/>
                            </div>
    
                            <div className='col-10 img-small'>
                                <h5>{val.projectName}</h5>
                                <p>{val.projectCreator}</p>
                                <hr/>
                                <h6>Description</h6>
                                <div dangerouslySetInnerHTML={{__html:val.description? val.description : null}}></div>
                                <p className='font-weight-bold'>{val.projectCreator}</p>
                                <hr/>
                                <p className='font-weight-bold'>Tanggal Dibuat</p>
                                <p>{new Date(val.projectCreated).toLocaleDateString('id-IND')}</p>
                                <hr/>
                                <p className='font-weight-bold'>Tanggal Berakhir</p>
                                <p>{new Date(val.projectEnded).toLocaleDateString('id-IND')}</p>
                                <hr/>
                                <h6>Rp. {val.totalTarget}</h6>

                                <FacebookShareButton url={`${UI_LINK}/project-detail?id=${val.projectId}`} className='btn btn-primary'>
                                    Share Facebook
                                </FacebookShareButton>
                           
                                
                                <WhatsappShareButton url={`${UI_LINK}/project-detail?id=${val.projectId}`} className='btn btn-success'>
                                    Share Whatsapp
                                </WhatsappShareButton>
                                {
                                    this.props.email ?
                                    <a href={`/payment?id=${val.projectId}&projectName=${val.projectName}`} onClick={() => this.getNamaProject(val.projectId, val.projectName)}> 
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
            })
        } else {
            return (
                <h4>Loading...</h4>
            )
        }
    }

    renderDonasiList = () => {
        return this.state.listDonasi.map((val) => {
            return (
                <div className='card-list-donasi-project mb-2'>
                    <div className='row'>
                        <div className='userImage  col-md-1'>
                            <img src='https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?fit=256%2C256&quality=100&ssl=1' alt='img'/>
                        </div>
                        <div className='contentList   col-md-11'>
                            <div className='namaDonatur'>
                                {val.isAnonim === 1 ? 'Anonim' : val.User.nama}
                            </div>
                            <div className='nominalDonasi'>
                                Donasi Rp.  {Numeral(val.nominal).format('0,0')}
                            </div>
                            <div className='dateDonasi'>
                                {Moment( val.createdAt ).format("DD MMMM YYYY  |  H:mm")+' wib'}
                            </div>
                            <div className='komentar'>
                                {val.komentar !== '-' ? val.komentar : null}
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    render() {
        // if(this.state.listDonasi.length === 0){
        //     return <h2>Loading</h2>
        // }
        return (
            <div className='container'>
                <div className='row'>
                    <div className='offset-2 col-8'>
                        {this.renderProjectList()}
                    </div>
                </div>
                {
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
                }
            </div>
        )
    }
}

const mapStateToProps = ({auth}) => {
    return {
        email: auth.email
    }
}

export default connect(mapStateToProps)(ProjectDetails)