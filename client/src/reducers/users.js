import { RANDOM_USERS, RANDOM_USERS_ERROR } from 'actions/types'

const INITIAL_STATE = {
    randomUsers: [],
    randomUsersError: null
}

export default function(state = INITIAL_STATE, action) {
    
    switch (action.type) {
        case RANDOM_USERS:
            return { ...state, randomUsers: action.payload }
        case RANDOM_USERS_ERROR:
            return { ...state, randomUsersError: action.payload }
        default:
            return state
    }

}