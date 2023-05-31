import axios from 'axios'
import Swal from 'sweetalert2'

const api = axios.create({
  baseURL: 'https://delicate-glitter-1822.fly.dev/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

api.interceptors.response.use(
  async (response) => {
    if (response) {
      if (
        response.data.status === 'error' ||
        response.data.status === 'errors'
      ) {
        const result = await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.data.message,
          confirmButtonColor: '#4A148C',
          focusConfirm: false
        })
        if (result.isConfirmed) {
          window.location.reload()
        }
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

const SwalSuccess = (message: string) => {
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: message,
    timer: 1200,
    timerProgressBar: true,
    showConfirmButton: false
  })
}

export { api, SwalSuccess }
