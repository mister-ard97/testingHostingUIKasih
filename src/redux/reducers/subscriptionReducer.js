import { APPLY_SUBSCRIPTION, GET_SUBSCRIPTION } from '../actions/types'

const INITIAL_STATE = {
    subscriptionStatus: 0,
    subscriptionNominal: 0
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case GET_SUBSCRIPTION: 
            return { ...state, subscriptionNominal: action.payload.subscriptionNominal, subscriptionStatus: action.payload.subscriptionStatus }
        case APPLY_SUBSCRIPTION:
            return {...state, subscriptionNominal: action.payload, subscriptionStatus: 1};
        default :
            return{ INITIAL_STATE }
    }
}