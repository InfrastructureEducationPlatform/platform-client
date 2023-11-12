import { AuthApi, ChannelApi, Configuration, UsersApi } from "../libs/core-api/api";

const configuration = new Configuration({
    basePath: "https://api.blockinfra.kangdroid.me",
  });

export const authApi = new AuthApi(configuration);
export const channelApi = new ChannelApi(configuration);
export const userApi = new UsersApi(configuration);