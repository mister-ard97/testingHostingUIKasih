import React, { Component } from 'react';
import Numeral from 'numeral'
import { connect } from 'react-redux'
import { applySub, getSub } from '../redux/actions' 
import { Redirect, Link } from 'react-router-dom'
import { Switch } from '@material-ui/core'
import { InputGroup, InputGroupAddon, Button, Input } from 'reactstrap';
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API';

class Subscription extends Component {
    state = { 
        redirectHome: false,
        lain : false,
        nominal : 0,
        nominalDisplay : '0'
    }

    componentDidMount(){
        if(!this.props.email){
            return this.setState({ redirectHome: true })
        }
        this.props.getSub(this.props.email)
    }

    formatDisplay (num) {
        let number = parseInt(num.split(',').join('')) 

        if (num.split(',').join('') === '' ) {
            this.setState({nominalDisplay: '0', nominal: 0})
        } else {
            this.setState({
                nominalDisplay: number.toLocaleString(),
                nominal: number
            })
        }
    }

    getSubPrice = () => {

        if(this.state.nominal < 10000){
            return window.alert('Harus diatas Rp. 10.000')
        }
        
        return this.props.applySub(this.state.nominal, this.props.email)

    }
    
    renderMidtrans = () =>{
        if(!this.props.email){
            return null
        }
        var randInt = Math.floor(Math.random()*(999-100+1)+100)
        var gross_amount = 0
        if(this.state.lain){
            // var subPriceBebas = this.refs.nominalBebas.value
            
            gross_amount = this.refs.nominalBebas.value
        }else{
            gross_amount = this.refs.nominal.value
        }
        var parameter = {
            parameter:{
                transaction_details: {
                  order_id : 'dev-'+randInt,
                  gross_amount
                },
                item_details: [
                  {
                    id: 'camp-'+randInt,
                    price: gross_amount,
                    quantity: 1,
                    name: "Subscription"
                  }
                ],
                customer_details: {
                  first_name: this.props.nama,
                  email: this.props.email
                },
                // gopay: {
                //   enable_callback: true,
                //   // callback_url: "https://hisbudev.herokuapp.com/finish"
                //   callback_url: `http://ec2-13-251-27-243.ap-southeast-1.compute.amazonaws.com:3000/finish`
                // }
              },
            userData:{
                userId: this.props.id,
                projectId: 2,
                komentar: '-' ,
                anonim: 0
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
                Axios.post(`${URL_API}/payment/updatePayment`, result)
                .then((res)=>{
                    console.log(res.data)
                })
                .catch((err)=>{
                    console.log(err)
                })
                var link = result.finish_redirect_url.split('?')[1]
                document.getElementById('apagitu').innerHTML = result.finish_redirect_url;
                this.setState({lompatan: `/finish?${link}`})
                this.props.applySub(gross_amount, this.props.email)
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

    getSubPrice = () => {
    
        // if(this.state.lain){
        //     var subPriceBebas = this.refs.nominalBebas.value
        //     if(subPriceBebas < 10000){
        //         return window.alert('Harus diatas Rp. 10.000')
        //     }
        //     console.log(subPriceBebas, this.props.email)
        //     return this.props.applySub(subPriceBebas, this.props.email)
        // }
        // var subPrice = this.refs.nominal.value
        // console.log(subPrice)
        // this.props.applySub(subPrice, this.props.email)
    }

    handleChange = () => {
        var check = this.state.lain
        this.setState({ lain: !check })
    } 

    
    allowPositivesOnly(event) {
        return (event.keyCode? (parseInt(event.keyCode) === 69 ? false : event.keyCode >= 48 && event.keyCode <= 57) : (event.charCode >= 48 && event.charCode <= 57))? true : event.preventDefault();
    }

    render() { 
        console.log(this.props.email)
        if(this.state.redirectHome){
            return(
                <Redirect to='/login' />
            )
        }
        if(this.props.subStatus === 1){
            return(
                <div className='container'>
                <form style={{width: '100%'}}>
                    <div className='form-control'>
                        Nominal langganan anda adalah : Rp. {Numeral(this.props.subNominal).format('0,0')}
                    </div>
                </form>
            </div>
            )
        }
        return ( 
            <div className='container'>
                <form style={{width: '100%'}}>
                    <div className='form-group'>
                    <label for="exampleInputEmail1">Silahkan pilih jumlah nominal langganan</label>
                        <select className='form-control' name="select" ref='nominal' hidden={this.state.lain}>
                            <option value={100000}>Rp.{Numeral(100000).format('0,0')}</option>
                            <option value={250000}>Rp.{Numeral(250000).format('0,0')}</option>
                            <option value={500000}>Rp.{Numeral(500000).format('0,0')}</option>
                            <option value={750000}>Rp.{Numeral(750000).format('0,0')}</option>
                            <option value={1000000}>Rp.{Numeral(1000000).format('0,0')}</option>
                        </select>
                        <InputGroup>
        <InputGroupAddon addonType="prepend">
          <Button className="bg-white text-dark border-right-0"  hidden={!this.state.lain} disabled style={{borderColor : '#CED4DA' , border : '1px solid #CED4DA', opacity: 1}}>Rp. </Button>
        </InputGroupAddon>
        <Input style={{border : '1px 1px 1px 0 solid #CED4DA'}} hidden={!this.state.lain} ref='nominalBebas' onChange={(text)=>this.formatDisplay(text.target.value)} onKeyPress={this.allowPositivesOnly} value={this.state.nominalDisplay}/>
      </InputGroup>
                        {/* <input type='text' hidden={!this.state.lain} defaultValue={`Rp. ${this.state.nominalDisplay}`} className='form-control' ref='nominalBebas' onChange={(text)=>this.formatDisplay(text.target.value)} onKeyPress={this.allowPositivesOnly}/> */}
                            <Switch 
                                onChange={this.handleChange}
                                inputProps={{ 'aria-label' : 'secondary checkbox' }}
                            />
                        <span className="text-gray">Klik Untuk Pilih Nominal </span>
                    </div>
                    <div className='form-group'>
                        <div className='d-flex justify-content-center'>
                            <input type='button' onClick={this.renderMidtrans} className='btn btn-primary' value='Berlangganan Sekarang' />
                        </div>
                    </div>
      
                </form>
            </div>
         );
    }
}

const mapStatetoProps = ({ auth, sub }) => {
    return{
        id: auth.id,
        nama: auth.nama,
        email: auth.email,
        subStatus: sub.subscriptionStatus,
        subNominal: sub.subscriptionNominal
    }
}
 
export default connect(mapStatetoProps, { applySub, getSub })(Subscription);
