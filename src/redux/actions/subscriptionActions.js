import Axios from 'axios'
import { APPLY_SUBSCRIPTION, GET_SUBSCRIPTION } from './types'
import { API_URL } from '../../API'

export const getSub = (email) => {
    return(dispatch) => {
        Axios.post(API_URL + `/user/getSubscription`, {email})
        .then((res) => {
            dispatch({
                type: GET_SUBSCRIPTION,
                payload: res.data
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}

export const applySub = (subscriptionNominal, email) => {
    return(dispatch) => {
        Axios.post(API_URL + `/user/applySubscription`, { subscriptionNominal, email })
        .then((res) => {
            dispatch({ 
                type:  APPLY_SUBSCRIPTION,
                payload: subscriptionNominal
            })
            console.log(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }
}