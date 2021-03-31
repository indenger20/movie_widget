import { createContext } from 'react';
import { AxiosInstance } from 'axios';

export const AxiosContext = createContext({
  axios: <AxiosInstance>{},
});
