import React, {Component} from 'react'
import {Input, Button, Table} from 'reactstrap'
import Axios from 'axios'
import {URL_API} from '../../helpers/Url_API'

class Payout extends Component{
    state={
        nominal:0,
        nama:'',
        pendingPayout:[],
        otp:''

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
                "beneficiary_name": this.state.nama,
                "beneficiary_account": "1298987678",
                "beneficiary_bank": "bni",
                "beneficiary_email": "beneficiary@apake.com",
                "amount": this.state.nominal,
                "notes": "Payout April 17"
                }
                // {
                //     "beneficiary_name": 'okay',
                //     "beneficiary_account": "",
                //     "beneficiary_bank": "bni",
                //     "beneficiary_email": "beneficiary@example.com",
                //     "amount": '890989',
                //     "notes": "Payout April 17"
                //     }
          ]
        }
        // Axios.post('https://crossorigin.me/https://app.sandbox.midtrans.com/iris/api/v1/payouts', body, {auth: {username: 'Basic SVJJUy04M2YxMzVlZC0zNTEzLTQ3YmYtODFiYi1hMDcxODIyZWU2OGY6', password:''}})
        // Axios.post('https://cors-anywhere.herokuapp.com/https://app.sandbox.midtrans.com/iris/api/v1/payouts', body, options)
        // .then((res)=>{
        //     console.log(res.data)
        // }).catch((err)=>{
        //     console.log(err)
        // })

        Axios.post(URL_API+'/payment/payout', body)
        .then((res)=>{
            console.log(res.data)
            this.setState({pendingPayout: res.data})
        }).catch((err)=>{
            console.log(err)
        })

    }

    renderPayout = () =>{
        let body={
                "from_date": "2019-10-31",
                "to_date": "2016-11-1"
        }
        Axios.post(URL_API+'/payment/payout', body)
        .then((res)=>{
            console.log(res.data)
            // this.setState({pendingPayout: res.data})
        }).catch((err)=>{
            console.log(err)
        })
        // if(this.state.pendingPayout.length !== 0){
            // return this.state.pendingPayout.map((val)=>{
            //     return (
            //         <tr>
            //             <td>{val.status}</td>
            //             <td>{val.reference_no}</td>
            //         </tr>
            //     )
            // })
        // }
    }
    render(){
        console.log(this.state.pendingPayout)
        return(
            <div className='container mt-5'>
                <center className='mt-5'>
                    <Input type='text' ref='nominal' onChange={(e)=> this.setState({nama: e.target.value})} size='md' placeholder='nama' className='mb-1'/>
                    <Input type='number' ref='nominal' onChange={(e)=> this.setState({nominal: e.target.value})} size='md' placeholder='nominal'/>
                    <Button onClick={this.onClickPayout} color='success' className='mt-3'>Cairkan Dana</Button>
                    <Table className='mt-5'>
                        {/* {this.state.pendingPayout.length !== 0 ? this.renderPayout() : null} */}
                        <tr>
                            <td>
                                <Input type='text' placeholder='input OTP' onChange={(e)=> this.setState({otp: e.target.value})}/>
                            </td>
                        </tr>
                    </Table>
                    <Button onClick={this.renderPayout} color='warning'>Approve all</Button>
                </center>
            </div>
        )
    }
}

export default Payout;