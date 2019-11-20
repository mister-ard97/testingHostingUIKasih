import React, { Component } from 'react';
import Axios from 'axios';
// import {Link} from 'react-router-dom'
import Numeral from 'numeral'
import { connect } from 'react-redux';
import Moment from 'moment'
import { URL_API, UI_LINK } from '../helpers/Url_API';
import {
    FacebookShareButton,
    WhatsappShareButton,
    FacebookIcon, 
    WhatsappIcon
} from 'react-share';

import queryString from 'query-string';
import { Progress } from 'reactstrap';
import numeral from 'numeral';
import { Switch } from '@material-ui/core';
import {Modal, ModalBody, ModalHeader, ModalFooter, Input, InputGroup, Button, InputGroupAddon} from 'reactstrap'

class ScholarshipDetailHome extends Component {

    state = {
        objSubscription: {},
        ScholarshipDetail: null,
        SubscriptionModal: false,
        nominalSubscription: null,
        listDonasi: '',

        nominalLain: false,
        nominalDisplay: '0'
    }

    componentDidMount() {
        let params = queryString.parse(this.props.location.search)
        console.log(params.id)
        let token = localStorage.getItem('token')
        var options = {
            headers : {
                "Authorization" : `Bearer ${token}`
            }
        }

        Axios.get(URL_API + '/scholarship/getScholarshipDetail?id='+ params.id)
        .then((res) => {
            // console.log(res.data)
            // console.log(res.data[0])
            var hasil = res.data[0]
            hasil.totaldonation = parseInt(hasil.totaldonation)
            // if(hasil.Subscriptions.length !== 0){

            //     hasil.currentSubs = hasil.Subscriptions[0].currentSubs
            //     hasil.totaldonation = parseInt(hasil.currentSubs) + parseInt(hasil.totaldonation)
            // }else {
            //     hasil.grandtotal = hasil.totaldonation
            // }
            // delete hasil.Subscriptions
            
            this.setState({ScholarshipDetail: hasil})
        })
        .catch((err) => {
            console.log(err)
        })

        Axios.get(URL_API + '/user/getSubscription/'+params.id , options)
            .then((subscription) => {
                console.log(subscription)
                console.log(subscription.data.result)

                if(subscription.data.result){

                    this.setState({
                        nominalSubscription: subscription.data.result.nominalSubscription
                    })

                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    getNamaScholarship = (scholarId, scholarName) => {
        let nama = {
            scholarId,
            scholarName
        }
        localStorage.setItem('namaScholarship', JSON.stringify(nama))

    }

    // --------------------------------- Function dari Subscription.jsx ==============================

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

    allowPositivesOnly(event) {
        return (event.keyCode? (parseInt(event.keyCode) === 69 ? false : event.keyCode >= 48 && event.keyCode <= 57) : (event.charCode >= 48 && event.charCode <= 57))? true : event.preventDefault();
    }

    handleChange = () => {
        var check = this.state.nominalLain
        this.setState({ nominalLain: !check })
    } 

    // --------------------- Function dari Subscription ------------------------------------------------

    renderMidtransSubscription = () =>{
        // var id = this.props.location.search.split('=')[1]
        console.log('--------------------- Jalan ----------------------------')
        var gross_amount = 0
        if(this.state.nominalLain){
            // var subPriceBebas = this.refs.nominalBebas.value
            gross_amount = parseInt(this.state.nominal)
        }else{
            gross_amount = this.refs.nominal.value
        }

        console.log(this.state.objSubscription)
        var randInt = Math.floor(Math.random()*(999-100+1)+100)
        // this.setState({orderId: 'dev'+randInt})
        var parameter = {
            parameter:{
                transaction_details: {
                  order_id :'dev'+randInt,
                  gross_amount: gross_amount // input user
                },
                // item_details: [
                //   {
                //     id: 'camp-'+randInt,
                //     price: 300000, //input user
                //     quantity: 1,
                //     name: "Subscription " + randInt
                //   }
                // ],
                // customer_details: {
                //   first_name: this.props.nama,
                //   email: this.props.email
                // },
              },
            userData:{
                userId: this.props.id,
                scholarshipId: this.state.objSubscription.id,
                remainderDate : this.reminderDate.value, // input user
                monthLeft : this.state.objSubscription.durasi, // input user,
                paymentSource : "Subscription"

            }
        }

        console.log(parameter)
        const token = localStorage.getItem('token');
       const options = {
           headers: {
               'Authorization': `Bearer ${token}`,
           }
       }

          Axios.post(`${URL_API}/subscription/usersubscribe`, parameter, options)
          .then((res)=>{
            console.log(res.data)

            this.setState({
                SubscriptionModal : false, 
                nominalLain: false, 
                objSubscription: {}
            })
            
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

    subscriptionDetails = () =>{
        if(!this.state.nominalSubscription){

        }else{
            
        }
    }

    modalSubscription = (params) => {
        if(params) {
            if(!this.state.nominalSubscription){

                return (
                    <Modal isOpen={this.state.SubscriptionModal} toggle={()=>this.setState({ SubscriptionModal : false, nominalLain: false, objSubscription: {} })} >
                        <ModalHeader>
                            Subscription Nominal
                        </ModalHeader>
                        <ModalBody>
                             <h5>Pilih Nominal Yang anda inginkan</h5>
                             
                             <select className='form-control' name="select" ref='nominal' hidden={this.state.nominalLain}>
                                <option value={100000}>Rp.{Numeral(100000).format('0,0')}</option>
                                <option value={250000}>Rp.{Numeral(250000).format('0,0')}</option>
                                <option value={500000}>Rp.{Numeral(500000).format('0,0')}</option>
                                <option value={750000}>Rp.{Numeral(750000).format('0,0')}</option>
                                <option value={1000000}>Rp.{Numeral(1000000).format('0,0')}</option>
                            </select>
    
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                <Button className="bg-white text-dark border-right-0"  hidden={!this.state.nominalLain} disabled style={{borderColor : '#CED4DA' , border : '1px solid #CED4DA', opacity: 1}}>Rp. </Button>
                                </InputGroupAddon>
                                <Input style={{border : '1px 1px 1px 0 solid #CED4DA'}} hidden={!this.state.nominalLain} innerRef='nominalBebas' ref='nominalBebas' onChange={(text)=>this.formatDisplay(text.target.value)} onKeyPress={this.allowPositivesOnly} value={this.state.nominalDisplay}/>
                            </InputGroup>
    
                            <Switch 
                                    onChange={this.handleChange}
                                    inputProps={{ 'aria-label' : 'secondary checkbox' }}
                            />
                            Klik untuk nominal lainnya
    
                            <p>Pada tanggal berapa anda ingin diingatkan</p>
                            <input type='date' className='form-control' ref={(reminderDate) => this.reminderDate = reminderDate }/>
                            
                            <small>
                                Untuk Subscribe pertama, Anda harus bayar terlebih dahulu. 
                                Dan nanti akan diberikan notifikasi lewat email
                            </small>
    
    
                        </ModalBody>
                        <ModalFooter>
                            <input type="button" value="Subscribe" className="form-control btn btn-danger" onClick={() => this.renderMidtransSubscription()}/>
                        </ModalFooter>
                    </Modal>
                )
            }else {
                return (
                    <Modal isOpen={this.state.SubscriptionModal} toggle={()=>this.setState({ SubscriptionModal : false, nominalLain: false, objSubscription: {} })} >
                        <ModalHeader>
                            Anda telah melakukan subscribe pada scholarship ini 
                        </ModalHeader>
                        <ModalBody>
                            <h5>Nominal Subscribe Sebesar : </h5>
                            <input type="text" className="form-control" value={this.state.nominalSubscription} disabled />
                             
    
                        </ModalBody>
                        <ModalFooter>
                            <a href={`/payment?id=${this.state.ScholarshipDetail.id}&scholarshipName=${this.state.ScholarshipDetail.judul}&type=subscription`}>
                            <input type="button" value="Pembayaran" className="form-control btn btn-danger"/>
                            </a>
                        </ModalFooter>
                    </Modal>
                )
            }
        }
    }

    renderScholarshipDetails = () => {
        // let params = queryString.parse(this.props.location.search)
        if(this.state.ScholarshipDetail) {
            console.log(this.state.ScholarshipDetail)
            const {namaSiswa, studentImage} = this.state.ScholarshipDetail.Student
            const { namaSekolah } = this.state.ScholarshipDetail.School
            const {
                id, 
                judul, 
                nominal, 
                description, 
                shareDescription, 
                durasi, 
                scholarshipStart, 
                scholarshipEnded,
                // grandtotal,
                // currentSubs,
                jumlahdonation,
                totaldonation,
                SisaHari

            } = this.state.ScholarshipDetail

            return (
                    <div className='card mt-3 text-dark text-left py-5 px-5'>
                        {console.log(this.state.ScholarshipDetail)}
                        <div className='row'>
                            <div className='col-2'>
                                <img src={`${URL_API}${studentImage}`} alt={`${judul}-banner`} className='img-fluid'/>
                            </div>

                            <div className='col-10 img-small'>
                                <h5>{judul}</h5>
                                <p>{namaSekolah}</p>
                                <p>Nama Siswa : {namaSiswa}</p>
                                
                                <Progress  className="font-weight-bold mb-3" animated value={(totaldonation / nominal) * 100 ? (totaldonation / nominal) * 100  : 0} >
                                {(totaldonation / nominal) * 100 ? (totaldonation / nominal) * 100  : 0}%
                                </Progress>

                                <hr/>

                                <div className="d-flex flex-row mb-3">
                                    <div className="mr-4">
                                        <h4>Dana yang terkumpul </h4>
                                        <input type="text" className="form-control" value={`Rp. ${numeral(parseInt(totaldonation)).format(0,0)}`} disabled/>
                                    </div>

                                    <div>
                                        <h4>Dana yang dibutuhkan :  </h4>
                                        <input type="text" className="form-control" value={`Rp. ${numeral(parseInt(nominal)).format(0,0)}`} disabled/>
                                    </div>
                                </div>

                                <h6>Description</h6>
                                <div dangerouslySetInnerHTML={{__html: description ? description : null}}></div>
                                <hr/>
                                <p className='font-weight-bold'>Tanggal Dibuat</p>
                                <p>{new Date(scholarshipStart).toLocaleDateString('id-IND')}</p>
                                <hr/>
                                <p className='font-weight-bold'>Tanggal Berakhir</p>
                                <p>{new Date(scholarshipEnded).toLocaleDateString('id-IND')}</p>
                                <hr/>
                            
                                <h5>Banyaknya Donasi </h5>
                                <div className="text-gray mb-3"> {jumlahdonation} Donasi </div>
                                <h5>Sisa Hari </h5>
                                <div className="text-gray mb-3"> {SisaHari} Hari </div>

                                <FacebookShareButton url={`${UI_LINK}/scholarship-student?id=${id}`} className='btn btn-primary mr-2'>
                                    <div className="d-flex flex-row">
                                        <FacebookIcon size={32} round={true}  />
                                        <div className="pt-1 ml-2">Share Facebook</div>
                                    </div>
                                </FacebookShareButton>
                                <WhatsappShareButton url={`${UI_LINK}/scholarship-student?id=${id}`} className='btn btn-success'>
                                    <div className="d-flex flex-row">
                                        <WhatsappIcon size={32} round={true}  />
                                        <div className="pt-1 ml-2">Share Whatsapp</div>
                                    </div>
                                </WhatsappShareButton>


                                {
                                    this.props.email ?
                                    <a href={`/payment?id=${id}&scholarshipName=${judul}&type=donation`} onClick={() => this.getNamaScholarship(id, judul)}> 
                                        <button>
                                            Donasi
                                        </button>
                                    </a>
                                    :
                                    <a href={`/login`}> 
                                        <button>
                                            Donasi
                                        </button>
                                    </a>
                                }

                                {/* {
                                    this.props.email ?
                                        this.state.nominalSubscription === 0 ? */}
                                        <a onClick={() => this.setState({
                                            SubscriptionModal: true,
                                            objSubscription: {
                                                id,
                                                durasi   
                                            }
                                        })}> 
                                            <button>
                                                Subscribe ke {namaSiswa}
                                            </button>
                                        </a>
                                        {/* :
                                        null
                                    : */}
                                    {/* <a href={`/login`}> 
                                        <button>
                                            Subscribe ke {namaSiswa}
                                        </button>
                                    </a>
                                } */}
                                
                            </div>
                            </div>
                    </div>    
                )
        } else {
            return (
                        <h4>Loading...</h4>
                    )
        }
    }

    render() {
        // if(this.state.listDonasi.length === 0){
        //     return <h2>Loading</h2>
        // }


        return (
            <div className='container'>
                {this.modalSubscription(this.state.SubscriptionModal)}
                <div className='row'>
                    <div className='offset-2 col-8'>
                        {this.renderScholarshipDetails()}
                    </div>
                </div>
                {/* {
                    this.state.listDonasi.length !==0 ?
                    <div>
                        <div className='row mt-4'>
                            <div className='offset-2 col-8 containerListDonasi'>
                                    {this.renderDonasiList()}
                            </div>
                        </div>
                    </div>
                    :
                    null
                } */}
            </div>
        )
    }
}

const mapStateToProps = ({auth}) => {
return {
    id : auth.id,
    email: auth.email
}
}

export default connect(mapStateToProps)(ScholarshipDetailHome)