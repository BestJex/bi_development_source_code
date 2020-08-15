import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Litemall-Admin-Token']为自定义key 请根据实际情况自行修改
      config.headers['X-Litemall-Admin-Token'] = getToken()

    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)


// respone拦截器
service.interceptors.response.use(
   response => {
     // blob类型为文件下载对象，不论是什么请求方式，直接返回文件流数据
     if (response.config.responseType === 'arraybuffer') {
           return Promise.resolve({ data: response.data })
           }
   },
   error => {
     let resp = error.response
         if (resp.data) {
         console.log('err:' + decodeURIComponent(resp.data)) // for debug
         }
     // TODO: 需要依据后端实际情况判断
     return Promise.reject(error)
       }
 )

export default service
