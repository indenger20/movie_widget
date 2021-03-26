import axios from 'axios';
import { toast } from 'react-toastify';
import { MOVIE_API_KEY } from 'config/appConfig';

export function httpApi(baseURL: string) {
  const instance = axios.create({
    baseURL,
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
