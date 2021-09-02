import { combineReducers } from 'redux'
import userReducer from './userReducer'
import adminReducer from './adminReducer'

// list all the new register reducers here from your reducer folder to merge them and export
export default combineReducers({
    users: userReducer,
    admin: adminReducer
})
