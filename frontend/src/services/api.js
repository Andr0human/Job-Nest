import axios from "axios";

const apiInstance = axios.create({ baseURL: process.env.REACT_APP_BASE_URL });

apiInstance.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return req;
});

export default apiInstance;
