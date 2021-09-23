import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = "http://10.76.0.166:23333/iev";

// TODO: timeline接口响应有点慢，所以设置成25s。如果此时还没有返回，则抛出error。
const TIME_OUT = 25000;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
});

const httpRequest = {
  get(url: string, config?: AxiosRequestConfig) {
    return new Promise((resolve, reject) => {
      instance
        .get(url, config ?? {})
        .then((res) => resolve(res))
        .catch((err) => {
          reject(err);
        });
    });
  },
  post(url: string, data?: any, config?: AxiosRequestConfig) {
    return new Promise((resolve, reject) => {
      instance
        .post(url, data, config ?? {})
        .then((res) => resolve(res))
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export { httpRequest };
