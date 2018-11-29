import { MESSAGES, MESSAGES_ERROR } from 'actions/types'

const INITIAL_STATE = {
    messagesList: [],
    messagesError: null
}

export default function(state = INITIAL_STATE, action) {
    
    switch (action.type) {
        case MESSAGES:
            return { ...state, messagesList: action.payload }
        case MESSAGES_ERROR:
            return { ...state, messagesError: action.payload }
        default:
            return state
    }

}