import React, {Component} from 'react'

class PaymentFinish extends Component{
    renderFisishStatus=()=>{
        return(
            <div className='container mt-5' style={{textAlign:'center'}}>
                <p className='align-item-center' style={{margin: '0 auto', fontSize:'24px', fontWeight:'bold'}}>Terima Kasih</p>
                <p>donasi anda sudah kami terima</p>
            </div>
        )
    }
    render (){
        return(
            <div className='container'>
                {this.renderFisishStatus()}
            </div>
        )
    }
}

export default PaymentFinish;