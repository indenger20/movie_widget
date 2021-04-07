import axios from 'axios';

export function httpApi({
  apiKey,
  baseURL,
  handleError,
}: {
  apiKey: string;
  baseURL: string;
  handleError?(err: string): void;
}) {
  const instance = axios.create({
    baseURL,
  });
  instance.interceptors.request.use((config) => {
    config.params['api_key'] = apiKey;
    return config;
  });
  instance.interceptors.response.use(undefined, (error) => {
    const responseMsg = error.response?.data?.status_message || error.message;
    if (handleError) {
      handleError(responseMsg);
    }
    return Promise.reject(error);
  });
  return instance;
}
