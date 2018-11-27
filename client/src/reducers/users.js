import { RANDOM_USERS, RANDOM_USERS_ERROR, USER, USER_ERROR } from 'actions/types'

const INITIAL_STATE = {
    randomUsers: [],
    randomUsersError: null,
    activeUser: null,
    activeUserError: null
}

export default function(state = INITIAL_STATE, action) {
    
    switch (action.type) {
        case RANDOM_USERS:
            return { ...state, randomUsers: action.payload }
        case RANDOM_USERS_ERROR:
            return { ...state, randomUsersError: action.payload }
        case USER:
            return { ...state, activeUser: action.payload }
        case USER_ERROR:
            return { ...state, activeUserError: action.payload }
        default:
            return state
    }

}