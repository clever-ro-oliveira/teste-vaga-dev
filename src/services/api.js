import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/Projects/teste-vaga-dev/api",
});

export default api;