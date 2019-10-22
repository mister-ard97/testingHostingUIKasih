import Axios from 'axios'
import { APPLY_SUBSCRIPTION, GET_SUBSCRIPTION } from './types'
import { URL_API } from '../../helpers/Url_API'


export const getSub = (email) => {
    return(dispatch) => {
        Axios.post(URL_API + `/user/getSubscription`, {email})
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
        Axios.post(URL_API + `/user/applySubscription`, { subscriptionNominal, email })
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