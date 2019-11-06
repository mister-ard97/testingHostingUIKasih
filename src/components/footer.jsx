import React from 'react'
import { Link } from 'react-router-dom'
import imagefooter from '../assets/logo/logo_white_and_grey.png'

class Footer extends React.Component{
    render(){
        return(
            <div className="container-fluid p-l-100 p-r-100 py-5 classfooter mt-4"  >
                <div className="row">
                    <div className="col-md-4 mb-3 mb-sm-0">
                        <img src={imagefooter} height="150px" className="mb-4"/>
                        <div>Get involved, speak out,</div>
                        <div>or become a donor</div>
                        <div>and give every child</div>
                        <div className="mb-4">a fair chance to succeed</div>

                        <div>Terms of Use&nbsp;&nbsp;&nbsp;   |&nbsp;&nbsp;&nbsp;    Privacy Environmental Policy </div>
                        
                    </div>
                    <div className="col-md-4 pt-4 d-flex flex-column mb-4 mb-sm-0">
                        <h4 className="mb-5">Contacts</h4>
                        <div>Address : Purwadhika Startup</div>
                        <div>Green Office Park</div>
                        <div className="mb-4">BSD , Tangerang</div>
                        <div className="mb-4">Website : www.KasihNusantara.com</div>
                        <div className="mb-4">Email : Kasihnusantara@gmail.com</div>
                        <div className="mb-4">Phone : (021) 55423232</div> 
                    </div>
                    <div className="col-md-3 d-flex flex-column pb-4 ">
          
                        <div style={{marginTop : 'auto'}}>Copyright @ 2019 Kasih Nusantara, All Rights Reserved.</div>
                        {/* <div style={{marginTop : 'auto'}} className="d-sm-none d-block">Copyright @ 2019 Kasih Nusantara,<br/>All Rights Reserved.</div> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer