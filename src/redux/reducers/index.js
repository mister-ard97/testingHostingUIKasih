import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import subscriptionReducer from './subscriptionReducer'

export default combineReducers({
    auth: AuthReducer,
    sub: subscriptionReducer
})