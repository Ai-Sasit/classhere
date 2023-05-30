import axios from 'axios'
import Swal from 'sweetalert2'

const api = axios.create({
  baseURL: 'https://delicate-glitter-1822.fly.dev/api'
})

api.interceptors.response.use(
  (response) => {
    if (response) {
      if (
        response.data.status === 'error' ||
        response.data.status === 'errors'
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.data.message,
          confirmButtonColor: '#4A148C',
          focusConfirm: false
        })
      }
    }
    return response
  },
  function (error) {
    if (error && error.response && error.response.status === 500) {
      console.log(error.response)
    } else if (error && error.response && error.response.status === 408) {
      console.log(error.response)
    }
  }
)

export { api }
