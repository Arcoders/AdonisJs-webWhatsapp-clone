import axios from 'axios';

export default () => {

    const auth = JSON.parse(localStorage.getItem('auth'))

    return axios.create({
        baseURL: 'http://192.168.0.22:3333/api',
        timeout: 3000,
        headers: {
            Authorization: `Bearer ${auth ? auth.jwt.token : ''}`,
        },
    })

}