import axios from 'axios';

import {
  AuthApi,
  ChannelApi,
  Configuration,
  SketchApi,
  UsersApi,
} from '../libs/core-api/api';

const configuration = new Configuration({
  basePath: 'https://api.blockinfra.kangdroid.me',
});

const defaultAuthorizationInstance = axios.create();
defaultAuthorizationInstance.interceptors.request.use(async (config) => {
  let token: string | undefined;

  try {
    token = localStorage.getItem('accessToken') ?? undefined;
    if (!token) {
      throw new Error('Cannot find access token on storage');
    }
  } catch (e) {
    window.location.href = '/';
  }

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

defaultAuthorizationInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const {
      config,
      response: { status },
    } = error;

    if (status === 401 && !config.sent) {
      config.sent = true;
      const refreshToken = await authApi.refreshAsync({
        accessToken: localStorage.getItem('accessToken')!,
        refreshToken: localStorage.getItem('refreshToken')!,
      });

      if (refreshToken.data) {
        localStorage.setItem('accessToken', refreshToken.data.token);
        localStorage.setItem('refreshToken', refreshToken.data.refreshToken!);
        config.headers.Authorization = `Bearer ${refreshToken.data.token}`;
        return axios(config);
      }
    }

    if (config.url.includes('/auth/refresh') && status === 401 && config.sent) {
      console.log('Refresh Token is not valid. Redirecting to login page.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }

    return Promise.reject(error);
  },
);

export const authApi = new AuthApi(configuration);
export const channelApi = new ChannelApi(
  configuration,
  undefined,
  defaultAuthorizationInstance,
);
export const userApi = new UsersApi(
  configuration,
  undefined,
  defaultAuthorizationInstance,
);
export const sketchApi = new SketchApi(
  configuration,
  undefined,
  defaultAuthorizationInstance,
);
