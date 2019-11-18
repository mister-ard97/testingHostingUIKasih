import React from 'react'

// import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API';

class HistoryTransaction extends React.Component{
    state = {
        data  : []
    }

    async componentDidMount(){
        if(this.props.auth.id){
            try {
                var res = await Axios.post(URL_API + '/payment/gethistory' , {userId : this.props.auth.id})
                var hasil = await res.data.map((val,id)=>{
                    var obj = {...val, ...val.User, ...val.Project}
                    delete obj.User
                    delete obj.Project
                    return obj
                })  
                this.setState({
                    data : hasil
                })
            }
            catch (e){
                console.log(e)

            }
        }
    }
    renderHistory = () =>{
        if(this.state.data.length !== 0 ){
            var data = this.state.data
            console.log(data)
            var jsx = data.map((val,i )=>{
                return (
                    <tr>
                        <td>{i+1}</td>
                        <td>{val.paymentType}</td>
                        <td>{val.nominal}</td>
                        <td>{val.projectName}</td>
                        <td><img src={`${URL_API}${val.projectImage}`} height={`100px`} width={`100px`}></img></td>
                        <td>{val.nama}</td>
                        <td>{val.order_id}</td>
                        <td>{new Date(val.createdAt).toLocaleDateString('id-IND')}</td>
                    </tr>
                )
            })

            return jsx
        }
    }

    render(){
        console.log(this.props.auth)
        return(
            <div>
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">No</th>
                        <th scope="col">Tipe Pembayaran</th>
                        <th scope="col">Nominal</th>
                        <th scope="col">Nama Project</th>
                        <th scope="col">Project Img</th>
                        <th scope="col">User </th>
                        <th scope="col">Order Id </th>
                        <th scope="col">Tanggal Transaksi</th>
                        </tr>
                    </thead>
                    <tbody>
                   
                        {this.renderHistory()}
             
                    </tbody>
  
                </table>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth : state.auth
    }
}


export default connect(mapStateToProps, null)(HistoryTransaction)