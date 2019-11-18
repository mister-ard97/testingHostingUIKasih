import React, {Component} from 'react'
import queryString from 'query-string'
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API'
class PaymentPending extends Component{
    state={
        data:''
    }
    componentDidMount(){
        let params = queryString.parse(this.props.location.search)
        console.log(params)
        Axios.post(`${URL_API}/payment/getStatus`, {"order_id": params.trans})
        .then((res)=>{
            console.log(res.data)
            this.setState({data: res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }
    renderStatus=()=>{
        const {bank, noPembayaran} = this.state.data
        return(
            <div className='container mt-5' style={{textAlign:'center'}}>
                <p className='align-item-center' style={{margin: '0 auto', fontSize:'24px', fontWeight:'bold'}}>selesaikan transaksi anda</p>
                <p>{bank}</p>
                <p>pending</p>
            </div>
        )
    }
    render (){
        return(
            <div className='container' style={{height:'100vh'}}>
                {this.renderStatus()}

            </div>
        )
    }
}

export default PaymentPending;