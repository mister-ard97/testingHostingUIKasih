import React, {Component} from 'react'
import {Button, Input} from 'reactstrap'
import Axios from 'axios'
import {Switch} from '@material-ui/core'
import { URL_API } from '../helpers/Url_API'

class Payment extends Component {
    state = {
        nominal:0,
        anonim: false,
        name:'qiandra'
    }

    renderMidtrans = () =>{
        
        var randInt = Math.floor(Math.random()*(999-100+1)+100)
        var parameter = {
            parameter:{
                transaction_details: {
                  order_id : 'dev-'+randInt,
                  gross_amount: parseInt(this.state.nominal)
                },
                item_details: [
                  {
                    id: 'camp-'+randInt,
                    price: parseInt(this.state.nominal),
                    quantity: 1,
                    name: "Donasi satu"
                  }
                ],
                customer_details: {
                  first_name: this.state.anonim ? 'anonim' : this.state.name,
                  email: "user2@qyans.com"
                },
                // gopay: {
                //   enable_callback: true,
                //   // callback_url: "https://hisbudev.herokuapp.com/finish"
                //   callback_url: `http://ec2-13-251-27-243.ap-southeast-1.compute.amazonaws.com:3000/finish`
                // }
              },
            userData:{
                userId: '1',
                projectId: '2'
            }
        }
        
          console.log(parameter)
          Axios.post(`${URL_API}/payment/getSnapMd`, parameter)
          .then((res)=>{
            console.log(res.data)
            localStorage.setItem('order_id', res.data.order_id)
            window.snap.pay(res.data.transactionToken, {
              onSuccess: (result) => {
                console.log('success')
                console.log(result)
                console.log(result.finish_redirect_url)
                console.log(document.getElementById('apagitu'))
                var link = result.finish_redirect_url.split('?')[1]
                document.getElementById('apagitu').innerHTML = result.finish_redirect_url;
                this.setState({lompatan: `/finish?${link}`})
               }
               ,
               onPending: function(result){
                 console.log('pending')
                 console.log(result)
                 
                console.log(result.finish_redirect_url)
                var link = result.finish_redirect_url.split('?')[1]
                document.getElementById('apagitu').innerHTML = result.finish_redirect_url;
                this.setState({lompatan: `/unfinish?${link}`})
                },
                onError: function(result){
                 console.log('error')
                 console.log(result)
                 console.log(result.finish_redirect_url)
                 var link = result.finish_redirect_url.split('?')[1]
                document.getElementById('apagitu').innerHTML = result.finish_redirect_url;
                this.setState({lompatan: `/error?${link}`})
                }
             
            })
          }).catch((err)=>{
            console.log(err)
          })
    }

    renderPayment = () => {
        return (
            <div className='row'>
                <div className='offset-md-2 col-md-8 p-3' >
                    <div className='titleProject'>
                        Penggalangan dana untuk Biaya kuliah untuk anak berprestasi
                    </div>
                    <div className='inputBoxNominal mt-3'>
                        <div className='rpNominal'>Rp. </div>
                        <Input className='inputNominal' type='text' ref='nominal' placeholder='0' onChange={(e)=>this.setState({nominal: `${e.target.value}`})}/>
                    </div>
                    <div className='mt-3' >
                        <div style={{fontWeight:'bold'}}>Qiandra</div>
                        <div style={{fontStyle:'itelix'}}>qiandra@qyans.com</div>
                        <div className='d-flex justify-content-between mt-3'>
                            <div> sembunyikan mana saya (donasi sebagai anonim)</div>
                            <div>
                                <Switch
                                    checked={this.state.anonim}
                                    onChange={this.handleChangeAnonim}
                                    value="checkedA"
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='buttonPayment'>
                        <Button color='danger'  onClick={this.renderMidtrans}>Lanjutkan Pembayaran</Button>   
                    </div>
                </div>
            </div>
        )
    }

    handleChangeAnonim = () => {
        let check = this.state.anonim
        this.setState({anonim: !check})
    }
    
    render(){
        console.log(this.state.nominal)
        console.log(typeof(parseInt(this.state.nominal)))
        console.log(this.state.anonim)
        return(
            <div className='container mt-4'>
                
                    {this.renderPayment()}
                
            </div>
        )
    }
}

export default Payment;