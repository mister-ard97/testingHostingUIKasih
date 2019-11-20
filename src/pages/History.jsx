import React, {Component} from 'react'
import Axios from 'axios'
import {URL_API} from '../helpers/Url_API'
import { CircularProgress } from '@material-ui/core'
import Numeral from 'numeral'
import Moment from 'moment'
import { connect } from 'react-redux'
import { dateDiff } from '../helpers/helpers'

class History extends Component {
    state = {
        historyData:null,
        totalData : 0,
        limit : 3,
        offset : 0,
        loading : false,
        cssShow : ''
    }
    componentDidMount(){
        // console.log('asd')
        this.getHistoryData()
       
    }

    getHistoryData = () =>{
        const token = localStorage.getItem('token');
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }

        var data = {
            userId : this.props.id,
            offset : this.state.offset,
            limit :  this.state.limit
        }

        Axios.post(URL_API + '/payment/getHistory',data, options)
        .then((res)=>{
            console.log(res.data.result)
            if(this.state.offset === 0){
                console.log('awal')
                this.setState({
                    historyData : res.data.result,
                    totalData : res.data.count,
                    loading : false
                })
            }else {
                let data = this.state.historyData
                console.log(data)
                console.log(this.state.historyData)
                data = [...data, ...res.data.result]
                this.setState({
                    historyData : data,
                    loading : false
                })
            }
           
        })
        .catch((err)=>{
            console.log(err)
        })
    }


    printStatus = (status) =>{
        if(status === 'pending'){
            return (
                <div className="text-primary fs-25">
                    {status}
                </div>
            )
        }else if(status === 'settlement'){
            return (
                <div className="text-success fs-25">
                    {status}
                </div>
            )

        }else if(status === 'failure')
            return (
                <div className="text-danger fs-25">
                      {status}
                </div>
            )
    }

    printButton = () =>{
        if(this.state.loading){
            return (
                <div class="spinner-border text-danger" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            )
        }
        if(this.state.totalData > this.state.historyData.length) {
            return (
                <div className="btn btn-danger" onClick={async ()=> {
                         await this.setState((prevState) => ({
                            offset: prevState.offset + 3 
                          }));
                         this.getHistoryData()
                    }} >
                    SHOW MORE
                </div>
            )
        }
    }



    renderHistory = () => {
        
        console.log(this.state.historyData)
        if(this.state.historyData.length !== 0){
            let jsx = this.state.historyData.map((val, i )=>{
                if(val.scholarshipId){
                    val.picture = val.fotoMurid
                    val.title = val.namaMurid
                }else {
                    val.picture = val.gambarProject
                    val.title = val.namaProject
                }
                return (
                    <div class="card mb-5 shadow">
                        <div class="card-header row pb-0 m-0 p-0" >
                            <div className="col-md-2 text-center mb-2 mb-md-0">
                                <img src={URL_API+val.picture} height='120px' width='100%'/>
                            </div>
                            <div className="col-md-6 text-md-left text-center mb-2 mb-md-0">
                                <div className="text-muted" style={{fontSize : '35px'}}>{new Date(val.createdAt).toLocaleDateString('id-IND')}</div>
                                <h1>{val.title}</h1>
                            </div>
                            <div className="col-md-4 text-md-right text-center mb-2 mb-md-0">
                                {this.printStatus(val.statusPayment)}
                                <div className="fs-40">
                                    {val.nominal}
                                    <span className="fs-25">
                                        &nbsp;Rp
                                    </span>
                                </div>

                            </div>
                        </div>
                        <div class="card-body">
                             <h4 className="mb-3"> Pembayaran Berupa : <span className="text-muted" style={{fontSize : '35px'}}> {val.paymentSource} </span> </h4>
                             <h4> Jenis Pembayaran : <span className="text-muted"> {val.paymentType} </span></h4>
                        </div>
                        <div class="card-footer text-center text-muted" style={{fontSize : '25px'}}>
                            {dateDiff(val.createdAt) }
                           
                        </div>

                    </div>
                )
            })
            return jsx
        }
    }
    render(){
        console.log(this.state.historyData)
        if(!this.state.historyData){
            return <center><CircularProgress/></center>
        }
        return(
            // <div className="mycontainer" >
            //     {/* <h1 onClick={()=>this.setState({ cssShow : 'show'})}>o</h1> */}
            //      <div className={`testingoverlay  ${this.state.cssShow}`} > </div>
            //         <div  className='border border-secondary'onClick={()=>this.setState({ cssShow : 'show'})}>
            //             CLCIK DISINI
            //         </div>
                    <div className=' mt-3'>
                        
                        <div className="container">
                    
                            <h1 className="text-center text-muted mb-3">Riwayat Transaksi</h1>
                            
                            {this.renderHistory()}  
                            <div className="d-flex flex-row justify-content-center">
                                {this.printButton()}
                            </div>
                            <div>
                            <div class="container">
                                {/* <ul className="text-danger">
                                    <li className="text-danger">
                                    <a class="animated-arrow" href="https://google.com">
                                        <span class="the-arrow -left text-danger">
                                        <span class="shaft"></span>
                                        </span>
                                        <span class="main">
                                        <span class="text text-danger">
                                            Discover the Agency
                                        </span>
                                        <span class="the-arrow -right text-danger">
                                            <span class="shaft"></span>
                                        </span>
                                        </span>
                                    </a>
                                    </li>
                                    <li className="text-danger">
                                    <a class="animated-arrow" href="https://google.com">
                                        <span class="the-arrow -left text-danger">
                                        <span class="shaft"></span>
                                        </span>
                                        <span class="main">
                                        <span class="text text-danger">
                                            View Projects
                                        </span>
                                        <span class="the-arrow -right text-danger">
                                            <span class="shaft"></span>
                                        </span>
                                        </span>
                                    </a>
                                    </li>
                                    <li className="text-danger">
                                    <a class="animated-arrow"  href="https://google.com">
                                        <span class="the-arrow -left text-danger">
                                        <span class="shaft"></span>
                                        </span>
                                        <span class="main">
                                        <span class="text text-danger text-danger">
                                            Get in Touch
                                        </span>
                                        <span class="the-arrow -right">
                                            <span class="shaft"></span>
                                        </span>
                                        </span>
                                    </a>
                                    </li>
                                </ul> */}
                                </div>

                                
                            </div>

                        </div>

                        
                    </div>
    
               
            // </div>
        )
    }
}


const mapStatetoProps = ({ auth }) => {
    return{
        id: auth.id
    }
}

export default connect(mapStatetoProps,{}) (History);