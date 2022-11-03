import axios from 'axios';

// axios.defaults.withCredentials = true;

const httpService = axios.create({
  withCredentials: true,
  credentials: 'include',
  baseURL: 'http://localhost:4000',
  timeout: 5000,
  headers: {
    'Content-type': 'application/json',
  },
});

export default httpService;
