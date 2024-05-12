import axios from 'axios'

type ProfileFormType = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

type PrivacyFormType = {
  current_password: string;
  password: string;
  confirm_password: string;
}

const getAxiosInstance = (type: string) => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000
  })

  axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`
    config.headers['Content-Type'] = type === 'json' ? 'application/json' : 'multipart/form-data'
    
    return config
  })

  return axiosInstance
}

const axiosInstance = getAxiosInstance('json')

const api = {
  /* Users */
  getUser() {
    return axiosInstance.get('/client')
  },
  updateUser(data: ProfileFormType) {
    return axiosInstance.put('/client', { data: data })
  },
  updateUserPassword(data: PrivacyFormType) {
    return axiosInstance.put('/client/password', { data: data })
  }
}

export default api
