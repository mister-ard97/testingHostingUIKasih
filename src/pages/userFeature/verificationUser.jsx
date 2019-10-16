import React, { Component } from 'react';
import { CustomInput } from 'reactstrap';
import { URL_API } from '../../helpers/Url_API'

class verificationUser extends Component {
    state = {
        ImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
        ImageName: 'Select Image',
        ImageDB: undefined,
    }

    ImageChange = (e) => {
        if (e.target.files[0]) {
            this.setState({
                ImageFile: URL.createObjectURL(e.target.files[0]),
                ImageName: e.target.files[0].name,
                ImageDB: e.target.files[0]
            })
        } else {
            this.setState({
                ImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
                ImageName: `Select Image`,
                ImageDB: undefined
            })
        }
    }

    protectionString = (e) => {
        if(e.keyCode === 189 || e.keyCode === 69) {
            e.preventDefault();
        }
    }

    sendDataVerificationUser = () => {

    }

    render() {
        return (
            <div className='container'>
                <div className='alert alert-info mt-3'>
                    Verifikasi ini diperlukan ketika user ingin menjadi seorang Campaigner (pembuat Penggalang Dana)
                </div>
                <div className='card border-0'>
                    <h5>User Verification</h5>
                    <div className='form-group'>
                        <label>No. KTP</label>
                        <input ref={(noKTP) => this.noKTP = noKTP} type="number" className='form-control' placeholder='Masukkan Nomor KTP' onKeyDown={(e) => this.protectionString(e)}/>
                    </div>
                    <div className='form-group'>
                        <label>Upload Gambar KTP</label>
                        <img src={`${this.state.ImageFile}`} alt="user-default" className='userImage my-3' />
                        <CustomInput id='editc' type='file' label={this.state.categoryImageName} onChange={this.categoryImageChange} />

                    </div>
                    <button onClick={this.sendDataVerificationUser} className='btn btn-primary'>Send Image</button>
                </div>
            </div>
        )
    }
}

export default verificationUser;