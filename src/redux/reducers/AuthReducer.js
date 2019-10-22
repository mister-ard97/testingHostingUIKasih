import {
    USER_LOGIN_SUCCESS,
    USER_CHANGE_ADDRESS,
    AUTH_LOGIN_ERROR,
    AUTH_LOGIN_LOADING,
    USER_LOGOUT,
    VERIFICATION_FAILED,
    VERIFICATION_SUCCESS,
    CLEAN_ERROR, 
    AUTH_LOADING_FINISHED
} from '../actions/types'

const INITIAL_STATE = {
    id : '',
    subscriptionStatus: '',
    subscriptionNominal: '',
    token: '',
    phoneNumber: '',
    nama: '',
    email: '',
    token: '',
    verified: '',
    loading: false,
    userImage: '',
    error: '',
    role: '',
    statusVerification: '',
    justRegister: false,
    loginChecked: false,
    authChecked: false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_LOGIN_SUCCESS:
            return { ...INITIAL_STATE, ...action.payload, loading: false, authChecked: true}
        case AUTH_LOGIN_LOADING:
            return {...state, loading: true, error: ''}
        case AUTH_LOADING_FINISHED:
            return { ...state, loading: false, error: '', authChecked: true}
        case AUTH_LOGIN_ERROR:
            return { ...state, error: action.payload.error, authChecked: true, loading: false}
        case VERIFICATION_SUCCESS: 
            return { ...state, statusVerification: 'Success', loading: false, authChecked: true}
        case VERIFICATION_FAILED: 
            return { ...state, statusVerification: 'Failed', loading: false, authChecked: true}
        case CLEAN_ERROR:
            return { ...state, error: '' }
        case USER_LOGOUT:
            return {...INITIAL_STATE, authChecked: true}
        default:
            return state
    }
}