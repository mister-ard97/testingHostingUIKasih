import React, {Component} from 'react'

class PaymentPending extends Component{
    renderStatus=()=>{
        return(
            <div className='container mt-5' style={{textAlign:'center'}}>
                <p className='align-item-center' style={{margin: '0 auto', fontSize:'24px', fontWeight:'bold'}}>Status pembayaran</p>
                <p>pending</p>
            </div>
        )
    }
    render (){
        return(
            <div className='container'>
                {this.renderStatus()}
            </div>
        )
    }
}

export default PaymentPending;