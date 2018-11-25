import { CHATS, CHATS_ERROR } from 'actions/types'

const INITIAL_STATE = {
    chatsList: [],
    chatsError: null,
    chatsLoading: false 
}

export default function(state = INITIAL_STATE, action) {
    
    switch (action.type) {
        case CHATS:
            return { ...state, chatsList: action.payload }
        case CHATS_ERROR:
            return { ...state, chatsError: action.payload }
        default:
            return state
    }

}