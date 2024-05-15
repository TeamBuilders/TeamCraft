import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: 'http://teamcraft.somee.com/api'
})


export default axiosInstance;