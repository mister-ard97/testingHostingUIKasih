import React, {Component} from 'react'

class PaymentError extends Component{
    renderStatus=()=>{
        return(
            <div className='container mt-5' style={{textAlign:'center'}}>
                <p className='align-item-center' style={{margin: '0 auto', fontSize:'24px', fontWeight:'bold'}}>Kami Memohon maaf</p>
                <p>donasi anda ada sedikit kendala</p>
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

export default PaymentError;