import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: "https://delicate-glitter-1822.fly.dev/api",
})

api.interceptors.response.use(
  response => {
      if (response && response.data.status === 'error') {
        console.log(response)
        
          // Vue.notify({
          //     title: 'error--header',
          //     text: 'error---text',
          //     type: 'error'
          // })
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

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export {
  api,
  Toast
}
