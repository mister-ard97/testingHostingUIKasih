import React, {Component} from 'react'
import Axios from 'axios'
import {URL_API} from '../helpers/Url_API'
import { CircularProgress } from '@material-ui/core'
class HistoryDonasi extends Component {
    state = {
        historyData:null
    }
    componentDidMount(){
        let parameter = {
            userId : 1
        }        
        Axios.post(`${URL_API}/payment/getHistory`, parameter)
        .then((res) => {
            console.log(res.data)
            this.setState({historyData: res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderHistory = () => {
        return this.state.historyData.map((val, i) => {
            console.log(val)
            return(
                <div className='cardHistory row mb-2'>
                    <div className='imageProject col-md-1  p-0 '>
                        <img src={val.Project.projectImage} width='100%' alt='img'/>
                    </div>
                    <div className='projectDetail col-md-10 p-0 pl-2'>
                        <div>
                            <div className='projectName'>
                                {val.Project.projectName}
                            </div>
                            <div className='komentarDonasi'>
                                {val.komentar}
                            </div>
                        </div>
                        <div className='nominalDonasi'>
                            Rp. {val.nominal}
                        </div>
                    </div>
                    <div className='statusPatment col-md-1 p-0 '>
                        <div className="statusTest">
                            {val.statusPayment === 'settlement' ? 'Berhasil' : 'Pending'}
                        </div>
                    </div>
                </div>
            )
        })
    }
    render(){
        console.log(this.state.historyData)
        if(!this.state.historyData){
            return <center><CircularProgress/></center>
        }
        return(
            <div className='container mt-3'>
                <h3>History Donasi</h3>
                {this.renderHistory()}
                {/* <div className='cardHistory row mb-2'>
                    <div className='imageProject col-md-2  p-0'>
                        <img src='https://pbs.twimg.com/profile_images/446356636710363136/OYIaJ1KK.png' width='100px' alt='img'/>
                    </div>
                    <div className='projectDetail col-md-8 p-0 '>
                        <div>
                            <div className='projectName'>
                                Donasi kemanusiaan
                            </div>
                            <div className='komentarDonasi'>
                                sebuah komentar singkat
                            </div>
                        </div>
                        <div className='nominalDonasi'>
                            Rp. 30.000
                        </div>
                    </div>
                    <div className='statusPatment col-md-2 p-0 '>
                        <div className="statusTest">
                            Berjasil
                        </div>
                    </div>
                </div> */}
                
            </div>
        )
    }
}

export default HistoryDonasi;