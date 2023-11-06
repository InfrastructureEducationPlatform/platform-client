import { AuthApi, Configuration } from "../libs/core-api/api";

const configuration = new Configuration({
    basePath: "https://api.blockinfra.kangdroid.me",
  });

export const authApi = new AuthApi(configuration)