import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import auth from 'reducers/auth'
import chats from 'reducers/chats'
import users from 'reducers/users'
import room from 'reducers/room'

export default combineReducers({
    auth,
    chats,
    users,
    room,
    form: formReducer
})