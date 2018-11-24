import { AUTH_USER, AUTH_ERROR } from '../actions/types'

const INITIAL_STATE = {
    autenticated: '',
    errorMessage: ''
}

export default function(state = INITIAL_STATE, action) {
    
    switch (action.type) {
        case AUTH_USER:
            return { ...state, autenticated: action.payload }
        case AUTH_ERROR:
            return { ...state, errorMessage: action.payload }
        default:
            return state
    }

}