import React, {Component} from 'react'

class PaymentFinish extends Component{
    renderFisishStatus=()=>{
        return(
            <div className='d-flex justify-content-center align-self-center' style={{height:'100vh', border:'1px solid red', margin:'0 auto'}}>
                <p>Finish</p>
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