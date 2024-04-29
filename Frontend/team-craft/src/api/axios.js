import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: 'http://artefomak-001-site1.ftempurl.com/api'
})

axiosInstance.defaults.headers.common['Authorization'] = 'Basic ' + btoa('11174512:60-dayfreetrial'); 

export default axiosInstance;