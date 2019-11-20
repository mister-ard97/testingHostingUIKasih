import React, {Component} from 'react'
import {Button, Input} from 'reactstrap'
import Axios from 'axios'
import {Switch, TextareaAutosize} from '@material-ui/core'
import { connect } from 'react-redux'
import { URL_API } from '../helpers/Url_API'
import { Redirect } from 'react-router-dom'
import io from 'socket.io-client'
import queryString from 'query-string'
import { ifStatement } from '@babel/types'

class Payment extends Component {
    state = {
        nominal:0,
        komentar:'',
        anonim: false,
        komentarBtn: false,
        name: this.props.nama,
        projectName: null,
        projectId: null,
        scholarshipName: null,
        scholarshipId: null,
        status:'',
        orderId:'',
        paymentSource : '',
        nominalSubscription : null,
        loadingSubsData : true,
        redirectLogin : false,
        redirectHome : false,

        check : false
    }

    componentDidMount(){
        // queryString.parse
        // console.log(queryString.parse(this.props.location.search).type)
        console.log(queryString.parse(this.props.location.search))
        console.log(window.location.href.length)
        console.log(window.location.href)
        // console.log(queryString.parse(this.props.location.search))
        var query = queryString.parse(this.props.location.search)
        if(query.type && query.id && (query.scholarshipName || query.projectName)){
            if(query.scholarshipName){
                this.setState({
                    scholarshipName: query.scholarshipName, 
                    scholarshipId: query.id, 
                    paymentSource : queryString.parse(this.props.location.search).type,
                })
            }else{
                this.setState({
                    projectName : query.projectName,
                    projectId : query.Id,
                    paymentSource : queryString.parse(this.props.location.search).type,
                })
            }

         
        }else {
            window.alert("URL IS NOT VALID")
            this.setState({
                redirectHome : true
            })
        }

        if(queryString.parse(this.props.location.search).type === 'subscription'){
            this.getUserSubscriptionNominal()
        }else {
            this.setState({
                loadingSubsData : false
            })
        }

     
        
        // ---------------------- NOTE -------------------------
        // mau pake parsed atau localStorage ?

        // var namaParse = JSON.parse(namaScholarship)

        // var nama = localStorage.getItem('nama')
        // var namaScholarship = localStorage.getItem('namaScholarship')

        // // let id = queryString.parse(this.props.location.search).id
        // // let namaScholarship = queryString.parse(this.props.location.search).scholarshipame
        // if(nama || namaScholarship || queryString.parse(this.props.location.search).id){

        //     if(namaScholarship) {
        //         console.log('a')
        //         var namaParse = JSON.parse(namaScholarship)
        //         this.setState({
        //             scholarshipName: namaParse.scholarName, 
        //             scholarshipId: namaParse.scholarId, 
        //             paymentSource : queryString.parse(this.props.location.search).type,
        //         })
        //     } else {
        //         console.log('b')
        //         var namaParse = JSON.parse(nama)
        //         this.setState({
        //             projectName: namaParse.projectName,
        //             projectId: namaParse.projectId,
        //             paymentSource : queryString.parse(this.props.location.search).type
        //         })
        //     }
            
        //     // console.log(namaParse.projectId, namaParse.projectName)
            
        // }
        
        if(!this.props.email){
        
            this.setState({ redirectLogin: true })
        }

        // localStorage.removeItem('nama')
        // localStorage.removeItem('namaScholarship')
        this.setState({
            check : true
        })
        const socket = io(URL_API)
        // console.log(socket)
        socket.on(`status_transaction`, this.updateStatus)
        console.log(localStorage.getItem('mp_9d99bb4fa589bb848422a53af867321e_mixpanel'))
        if(typeof window === 'undefined'){
            console.log('window')
        }
    }
    


    getUserSubscriptionNominal = async () =>{
        if(this.props.id){
            console.log(queryString.parse(this.props.location.search).id)
            var res = await Axios.post(URL_API + '/subscription/getnominal/'+queryString.parse(this.props.location.search).id, { id : this.props.id })
            // console.log(res.data.result.nominalSubscription)
            this.setState({
                loadingSubsData : false,
                nominalSubscription : res.data.result ? res.data.result.nominalSubscription : null,
                nominal : res.data.result ? res.data.result.nominalSubscription : null,
                paymentSource : 'subscription'
            })
        }
    }

    updateStatus=(status)=>{
    
        this.setState({status})
        console.log('socket Status ============== > ')
        console.log(status)
        // console.log(status.order_id)
        // if(status.order_id === this.state.orderId && status.transaction_status !== 'settlement' || status.transaction_status !== 'capture'){
            
        this.createPayment()
            console.log('masuk add')
        // }
      }

    createPayment = () => {
        console.log('---------------> Create Patment')
        const data={
            order_id: this.state.orderId,
            userId: this.props.id,
            gross_amount: parseInt(this.state.nominal),
            paymentType: `${this.state.status.payment_type} ${this.state.status.bank}`,
            statusPayment: this.state.status.transaction_status,
            projectId: this.state.projectId ? this.state.projectId : null,
            scholarshipId: this.state.scholarshipId ? this.state.scholarshipId : null, 
            komentar: this.state.komentar ? this.state.komentar : '-' ,
            anonim: this.state.anonim ? 1 : 0,
            noPembayaran: this.state.status.noPembayaran,
            paymentSource : "Donation" // SEMENTARA , NNATI DIUBAH BDSKAN QUERY UTK SUBSCRIPTION
        }
        console.log(data)

        Axios.post(`${URL_API}/payment/createPayment`, data)
        .then((res)=>{
            console.log(res.data)
        }).catch((err)=>{
            console.log(err)
        })
        
    }

    renderMidtrans = () =>{
        console.log(this.state.paymentSource)
        var id = this.props.location.search.split('=')[1]
        var randInt = Math.floor(Math.random()*(999-100+1)+100)
        this.setState({orderId: 'dev'+randInt})
        var parameter = {
            parameter:{
                transaction_details: {
                  order_id :'dev'+randInt,
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
                  email: this.props.email
                },
                // gopay: {
                //   enable_callback: true,
                //   // callback_url: "https://hisbudev.herokuapp.com/finish"
                //   callback_url: `http://ec2-13-251-27-243.ap-southeast-1.compute.amazonaws.com:3000/finish`
                // }
              },
            // userData:{
            //     userId: this.props.id,
            //     projectId: this.state.projectId ? this.state.projectId : null,
            //     scholarshipId: this.state.scholarshipId ? this.state.scholarshipId : null, 
            //     komentar: this.state.komentar ? this.state.komentar : '-' ,
            //     anonim: this.state.anonim ? 1 : 0,
            //     paymentSource : "Donation" // SEMENTARA , NNATI DIUBAH BDSKAN QUERY UTK SUBSCRIPTION
            // }
        }
        
          console.log(parameter)
          let token = localStorage.getItem('token')
          const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }

          Axios.post(`${URL_API}/payment/getSnapMd`, parameter, options)
          .then((res)=>{
            console.log(res.data)
            localStorage.setItem('order_id', res.data.order_id)
            // req.app.io.emit(`status_transaction_${res.data.order_id}`, res.data.order_id)
            // GAK DI PAKE UNTUK REDIRECT
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
                // var link = result.finish_redirect_url.split('?')[1]
                // document.getElementById('apagitu').innerHTML = result.finish_redirect_url;
                // this.setState({lompatan: `/finish?${link}`})
                
               }
               ,
               onPending: function(result){
                //  console.log('pending')
                //  console.log(result)
                 
              

                // console.log(result.finish_redirect_url)
                // var link = result.finish_redirect_url.split('?')[1]
                // document.getElementById('apagitu').innerHTML = result.finish_redirect_url;
                // this.setState({lompatan: `/unfinish?${link}`})
                },
                onError: function(result){
                //  console.log('error')
                //  console.log(result)
                //  console.log(result.finish_redirect_url)

                //  var link = result.finish_redirect_url.split('?')[1]
                // document.getElementById('apagitu').innerHTML = result.finish_redirect_url;
                // this.setState({lompatan: `/error?${link}`})
                }
             
            })
          }).catch((err)=>{
            console.log(err)
          })


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


    renderPayment = () => {
        return (
            <div className='row'>
                <div className='offset-md-2 col-md-8 p-3' >
                    <div className='titleProject'>
                        {this.props.location.state}
                        {console.log(this.props.location.state)}
                        {this.state.projectName ? this.state.projectName : this.state.scholarshipName}
                    </div>
                    <div className='inputBoxNominal mt-3'>
                        <div className='rpNominal'>Rp. </div>
                        {this.state.nominalSubscription && !this.state.loadingSubsData 
                        ?
                        <Input className='inputNominal' type='text'  oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" onChange={(text)=>this.formatDisplay(text.target.value)} ref='nominal' placeholder='0' value={this.state.nominalSubscription} disabled/>
                        :
                        <Input className='inputNominal' type='text'  oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');" onChange={(text)=>this.formatDisplay(text.target.value)} ref='nominal' placeholder='0' onChange={(e)=>this.setState({nominal: `${e.target.value}`})}/>
                    }
                        
                       
                    </div>
                    <div className='mt-3' >
                        <div style={{fontWeight:'bold'}}>{this.props.nama}</div>
                        <div style={{fontStyle:'itelix'}}>{this.props.email}</div>
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
                        <div className='d-flex justify-content-between'>
                            <div>Tulis Komentar (opsional)</div>
                            <div>
                                <Switch
                                    checked={this.state.komentarBtn}
                                    onChange={this.handleChangeKomentar}
                                    value="checkedB"
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                            </div>
                        </div>
                            <div hidden={!this.state.komentarBtn} style={{transition:'0.5s'}}>
                                <textarea placeholder="tulis Komentar"  maxLength='140' cols='80' rows='4' className='komentar' onChange={(e) => this.komentarChange(e)}/>
                                <p>{this.state.komentar.length}/140</p>
                            </div>
                    </div>
                    <div className='buttonPayment mt-5'>
                        <Button color='danger'  onClick={this.renderMidtrans}>Lanjutkan Pembayaran</Button>   
                    </div>
                </div>
            </div>
        )
    }

    komentarChange = (e) => {
        if(this.state.komentar.length < 140){
            this.setState({komentar: `${e.target.value}`})
        }
    }

    handleChangeAnonim = () => {
        let check = this.state.anonim
        this.setState({anonim: !check})
    }

    handleChangeKomentar = () => {
        let check = this.state.komentarBtn
        this.setState({komentarBtn: !check})
    }
    
    render(){
        console.log(this.state)
        if((this.state.paymentSource === "donation" || this.state.paymentSource === 'subscription') && this.state.check){
            console.log('masukmasuk')
            console.log(this.state.paymentSource, this.state.check)
            return(
                <div className='container mt-4'>
                    
                        {this.renderPayment()}
                    
                </div>
            )
           
        }
        
        if(this.state.redirectLogin){
            console.log('masuk1')
            return <Redirect to={{
                pathname : '/login',
                from : this.props.location.pathname + this.props.location.search
            }} />

        }
        if(this.state.redirectHome){
            console.log('masuk1')
            return <Redirect to={{
                pathname : '/',
                from : this.props.location.pathname + this.props.location.search
            }} />

        }

        if(this.state.status.transaction_status === 'settlement' && this.state.status.order_id === this.state.orderId){
            return <Redirect to={'/paymentFinish'}/>
        }
        if(this.state.status.transaction_status === 'pending' && this.state.status.order_id === this.state.orderId){
            return <Redirect to={`/paymentPending?trans=${this.state.orderId}`}/>
        }
        console.log(this.props.match)
        // if(this.state.check){
        //     console.log('masuk2')

        //     return(
        //         <Redirect to={{
        //             pathname : '/login',
        //             from : this.props.location.pathname + this.props.location.search
        //         }} />
        //     )
        // }
        console.log('masukmasuk3')
        return (
            
            <div className="mt-5">
                <h1>
                    Loading...
                </h1>
            </div>
        )
    }
}

const mapStatetoProps = ({ auth }) => {
    return{
        id: auth.id,
        nama: auth.nama,
        email: auth.email 
    }
}

export default connect(mapStatetoProps,{})(Payment);