import React, {Component} from 'react'
import { Table, Input, Modal, ModalHeader, ModalBody, ModalFooter,Button } from 'reactstrap'
import { FormControlLabel, Checkbox, ListItem, ListItemIcon, List, Tab, } from '@material-ui/core'
import Axios from 'axios'
import { URL_API } from '../../helpers/Url_API'

class PayoutManage extends Component {
    state = {
        data:'',
        selectedData: '',
        pendingList : false,
        modalApprove: false
    }

    componentDidMount(){
       this.renderPendingPayout()
    }

    renderPayoutHistory = () => {
        Axios.get(`${URL_API}/payout/getPayoutHistory`)
        .then((res)=>{
            console.log(res.data)
            this.setState({data: res.data, pendingList: false})
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderPendingPayout = () => {
        Axios.get(`${URL_API}/payout/getPendingPayout`)
        .then((res)=>{
            console.log(res.data)
            this.setState({data: res.data, pendingList: true})
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderData = () => {
        return this.state.data.map((val, i) => {
            return(
                <tr>
                    <td>{i+1}</td>
                    <td>{val.createdAt}</td>
                    {this.state.pendingList ? null : <td>{val.updatedAt}</td>}
                    <td>{val.beneficiary_name}</td>
                    <td>{val.reference_no}</td>
                    <td>{val.beneficiary_account}</td>
                    <td>{val.bank}</td>
                    <td>{val.amount}</td>
                    <td>{val.notes}</td>
                    {this.state.pendingList ? null : <td>{val.status}</td>}
                    {this.state.pendingList ? <td><Button color='success' onClick={()=>this.setState({modalApprove: true, selectedData: val})}>Approve</Button></td> : null }
                    {this.state.pendingList ? <td><Button color='danger' onClick={()=>this.setState({modalRehect: true})}>Reject</Button></td> : null }
                </tr>
            )
        })
    }

    renderModalApprove = () => {
        if(!this.state.selectedData){
            return null
        }
        console.log(this.state.selectedData)
        return (
            <Modal isOpen={this.state.modalApprove} toggle={()=> this.setState({modalApprove: false})} size='lg'>
                <ModalHeader toggle={()=> this.setState({modalApprove: false})}>
                    Approve payout
                </ModalHeader>
                <ModalBody>
                    <Table>
                        <thead>
                            <tr>
                                <th>Beneficery Name</th>
                                <th>Beneficary account</th>
                                <th>beneficary Bank</th>
                                <th>Amount</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{this.state.selectedData.beneficiary_name}</td>
                                <td>{this.state.selectedData.beneficiary_account}</td>
                                <td>{this.state.selectedData.bank}</td>
                                <td>{this.state.selectedData.amount}</td>
                                <td>{this.state.selectedData.notes}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Input type='text' placeholder='OTP' ref='otp' innerRef='iotp' style={{width:'100px', textAlign: 'center', margin: '0 auto'}} maxLength='6'/>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={()=>this.approvePayment()}>Approve</Button>
                    <Button color='warning' onClick={()=>this.setState({modalApprove: false})}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }

    approvePayment = () => {
        // console.log(this.refs.otp)
        let data = {
            "reference_nos": [this.state.selectedData.reference_no],
            "otp": this.refs.otp.refs.iotp.value
        }

        console.log(data)
        Axios.post(`${URL_API}/payout/approve`, data)
        .then((res)=>{
            console.log(res.data)
            this.setState({modalApprove: false})
            Axios.get(`${URL_API}/payout/getPayoutHistory`)
            .then((res)=>{
                console.log(res.data)
                this.setState({data: res.data})
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
            if(err.response.data.error_message === 'An error occurred when approving payouts'){
                window.alert(err.response.data.errors[0])
            }
        })
    }

    handleToggle = value => () => {
        // const currentIndex = checked.indexOf(value);
        // const newChecked = [...checked];
    
        // if (currentIndex === -1) {
        //   newChecked.push(value);
        // } else {
        //   newChecked.splice(currentIndex, 1);
        // }
        // console.log(newChecked)
        // setChecked(newChecked);
      };

    selectData = (index) => {
        var arr = this.state.selectedData
        var newArr = arr
        newArr.push(index)
        this.setState({selectData: newArr})
        // console.log(newArr)
        console.log(arr)

    }
    render(){
        return(
            <div className='container mt-4 mb-4'>
                <center>
                    <Button color={this.state.pendingList ? 'danger' : 'default'} onClick={this.renderPendingPayout} className='mb-3 mr-3'> Pending Payout </Button>
                    <Button color={this.state.pendingList ? 'default' : 'danger'} onClick={this.renderPayoutHistory} className='mb-3'> Payout History </Button>
                    <Table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Created At</th>
                                {this.state.pendingList ? null : <th>Updated At</th>}
                                <th>Beneficary Name</th>
                                <th>Reference No</th>
                                <th>Beneficary Account</th>
                                <th>Beneficary Bank</th>
                                <th>Amount</th>
                                <th>Notes</th>
                                {this.state.pendingList ? null : <th>Status</th>}
                                {this.state.pendingList ? <th>Actions</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data ? this.renderData() : null}
                            
                        </tbody>
                    </Table>
                </center>
                {this.renderModalApprove()}
            </div>
        )
    }
}

export default PayoutManage;