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
