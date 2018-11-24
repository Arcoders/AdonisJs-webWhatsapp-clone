import axios from 'axios';

export default () => {

    return axios.create({
        baseURL: '/api',
        timeout: 3000,
        headers: {
            Authorization: `Bearer ...`,
        },
    });

}