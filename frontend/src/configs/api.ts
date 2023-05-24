import axios from "axios";
import Swal from "sweetalert2";

export const api = axios.create({
  baseURL: "https://delicate-glitter-1822.fly.dev/api",
});

export const Toast = Swal.mixin({
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
