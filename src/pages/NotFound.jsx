import React, {Component} from 'react';

class NotFound extends Component {
    componentDidMount() {
        document.title = 'Not Found 404'
    }
    render() {
        return (
            <div>
                <div className='container py-3 my-3'>
                    <div className='row py-3'>
                        <div className="offset-2 col-8 py-3 my-5">
                            <div className="card px-3 my-5">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">Not Found Page</h5>
                                    <h1>404</h1>                                  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NotFound;