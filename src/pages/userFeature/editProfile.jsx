import React, { Component } from 'react';
import Axios from 'axios';
import { URL_API } from '../../helpers/Url_API';
import { connect } from 'react-redux'
import {Modal, ModalBody, ModalFooter, Button, ModalHeader, Form, FormGroup, Label, CustomInput} from 'reactstrap'

class editProfile extends Component {
    
    state = { 
        userData: [],
        openModalPhone: false,
        onAddImageFileChange: null,
        addImageFileName: null,
        addImageFile: null,
        openModalPic: false
    }

    componentDidMount(){

        let token = localStorage.getItem('token')
        var options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.get(URL_API + `/user/getUser/${this.props.id}`, options)
        .then((res) => {
            // console.log(res.data)
            // this.setState({ userData: res.data })
           this.setState({
               userData: res.data
           })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderModalPhone = () => {
        return(
            <div>
                <Modal isOpen={this.state.openModalPhone} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Edit Nomor Telefon</ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                        <Label>Nomor telefon</Label>
                            <input type='text' className='form-control' ref='nomorTelefon'/>
                    </FormGroup>
                  </Form>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.editPhoneNumber} >Add Phone Number</Button>{' '}
                  <Button color="secondary" onClick={() => this.setState({openModalPhone: false})}>Cancel</Button>
                </ModalFooter>
              </Modal>
            </div>
        )
    }

    renderModalPic = () => {
        return(
            <div>
                <Modal isOpen={this.state.openModalPic} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>New Profile Pic</ModalHeader>
                <ModalBody>
                  <Form>
                    <FormGroup>
                        <CustomInput onChange={this.onAddImageFileChange} id='addImagePost'type='file' label={this.state.addImageFileName} />
                    </FormGroup>
                  </Form>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.editProfilePic} >Change Profile Picture</Button>{' '}
                  <Button color="secondary" onClick={() => this.setState({openModalPic: false})}>Cancel</Button>
                </ModalFooter>
              </Modal>
            </div>
        )
    }

    editProfilePic = () => {
        if(this.state.addImageFile) {
            
            let token = localStorage.getItem('token')
            var options = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            console.log(this.state.addImageFile)
            
            var formData = new FormData()
            
            formData.append('imageUser', this.state.addImageFile)
            
            console.log(formData)

            Axios.post(URL_API + `/user/editProfilePic`, formData, options)
            .then((res) => {
                console.log(res.data)
                this.setState({ userData: res.data, openModalPic: false})
            })
            .catch((err) => {
                console.log(err)
            })
        
        } else {
            alert('Harap masukan gambar yang ingin diganti');
        }
    }

    onAddImageFileChange = (e) => {
        console.log(e.target.files[0])
        if(e.target.files[0]){
            this.setState({ addImageFileName: e.target.files[0].name, addImageFile : e.target.files[0] })
        }else{
            this.setState({ addImageFileName : 'Select Image', addImageFile : undefined })
        }
    }

    editPhoneNumber = () => {
        if(this.refs.nomorTelefon.value) {
            let phoneNumber = this.refs.nomorTelefon.value
            console.log(phoneNumber)

            let token = localStorage.getItem('token')
            var options = {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            }

            Axios.post(URL_API + `/user/editPhoneNumber`,{
                phoneNumber 
            }, options).then((res) => {
            console.log(res.data)
                this.setState({ userData: res.data, openModalPhone: false })
            }).catch((err) => {
                console.log(err)
            })
        
        } else {
            alert('Harap nomor isi nomor telepon')
        }
    } 

    renderUserData = () => {
            var { id, userImage, nama, email, phoneNumber, role} = this.state.userData
            return(
                <div key={id}>
                    <div className='col-sm-6'>
                        <img src={URL_API + userImage} alt={userImage} style={{ width: '50%' }}/>
                        <input type='button' value='ganti profile pic' className='btn btn-primary' onClick={() => this.setState({ openModalPic: true })}/>
                    </div>
                    <div className='col-sm-6'>
                        <div>
                            nama: {nama}
                        </div>
                        <div>
                            email: {email}
                        </div>
                        <div>
                            {
                                parseInt(phoneNumber) === 0 
                                ? 
                                <input type='button' value='daftar nomor telefon' className='btn btn-primary' onClick={() => this.setState({ openModalPhone: true })}/>
                                : 
                                <>
                                    <div>
                                        nomor telefon: {phoneNumber} 
                                    </div>
                                    <div>
                                        <input type='button' value='ganti nomor telefon' className='btn btn-primary' onClick={() => this.setState({ openModalPhone: true })}/>
                                    </div>
                                </>
                            }
                        </div>
                        {/* <div>
                            invoice date: {reminderDate}
                        </div> */}
                        <div>
                            role: {role}
                        </div>
                        {/* <div>
                            {
                                val.subscriptionNominal === 0 ? 'anda belum berlangganan' : val.subscriptionNominal
                            }
                        </div>
                        <div>
                            {
                                val.subscriptionStatus === 0 ? 'anda belum berlangganan' : null
                            }
                        </div> */}
                    </div>
                </div>
            )
    }

    render(){
        return ( 
            <div className='row'>
                <div className='container'>
                    <div className='col-12'>
                    {this.renderUserData()}
                    {this.renderModalPhone()}
                    {this.renderModalPic()}
                    </div>
                </div>
            </div>
         );
    }
}
 
const mapStatetoProps = ({ auth }) => {
    return{
        id: auth.id
    }
}

export default connect(mapStatetoProps)(editProfile);