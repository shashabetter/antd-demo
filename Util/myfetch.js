import axios from 'axios';
let defaultConfig = {
    method: 'get',
    baseURL: 'https://some-domain.com/api/',
    proxy: {
        host: '127.0.0.1',
        port: 9000
    }
}