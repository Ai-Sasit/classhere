import axios from "axios";

export const api = axios.create({
  baseURL: "https://delicate-glitter-1822.fly.dev/api",
});
