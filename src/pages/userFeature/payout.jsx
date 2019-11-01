import React, {Component} from 'react'
import {Input, Button} from 'reactstrap'
import Axios from 'axios'
import {URL_API} from '../../helpers/Url_API'

class Payout extends Component{
    state={
        nominal:0
    }
    onClickPayout=()=>{
        let nominal = this.state.nominal
        console.log(nominal)
        const options={
            header:{
                "Authorization":"Basic SVJJUy04M2YxMzVlZC0zNTEzLTQ3YmYtODFiYi1hMDcxODIyZWU2OGY6",
                "Content-Type":"application/json",
                // "Accept":"application/json",
                "Access-Control-Allow-Origin":"*"
            }
        }
        let body={
            "payouts": [
                {
                "beneficiary_name": "Jon Snow",
                "beneficiary_account": "1172993826",
                "beneficiary_bank": "bni",
                "beneficiary_email": "beneficiary@example.com",
                "amount": '90',
                "notes": "Payout April 17"
                }
          ]
        }
        // Axios.post('https://crossorigin.me/https://app.sandbox.midtrans.com/iris/api/v1/payouts', body, {auth: {username: 'Basic SVJJUy04M2YxMzVlZC0zNTEzLTQ3YmYtODFiYi1hMDcxODIyZWU2OGY6', password:''}})
        Axios.post('https://app.sandbox.midtrans.com/iris/api/v1/payouts', body, options)
        .then((res)=>{
            console.log(res.data)
        }).catch((err)=>{
            console.log(err)
        })

        // Axios.post(URL_API+'/payment/payout')
        // .then((res)=>{
        //     console.log(res.data)
        // }).catch((err)=>{
        //     console.log(err)
        // })

    }
    render(){
        return(
            <div className='container mt-5'>
                <center className='mt-5'>
                    <Input type='number' ref='nominal' onChange={(e)=> this.setState({nominal: e.target.value})} size='md'/>
                    <Button onClick={this.onClickPayout} color='success' className='mt-3'>Cairkan Dana</Button>
                </center>
            </div>
        )
    }
}

export default Payout;