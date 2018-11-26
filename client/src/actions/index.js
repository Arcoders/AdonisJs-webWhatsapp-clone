import axios from 'plugins/axios'

import { AUTH_USER, AUTH_ERROR, CHATS, CHATS_ERROR, CHATS_TOGGLE } from 'actions/types'

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

export const getChats = () => dispatch => {
    
    return axios().get('/chats')
        .then(({ data }) => {
            dispatch({ type: CHATS, payload: data})
        })
        .catch(error => {
            let payload = 'An error has occurred';
            if (error.response.status === 401) payload = 'Invalid Token'
            dispatch({ type: CHATS_ERROR, payload })
        })   

}

export const chatsToggle = (status) => dispatch => dispatch({ type: CHATS_TOGGLE, payload: !status })