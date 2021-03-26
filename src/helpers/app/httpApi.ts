import axios from 'axios';
import { toast } from 'react-toastify';
import { MOVIE_API_KEY, MOVIE_API_PATH } from 'config/appConfig';

export function httpApi() {
  const instance = axios.create({
    baseURL: MOVIE_API_PATH,
  });
  instance.interceptors.request.use((config) => {
    config.params['api_key'] = MOVIE_API_KEY;
    return config;
  });
  instance.interceptors.response.use(undefined, (error) => {
    const responseMsg = error.response?.data?.status_message || error.message;
    toast.error(responseMsg);
    return Promise.reject(error);
  });
  return instance;
}
