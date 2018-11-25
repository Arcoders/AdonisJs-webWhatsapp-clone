import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import auth from 'reducers/auth'
import chats from 'reducers/chats'

export default combineReducers({
    auth,
    chats,
    form: formReducer
})