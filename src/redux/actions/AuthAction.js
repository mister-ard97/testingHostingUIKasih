import Axios from 'axios';
import {
   AUTH_LOGIN_ERROR,
   AUTH_LOGIN_LOADING,
   USER_LOGIN_SUCCESS,
   USER_LOGOUT,
   VERIFICATION_SUCCESS,
   VERIFICATION_FAILED, 
   CLEAN_ERROR,
   CLEAR_CART
} from './types';
import { URL_API } from '../../helpers/Url_API';

export const onUserRegister = (data) => {
    let {
        nama,
        password,
        confPassword,
        email,
        address,
        UserImage
    } = data

    return (dispatch) => {
        dispatch({type: AUTH_LOGIN_LOADING});
        if (nama === '' ||
            password === '' ||
            confPassword === '' ||
            email === '' ||
            address === '' ||
            UserImage === '' ) {

                dispatch({type: AUTH_LOGIN_ERROR, payload: {
                    error: 'Semua Form Input Harus Diisi',
                }})
            
            } else if(!(password === confPassword)) {
                dispatch({
                    type: AUTH_LOGIN_ERROR, payload: {
                        error: 'Password dan Confirmation Password Harus Sama',
                    }
                }) 
            } else {

                let formData = new FormData();
                var headers = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }

                delete data.confPassword;

                formData.append('imageUser', UserImage)

                delete data.UserImage;

                formData.append('data', JSON.stringify(data))

                Axios.post(URL_API + '/user/register', formData, headers)
                    .then((res) => {
                        
                        let { 
                            id, 
                            subscriptionStatus, 
                            nama, 
                            email, 
                            token, 
                            verified, 
                            role, 
                            userImage,
                            phoneNumber
                        } = res.data.dataUser

                        localStorage.setItem('token', res.data.token);
                        dispatch({
                            type: USER_LOGIN_SUCCESS, payload: {
                                id,
                                subscriptionStatus,
                                nama,
                                email,
                                token,
                                verified,
                                role,
                                userImage,
                                phoneNumber,
                                justRegister: true,
                                loginChecked: true,
                                NextPage: true
                            }
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                        if(err.response) {
                            dispatch({
                                type: AUTH_LOGIN_ERROR, payload: {
                                    error: err.response.data.message,
                                }
                            })
                        }
                    })
            }
    }      
}

export const EmailVerification = () => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });
        const token = localStorage.getItem('token');
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
        Axios.put(URL_API + '/user/emailVerification', {}, options)
            .then((res) => {
                
                let { 
                    id, 
                    subscriptionStatus, 
                    nama, 
                    email, 
                    token, 
                    verified, 
                    role, 
                    userImage,
                    phoneNumber
                } = res.data.dataUser

                localStorage.setItem('token', res.data.token);
                dispatch({
                    type: USER_LOGIN_SUCCESS, payload: {
                        id,
                        subscriptionStatus,
                        nama,
                        email,
                        token,
                        verified,
                        role,
                        userImage,
                        phoneNumber,
                        justRegister: true,
                        loginChecked: true
                    }
                })
                dispatch({ type: VERIFICATION_SUCCESS });
            })
            .catch((err) => {
                dispatch({ type: VERIFICATION_FAILED });
            })
    }
}

export const resendEmailVerification = () => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });
        const token = localStorage.getItem('token');
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
        Axios.post(URL_API + '/user/resendEmailVerification', {}, options)
        .then((res) => {
            
            let { 
                id, 
                subscriptionStatus, 
                nama, 
                email, 
                token, 
                verified, 
                role, 
                userImage,
                phoneNumber 
            } = res.data.dataUser

            localStorage.setItem('token', res.data.token);
            dispatch({
                type: USER_LOGIN_SUCCESS, payload: {
                    id,
                    subscriptionStatus,
                    nama,
                    email,
                    token,
                    verified,
                    role,
                    userImage,
                    phoneNumber,
                    justRegister: true,
                    loginChecked: true
                }
            })
            dispatch({ type: VERIFICATION_SUCCESS });
        })
        .catch((err) => {
            dispatch({ type: VERIFICATION_FAILED });
        })
    }
}

export const userLogin = (email, password) => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });

        Axios.post(URL_API + '/user/login', {
            email, password
        })
        .then((res) => {
            
            let { 
                id, 
                subscriptionStatus, 
                nama, 
                email, 
                token, 
                verified, 
                role, 
                userImage,
                phoneNumber
            } = res.data.dataUser

            localStorage.setItem('token', res.data.token);
            dispatch({
                type: USER_LOGIN_SUCCESS, payload: {
                    id,
                    subscriptionStatus,
                    nama,
                    email,
                    token,
                    verified,
                    role,
                    userImage,
                    phoneNumber, 
                    loginChecked: true
                }
            })
        })
        .catch((err) => {
            if(err.response) {
                dispatch({
                    type: AUTH_LOGIN_ERROR, payload: {
                        error: err.response.data.message,
                    }
                })
            }
        })
    }
}

export const userLoginWithGoogle = (data) => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });
        console.log(data)
        Axios.post(URL_API + '/user/loginGmail', {data})
            .then((res) => {
                console.log('oausd')
                let { 
                    id, 
                    subscriptionStatus, 
                    nama, 
                    email, 
                    token, 
                    verified, 
                    role, 
                    userImage,
                    phoneNumber
                } = res.data.dataUser
                console.log(res.data.dataUser)

                localStorage.setItem('token', res.data.token);
                dispatch({
                    type: USER_LOGIN_SUCCESS, payload: {
                        id,
                        subscriptionStatus,
                        nama,
                        email,
                        token,
                        verified,
                        role,
                        userImage,
                        phoneNumber,
                        loginChecked: true
                    }
                })
            })
            .catch((err) => {
                console.log(err)
                if (err.response) {
                    dispatch({
                        type: AUTH_LOGIN_ERROR, payload: {
                            error: err.response.data.message,
                        }
                    })
                }
            })
    }
}

export const userLoginWithFacebook = (data) => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });

        Axios.post(URL_API + '/user/loginFacebook', { data })
            .then((res) => {
                
                let { 
                    id, 
                    subscriptionStatus, 
                    nama, 
                    email, 
                    token, 
                    verified, 
                    role, 
                    userImage,
                    phoneNumber
                } = res.data.dataUser

                localStorage.setItem('token', res.data.token);
                dispatch({
                    type: USER_LOGIN_SUCCESS, payload: {
                        id,
                        subscriptionStatus,
                        nama,
                        email,
                        token,
                        verified,
                        role,
                        userImage,
                        phoneNumber,
                        loginChecked: true
                    }
                })
            })
            .catch((err) => {
                if (err.response) {
                    dispatch({
                        type: AUTH_LOGIN_ERROR, payload: {
                            error: err.response.data.message,
                        }
                    })
                }
            })
    }
}

export const KeepLogin = () => {
   return (dispatch) => {
       dispatch({ type: AUTH_LOGIN_LOADING });
       const token = localStorage.getItem('token');
       const options = {
           headers: {
               'Authorization': `Bearer ${token}`,
           }
       }

       Axios.post(URL_API + '/user/keepLogin', {}, options)
           .then((res) => {
               
            let { 
                id, 
                subscriptionStatus, 
                nama, 
                email, 
                token, 
                verified, 
                role, 
                userImage,
                phoneNumber
            } = res.data.dataUser

               localStorage.setItem('token', res.data.token);
               dispatch({
                   type: USER_LOGIN_SUCCESS, payload: {
                    id,
                    subscriptionStatus,
                    nama,
                    email,
                    token,
                    verified,
                    role,
                    userImage,
                    phoneNumber, 
                       loginChecked: true
                   } })
           })
           .catch((err) => {
               localStorage.removeItem('token');
               dispatch({ type: USER_LOGOUT });
           })
    }
}

export const userLogOut = () => {
        localStorage.removeItem('token');
        return(dispatch) => {
            dispatch({ type: USER_LOGOUT })
            dispatch({ type: CLEAR_CART })
        }
}

export const cleanError = () => {
    return {
        type: CLEAN_ERROR
    };
}