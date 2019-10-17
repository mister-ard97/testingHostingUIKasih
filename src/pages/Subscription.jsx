import React, { Component } from 'react';
import Numeral from 'numeral'
import { connect } from 'react-redux'
import { applySub, getSub } from '../redux/actions' 

class Subscription extends Component {
    state = { 
        
    }

    componentDidMount(){
        if(!this.props.email){
            return null
        }
        this.props.getSub(this.props.email)
    }

    getSubPrice = () => {
        var subPrice = this.subPrice.value
        this.props.applySub(subPrice, this.props.email)
    }

    render() { 
        if(this.props.subStatus === 1){
            return(
                <div>
                    subscriptionStatus: {this.props.subStatus}

                    subscriptionNominal: Rp. {Numeral(this.props.subNominal).format(0,0)}
                </div>
            )
        }
        return ( 
            <>
            <select className='form-control' name="select" ref={(subPrice) => this.subPrice=subPrice} >
                <option value={100000}>Rp.{Numeral(100000).format('0,0')}</option>
                <option value={250000}>Rp.{Numeral(250000).format('0,0')}</option>
                <option value={500000}>Rp.{Numeral(500000).format('0,0')}</option>
                <option value={750000}>Rp.{Numeral(750000).format('0,0')}</option>
                <option value={1000000}>Rp.{Numeral(1000000).format('0,0')}</option>
            </select>
            <button onClick={this.getSubPrice}>
                Click
            </button>
            </>
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
