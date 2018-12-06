import axios from 'axios';

export default () => {

    const auth = JSON.parse(localStorage.getItem('auth'))

    return axios.create({
        baseURL: 'http://127.0.0.1:3333/api',
        timeout: 3000,
        headers: {
            Authorization: `Bearer ${auth ? auth.jwt.token : ''}`,
        },
    })

}