import axios from 'axios'

const baseURL = 'http://localhost:8081/jasperserver/rest_v2/'
const user = 'user'
const password = 'bitnami'
let config = {
    baseURL: baseURL,
    auth: {
        username: user,
        password: password
    },
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
}
export default axios.create(config)
