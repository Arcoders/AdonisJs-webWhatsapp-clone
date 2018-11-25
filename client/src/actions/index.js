import axios from '../plugins/axios'
import { AUTH_USER, AUTH_ERROR } from './types'

export const signup = (formProps, redirect) => dispatch => {
    
    return axios().post('http://127.0.0.1:3333/api/auth/register', formProps)
        .then(({ data }) => {
            const { token } = data.jwt
            dispatch({ type: AUTH_USER, payload: token})
            localStorage.setItem('token', token)
            redirect()
        })
        .catch(error => {
            let payload = 'An error has occurred';
            if (error.response.status === 422) payload = error.response.data.shift().message
            dispatch({ type: AUTH_ERROR, payload })
        })   

}