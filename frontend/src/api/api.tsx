import axios from 'axios'

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

const axiosInstance = getAxiosInstance('form')

const api = {
  /* Users */
  getUser() {
    return axiosInstance.get('/client')
  },
  updateUser(data: FormData) {
    return axiosInstance.put('/users', data)
  }
}

export default api
