import { AxiosHeaders } from 'axios';

export function initializeHeader(): AxiosHeaders {
  let accessToken: string = localStorage.getItem('accessToken') || '';
  const headers = new AxiosHeaders();
  headers.setAuthorization(`Bearer ${accessToken}`);

  return headers;
}
