import axios, { AxiosPromise, AxiosRequestConfig, Method } from 'axios';
import { MOVIE_API_KEY } from 'config/appConfig';

interface IRequestData {
  data: any | null;
  method: Method;
  headers?: { [key in any]: string };
}

interface IPayload extends IRequestData {
  partUrl: string;
  baseURL?: string;
}

export interface HttpError {
  error: boolean;
  status: any;
  description: string;
}

interface HttpSuccess<T> {
  data: T;
  status: 'ok' | 'failed';
}

export type HttpResp<T> = T & HttpError & HttpSuccess<T>;

const prepareRequestData = (payload: IPayload): AxiosRequestConfig => {
  const { headers = {}, method = 'GET', data = {} } = payload;

  return {
    data,
    method,
    headers,
  };
};

export async function httpApi<T = { [key in any]: string }>(payload: IPayload) {
  const { partUrl, baseURL = '' } = payload;
  const res: AxiosPromise<T> = axios(
    `${baseURL}${partUrl}`,
    prepareRequestData(payload),
  );

  return res;
}

// Encode data to x-www-form-urlencoded type
export const encodeDataToUrl = (
  params: { [key: string]: any },
  isSkipNull: boolean = true,
) =>
  Object.keys(params)
    .filter((key) => !isSkipNull || (isSkipNull && params[key]))
    .map((key) => {
      if (Array.isArray(params[key])) {
        const out = params[key].map(
          (p: number) => `${encodeURIComponent(key)}[]=${p}`,
        );

        return out.join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    })
    .join('&');

export const prepareMovieDataToUrl = (params: { [key: string]: any }) => {
  return encodeDataToUrl({ ...params, api_key: MOVIE_API_KEY });
};
