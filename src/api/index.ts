import axios from 'axios';

import {
  AuthApi,
  ChannelApi,
  Configuration,
  DeploymentApi,
  FileApi,
  PluginApi,
  PricingApi,
  SketchApi,
  UsersApi,
} from '../libs/core-api/api';
import { LocalStorageUtils } from '../utils/LocalStorageUtils.ts';

const configuration = new Configuration({
  basePath: 'https://api.blockinfra.kangdroid.me',
});

const defaultAuthorizationInstance = axios.create();
defaultAuthorizationInstance.interceptors.request.use(async (config) => {
  let token: string | undefined;

  try {
    token = LocalStorageUtils.getAccessToken() ?? undefined;
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
        accessToken: LocalStorageUtils.getAccessToken()!,
        refreshToken: LocalStorageUtils.getRefreshToken()!,
      });

      if (refreshToken.data) {
        LocalStorageUtils.setAccessToken(refreshToken.data.token);
        LocalStorageUtils.setRefreshToken(refreshToken.data.refreshToken!);
        config.headers.Authorization = `Bearer ${refreshToken.data.token}`;
        return axios(config);
      }
    }

    if (config.url.includes('/auth/refresh') && status === 401 && config.sent) {
      console.log('Refresh Token is not valid. Redirecting to login page.');
      LocalStorageUtils.removeAccessToken();
      LocalStorageUtils.removeRefreshToken();
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

export const fileApi = new FileApi(
  configuration,
  undefined,
  defaultAuthorizationInstance,
);

export const pluginApi = new PluginApi(
  configuration,
  undefined,
  defaultAuthorizationInstance,
);

export const deploymentApi = new DeploymentApi(
  configuration,
  undefined,
  defaultAuthorizationInstance,
);

export const pricingApi = new PricingApi(
  configuration,
  undefined,
  defaultAuthorizationInstance,
);
