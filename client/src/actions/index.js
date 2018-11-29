import axios from 'plugins/axios'
import event from 'plugins/bus'

import { 
    AUTH_USER, AUTH_ERROR, 
    CHATS, CHATS_ERROR, CHATS_TOGGLE, 
    RANDOM_USERS, RANDOM_USERS_ERROR, 
    USER, USER_ERROR, 
    MESSAGES, MESSAGES_ERROR
} 
from 'actions/types'

export const signup = (formProps, redirect) => dispatch => {
    
    return axios().post('/api/auth/register', formProps)
        .then(({ data }) => {
            const { token } = data.jwt
            dispatch({ type: AUTH_USER, payload: token})
            dispatch({ type: AUTH_ERROR, payload: null })
            localStorage.setItem('token', token)
            redirect()
        })
        .catch(error => {
            let payload = 'An error has occurred';
            if (error.response.status !== 500) payload = error.response.data.shift().message
            dispatch({ type: AUTH_ERROR, payload })
        })   

}

export const signout = () => {

    localStorage.removeItem('token')

    return {
        type: AUTH_USER,
        payload: null
    }
}

export const signin = (formProps, redirect) => dispatch => {
    
    return axios().post('/auth/login', formProps)
        .then(({ data }) => {
            dispatch({ type: AUTH_USER, payload: data})
            dispatch({ type: AUTH_ERROR, payload: null })
            localStorage.setItem('auth', JSON.stringify(data))
            redirect()
        })
        .catch(error => {
            let payload = 'An error has occurred';
            if (error.response.status !== 500) payload = error.response.data.shift().message
            dispatch({ type: AUTH_ERROR, payload })
        })   

}

export const getChats = () => dispatch => {
    
    return axios().get('/chats')
        .then(({ data }) => {
            dispatch({ type: CHATS, payload: data})
            event.$emit('show_chat', true)
        })
        .catch(error => {
            let payload = 'An error has occurred';
            if (error.response.status === 401) payload = 'Invalid Token'
            dispatch({ type: CHATS_ERROR, payload })
        })   

}

export const chatsToggle = (status) => dispatch => dispatch({ type: CHATS_TOGGLE, payload: !status })

export const toggleChatTo= (data) => dispatch => {
    if (data.type === 'friends') return dispatch({ type: CHATS_TOGGLE, payload: true })
    if (data.type === 'group') return dispatch({ type: CHATS_TOGGLE, payload: false })
}


export const getUsers = () => dispatch => {
    
    return axios().get('/profile')
        .then(({ data }) => {
            let users = data.friends.sort(() => Math.random() - 0.5)
            if (users.length >= 12) users = users.slice(0, 12);
            dispatch({ type: RANDOM_USERS, payload: users})
        })
        .catch(error => {
            let payload = 'An error has occurred';
            if (error.response.status === 401) payload = 'Invalid Token'
            dispatch({ type: RANDOM_USERS_ERROR, payload })
        })   

}

export const getUserById = id => dispatch => {
    return axios().get(`/profile/${id}`)
    .then(({ data }) => {
        const { user } = data
        dispatch({ type: USER, payload: user})
        event.$emit('new_user_profile', user)
    })
    .catch(error => {
        let payload = 'An error has occurred';
        if (error.response.status === 401) payload = 'Invalid Token'
        dispatch({ type: USER_ERROR, payload })
    })   

}

export const getMessages = (roomType, roomId) => dispatch => {
    return axios().get(`messages/${roomType}/${roomId}`)
    .then(({data}) => {
        dispatch({ type: MESSAGES, payload: data.messages})
    })
    .catch(error => {
        let payload = 'An error has occurred';
        if (error.response.status === 401) payload = 'Invalid Token'
        dispatch({ type: MESSAGES_ERROR, payload })
    })   

}