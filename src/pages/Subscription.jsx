import React, { Component } from 'react';
import Numeral from 'numeral'
import { connect } from 'react-redux'
import { applySub, getSub } from '../redux/actions' 
import { Redirect } from 'react-router-dom'
import { Switch } from '@material-ui/core'

class Subscription extends Component {
    state = { 
        redirectHome: false,
        lain : false
    }

    componentDidMount(){
        if(!this.props.email){
            return this.setState({ redirectHome: true })
        }
        this.props.getSub(this.props.email)
    }

    getSubPrice = () => {
        if(!this.props.email){
            return null
        }
        if(this.state.lain){
            var subPriceBebas = this.refs.nominalBebas.value
            if(subPriceBebas < 10000){
                return window.alert('Harus diatas Rp. 10.000')
            }
            console.log(subPriceBebas, this.props.email)
            return this.props.applySub(subPriceBebas, this.props.email)
        }
        var subPrice = this.refs.nominal.value
        console.log(subPrice)
        this.props.applySub(subPrice, this.props.email)
    }

    handleChange = () => {
        var check = this.state.lain
        this.setState({ lain: !check })
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
                        <input type='number' hidden={!this.state.lain} defaultValue={10000} className='form-control' ref='nominalBebas'/>
                            <Switch 
                                onChange={this.handleChange}
                                inputProps={{ 'aria-label' : 'secondary checkbox' }}
                            />
                    </div>
                    <div className='form-group'>
                        <div className='d-flex justify-content-center'>
                            <input type='button' onClick={this.getSubPrice} className='btn btn-primary' value='Berlangganan Sekarang' />
                                
                        </div>
                    </div>
                </form>
            </div>
         );
    }
}

const mapStatetoProps = ({ auth, sub }) => {
    return{
        email: auth.email,
        subStatus: sub.subscriptionStatus,
        subNominal: sub.subscriptionNominal
    }
}
 
export default connect(mapStatetoProps, { applySub, getSub })(Subscription);
