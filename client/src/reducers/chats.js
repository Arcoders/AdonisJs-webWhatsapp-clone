import { CHATS, CHATS_ERROR, CHATS_TOGGLE } from 'actions/types'

const INITIAL_STATE = {
    chatsList: {},
    chatsError: null,
    chatsLoading: false,
    toggleStatus: true
}

export default function(state = INITIAL_STATE, action) {
    
    switch (action.type) {
        case CHATS:
            return { ...state, chatsList: action.payload }
        case CHATS_ERROR:
            return { ...state, chatsError: action.payload }
        case CHATS_TOGGLE:
            return { ...state, toggleStatus: action.payload }
        default:
            return state
    }

}