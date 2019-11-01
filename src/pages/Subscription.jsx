import React, { Component } from 'react';
import Numeral from 'numeral'
import { connect } from 'react-redux'
import { getSub, applySub } from '../redux/actions' 
import { Redirect, Link } from 'react-router-dom'
import { Switch } from '@material-ui/core'
import { InputGroup, InputGroupAddon, Button, Input, Progress } from 'reactstrap';
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API';


import {
    FacebookShareButton,
    WhatsappShareButton,
    FacebookIcon,
    WhatsappIcon
} from 'react-share';

import moment from 'moment'


import numeral from 'numeral'
import 'moment/locale/id'


class Subscription extends Component {
    state = { 
        redirectHome: false,
        lain : false,
        nominal : 0,
        nominalDisplay : '0',
        userSubList : []
    }

    componentDidMount(){
        if(!this.props.email){
            return this.setState({ redirectHome: true })
        }
        this.props.getSub(this.props.email)
        this.getSubscribeList()
        // this.getScholarshipList()
        // console.log(this.props.applySub())
    }

    getSubscribeList = () =>{
        Axios.get(URL_API + '/subscription/subscribelist/' + this.props.id)
        .then((res)=>{
            console.log(res.data.result)
            this.setState({
                userSubList : res.data.result
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    cancelSubscription = async (id) =>{
        var confirmation = window.confirm('apakah anda yakin untuk cancel subscription ini ?')
        if(confirmation){

            try{
    
                await Axios.post(URL_API + '/subscription/cancelsubscription', { id })
                this.getSubscribeList()
                window.alert('cancel success')
    
            }
            catch(err){
                window.alert(err)
            }
        }
    }

    renderUserSubList = () =>{
        if(this.state.userSubList.length !== 0) {
            return this.state.userSubList.map((val, id)=>{
                return (
                    <div className='row border border-secondary p-3'>
                    <div className='col-4'>
                        <img src={`${URL_API}${val.studentImage}`} alt={`${val.studentImage}-banner`} className='img-fluid width-100' style={{height : '285px'}}/>
                    </div>

                    <div className='col-8'>
                        <h2 className="mb-2">{val.judul}</h2>
                    
                     
                
                     
                        {/* <p className='font-weight-bold'>{val.projectCreator}</p>
                        <h6>Project Created</h6> */}
                        {/* <p>{new Date(val.projectCreated).toLocaleDateString('id-IND')}</p>
                        <h6>Project Ended</h6>
                        <p>{new Date(val.projectEnded).toLocaleDateString('id-IND')}</p> */}
                        <p>{val.nominal}</p>
                        <Progress  className="font-weight-bold mb-3" animated value={(parseInt(val.currentSubs + val.totaldonation) / val.targetScholarship) * 100 ? ((parseInt(val.currentSubs + val.totaldonation) / val.targetScholarship) * 100).toFixed(2)  : 0} >
                        {(parseInt(val.currentSubs + val.totaldonation) / val.targetScholarship) * 100 ? ((parseInt(val.currentSubs + val.totaldonation) / val.targetScholarship) * 100).toFixed(2)  : 0}%
                        </Progress>
                        <div className="d-flex flex-row mb-3">
                            <div className="mr-4">
                                <h4>Dana yang terkumpul </h4>
                                <input type="text" className="form-control" value={`Rp. ${numeral(parseInt(val.currentSubs + val.totaldonation)).format(0,0)}`} disabled/>
                            </div>

                            <div>
                                <h4>Dana yang dibutuhkan :  </h4>
                                <input type="text" className="form-control" value={`Rp. ${numeral(parseInt(val.targetScholarship)).format(0,0)}`} disabled/>
                            </div>
                        </div>
                        <h5>Nominal Subscribe Anda</h5>
                        <input type="button" className="form-control mb-3" value={`Rp ${numeral(parseInt(val.userSubs)).format(0,0)}`} disabled style={{width : 'auto'}}/>
                        <div className="row">
                            <div className="col-md-12">
                                <h5>Subscription Reminder Date</h5>
                            </div>
                            <div className="col-md-4">

                                <input type="button" className="form-control mb-3" value={moment(val.Date).locale('id').format("Do MMMM YYYY")} disabled style={{width : 'auto'}}/>
                                
                            </div>
                            <div className="col-md-8 d-flex flex-row justify-content-end">

                                <input type="button" className="btn btn-danger font-weight-bolder" value={'Cancel Subscription'} onClick={()=>this.cancelSubscription(val.subsId)}/>

                            </div>
                        </div>
               
                        {/* <h5>Banyaknya Donasi </h5>
                        <div className="text-gray mb-3"> {val.totalDonasi} Donasi </div> */}
                        {/* <h5>Sisa Hari </h5>
                        <div className="text-gray mb-3"> {val.SisaHari} Hari </div> */}
                        {/* <div className="row"> */}
                            {/* <div className="col-md-5">
                                <input type="button" className="btn btn-dark form-control font-weight-bolder" value="Contribute" />
                            </div> */}
                            {/* <div className="col-md-7">
                                <div className=" d-flex flex-row">
                                    <div>
                                        <FacebookShareButton  className='btn btn-primary mr-2'>
                                            <div className="d-flex flex-row">
                                                <FacebookIcon size={32} round={true}  />
                                                <div className="pt-1 ml-2">Share Facebook</div>
                                            </div>
                                        </FacebookShareButton>
                                        <WhatsappShareButton className='btn btn-success'>
                                            <div className="d-flex flex-row">
                                                <WhatsappIcon size={32} round={true}  />
                                                <div className="pt-1 ml-2">Share Whatsapp</div>
                                            </div>
                                        </WhatsappShareButton>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                   

                       

                     
                    </div>
                </div>
                )
            })
        }
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
        // var date = this.refs.inputremainderdate.value
        // console.log(date)
        // var randInt = Math.floor(Math.random()*(999-100+1)+100)
        var gross_amount = 0
        if(this.state.lain){
            // var subPriceBebas = this.refs.nominalBebas.value
            
            gross_amount = parseInt(this.state.nominal)
        }else{
            gross_amount = this.refs.nominal.value
        }

        //console.log(gross_amount)

        this.props.applySub(gross_amount, this.props.email, this.reminderDate.value)
        alert('Anda berhasil Subscribe. Terima Kasih')
        this.setState({
            redirectHome: true
        })
    }

    handleChange = () => {
        var check = this.state.lain
        this.setState({ lain: !check })
    } 

    
    allowPositivesOnly(event) {
        return (event.keyCode? (parseInt(event.keyCode) === 69 ? false : event.keyCode >= 48 && event.keyCode <= 57) : (event.charCode >= 48 && event.charCode <= 57))? true : event.preventDefault();
    }

    render() { 
   
     
        return ( 
            <div className='container'>
                {/* <form style={{width: '100%'}}>
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
                            <Input style={{border : '1px 1px 1px 0 solid #CED4DA'}} hidden={!this.state.lain} innerRef='nominalBebas' ref='nominalBebas' onChange={(text)=>this.formatDisplay(text.target.value)} onKeyPress={this.allowPositivesOnly} value={this.state.nominalDisplay}/>
                        </InputGroup> */}
                        {/* <input type='text' hidden={!this.state.lain} defaultValue={`Rp. ${this.state.nominalDisplay}`} className='form-control' ref='nominalBebas' onChange={(text)=>this.formatDisplay(text.target.value)} onKeyPress={this.allowPositivesOnly}/> */}
                            {/* <Switch 
                                onChange={this.handleChange}
                                inputProps={{ 'aria-label' : 'secondary checkbox' }}
                            />
                        <span className="text-gray">Klik Untuk Pilih Nominal </span>
                    </div>

                    <label>Pada tanggal berapa anda ingin diingatkan</label>
                    <input type='date' className='form-control' ref={(reminderDate) => this.reminderDate = reminderDate }/>

                    <div className='form-group'>
                        <div className='d-flex justify-content-center'>
                            <input type='button' onClick={this.renderMidtrans} className='btn btn-primary' value='Berlangganan Sekarang' />
                        </div>
                    </div>
      
                </form> */}

                <h3>Your Subscription List</h3>
                <div>
                    {this.renderUserSubList()}
                </div>
            </div>
         );
    }
}

const mapStatetoProps = ({ auth, sub }) => {
    return{
        id: auth.id,
        nama: auth.nama,
        email: auth.email,
        subStatusFromDb: auth.subscriptionStatus,
        subNominalFromDb: auth.subscriptionNominal,
        subStatus: sub.subscriptionStatus,
        subNominal: sub.subscriptionNominal
    }
}
 
export default connect(mapStatetoProps, { applySub, getSub })(Subscription);
