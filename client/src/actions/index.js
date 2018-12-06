import axios from 'plugins/axios'

import { 
    AUTH_USER, AUTH_ERROR, 
    CHATS, CHATS_ERROR, CHATS_TOGGLE, 
    RANDOM_USERS, RANDOM_USERS_ERROR, 
    USER,
    MESSAGES
} 
from 'actions/types'

export const signup = (formProps) => dispatch => {
    
    return axios().post('/auth/register', formProps)
        .then(({ data }) => {
            dispatch({ type: AUTH_USER, payload: data})
            dispatch({ type: AUTH_ERROR, payload: null })
            localStorage.setItem('auth', JSON.stringify(data))
            window.location.href = '/wtsp'
        })
        .catch(error => {
            let payload = 'An error has occurred'
            if (error.response && error.response.status === 422) payload = error.response.data.shift().message
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

export const signin = (formProps) => dispatch => {
    
    return axios().post('/auth/login', formProps)
        .then(({ data }) => {
            dispatch({ type: AUTH_USER, payload: data})
            dispatch({ type: AUTH_ERROR, payload: null })
            localStorage.setItem('auth', JSON.stringify(data))
            window.location.href = '/wtsp'
            
        })
        .catch(error => {
            let payload = 'An error has occurred';
            if (error.response && error.response.status === 422) payload = error.response.data.shift().message
            dispatch({ type: AUTH_ERROR, payload })
        })   

}

export const getChats = () => dispatch => {
    
    return axios().get('/chats')
        .then(({ data }) => {
            dispatch({ type: CHATS, payload: data})
            window.pusher.$emit('show_chat', true)
        })
        .catch(error => {
            let payload = 'An error has occurred'
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('auth')
                window.location.href = '/signin'
            }
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
            let payload = 'list could not be loaded';
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('auth')
                window.location.href = '/signin'
            }
            dispatch({ type: RANDOM_USERS_ERROR, payload })
            window.pusher.$emit('notificate', { message: payload, type: 'error'})
        })   

}

export const getUserById = id => dispatch => {
    return axios().get(`/profile/${id}`)
    .then(({ data }) => {
        const { user } = data
        if (!user) return window.pusher.$emit('notificate', { message: 'Profile not found', type: 'error'})
        dispatch({ type: USER, payload: user})
        window.pusher.$emit('new_user_profile', user)
    })
    .catch(error => {
        let payload = 'An error has occurred';
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth')
            window.location.href = '/signin'
        }
        window.pusher.$emit('notificate', { message: payload, type: 'error'})
    })   

}

export const getMessages = (roomType, roomId) => dispatch => {
    return axios().get(`messages/${roomType}/${roomId}`)
    .then(({data}) => {
        dispatch({ type: MESSAGES, payload: data.messages})
    })
    .catch(error => {
        let payload = 'An error has occurred';
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth')
            window.location.href = '/signin'
        }
        window.pusher.$emit('notificate', { message: payload, type: 'error'})
    })   

}


export const sendMessage = (formProps) => () => {
    
    return axios().post('/messages/send', formProps)
        .then((data) => {
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('auth')
                window.location.href = '/signin'
            }
        })   

}

export const addGroup = (formProps) => () => {
    
     return axios().post('/groups/create', formProps)
         .then(({data}) => {
            window.pusher.$emit('notificate', { message: data.status, type: 'done'})
         })
         .catch(error => {
            let payload = 'An error has occurred'
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('auth')
                window.location.href = '/signin'
            }
            if (error.response && error.response.status === 422) {
                payload = error.response.data.shift().message
            }
            window.pusher.$emit('notificate', { message: payload, type: 'error'})
         })   
 
 }


 export const editGroup = (id, formProps) => () => {
    
     return axios().patch(`/groups/${id}`, formProps)
         .then(({data}) => {
            window.pusher.$emit('notificate', { message: data.status, type: 'done'})
         })
         .catch(error => {
            let payload = 'An error has occurred'
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('auth')
                window.location.href = '/signin'
            }
            if (error.response && error.response.status === 422) {
                payload = error.response.data.shift().message
            }
            window.pusher.$emit('notificate', { message: payload, type: 'error'})
         })   
 
 }

 export const editProfile = (formProps, id) => dispatch => {
 
     return axios().patch(`/profile/${id}`, formProps)
         .then(({data}) => {
             let auth = JSON.parse(localStorage.getItem('auth'))
             auth.user = data.user
             dispatch({ type: AUTH_USER, payload: auth})
             localStorage.setItem('auth', JSON.stringify(auth))
             window.pusher.$emit('notificate', { message: data.status, type: 'done'})
         })
         .catch(error => {
            let payload = 'An error has occurred'
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('auth')
                window.location.href = '/signin'
            }
            if (error.response && error.response.status === 422) {
                payload = error.response.data.shift().message
            }
            window.pusher.$emit('notificate', { message: payload, type: 'error'})
         })   
 
 }

