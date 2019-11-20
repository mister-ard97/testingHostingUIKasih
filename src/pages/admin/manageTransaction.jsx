import React, {Component} from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import { URL_API } from '../../helpers/Url_API'
import { dateDiff } from '../../helpers/helpers'


class ManageTransaction extends Component{
    state = {
        transactionData : [],
        totalData : 0
    }

    componentDidMount(){
        if(this.props.id){
            let token = localStorage.getItem('token')
            const options = {
              headers: {
                  'Authorization': `Bearer ${token}`,
              }
          }
  

            Axios.get(URL_API + '/payment/getHistoryAdmin' , options)
            .then((res)=>{
                console.log(res.data)
                this.setState({
                    transactionData : res.data.result,
                    totalData : res.data.count
                })
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }

    printStatus = (status) =>{
        if(status === 'pending'){
            return (
                <div className="text-primary fs-25">
                    {status}
                </div>
            )
        }else if(status === 'settlement'){
            return (
                <div className="text-success fs-25">
                    {status}
                </div>
            )

        }else if(status === 'failure')
            return (
                <div className="text-danger fs-25">
                      {status}
                </div>
            )
    }

    renderTransactionData = () =>{
        if(this.state.transactionData.length !== 0){
            let jsx = this.state.transactionData.map((val, i )=>{
                if(val.scholarshipId){
                    val.picture = val.fotoMurid
                    val.title = val.namaMurid
                }else {
                    val.picture = val.gambarProject
                    val.title = val.namaProject
                }
                return (
                    <div class="card mb-5 shadow">
                        <div class="card-header row pb-0 m-0 p-0" >
                            <div className="col-md-2 text-center mb-2 mb-md-0">
                                <img src={URL_API+val.picture} height='120px' width='100%'/>
                            </div>
                            <div className="col-md-6 text-md-left text-center mb-2 mb-md-0">
                                <div className="text-muted" style={{fontSize : '35px'}}>{new Date(val.createdAt).toLocaleDateString('id-IND')}</div>
                                <h1>{val.title}</h1>
                            </div>
                            <div className="col-md-4 text-md-right text-center mb-2 mb-md-0">
                                {this.printStatus(val.statusPayment)}
                                <div className="fs-40">
                                    {val.nominal}
                                    <span className="fs-25">
                                        &nbsp;Rp
                                    </span>
                                </div>

                            </div>
                        </div>
                        <div class="card-body">
                             <h4 className="mb-3"> Pembayaran Berupa : <span className="text-muted" style={{fontSize : '35px'}}> {val.paymentSource} </span> </h4>
                             <h4 className="mb-3"> Jenis Pembayaran : <span className="text-muted" style={{fontSize : '28px'}}> {val.paymentType} </span></h4>
                             <h4> Username : <span className="text-muted" style={{fontSize : '28px'}}> {val.username} </span></h4>
                        </div>
                        <div class="card-footer text-center text-muted" style={{fontSize : '25px'}}>
                            {dateDiff(val.createdAt) }
                           
                        </div>

                    </div>
                )
            })
            return jsx
        }
    }
    render(){
      
        return(
            <div style={{marginLeft : '23%', marginRight : '23%'}}>
                <h2 className="mb-5">Admin Transaction List</h2>
                {this.renderTransactionData()}
                

            
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

export default connect(mapStatetoProps,{})(ManageTransaction);