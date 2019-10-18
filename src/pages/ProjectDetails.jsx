import React, { Component } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { URL_API } from '../helpers/Url_API';
import {
    FacebookShareButton,
    WhatsappShareButton
} from 'react-share';
import { Link } from 'react-router-dom'

import queryString from 'query-string'

class ProjectDetails extends Component {
    state = {
        ProjectDetail: null,
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
    }

    renderProjectList = () => {
        if(this.state.ProjectDetail) {
            return this.state.ProjectDetail.map((val, index) => {
                return (
                    <div className='card mt-3' key={index}>
                        <div className='row'>
                            <div className='col-2'>
                                <img src={`${URL_API}${val.projectImage}`} alt={`${val.projectName}-banner`} className='img-fluid'/>
                            </div>
    
                            <div className='col-10'>
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
                                <FacebookShareButton>
                                    Share Facebook
                                </FacebookShareButton>
                                <WhatsappShareButton>
                                    Share WA
                                </WhatsappShareButton>
                                <Link to={`/payment?id=${val.projectId}`} > 
                                    <button>
                                        Donasi
                                    </button>
                                </Link>
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

    render() {
        return (
            <div className='row'>
                <div className='offset-2 col-8'>
                    {this.renderProjectList()}
                </div>
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