import { UserContext } from '../types/UserContext.ts';

export class LocalStorageUtils {
  static accessTokenKey: string = 'accessToken';
  static refreshTokenKey: string = 'refreshToken';
  static selectedChannelKey: string = 'selectedChannelId';
  static userContextKey: string = 'userContext';
  static joinTokenKey: string = 'joinToken';

  static setAccessToken(accessToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  static removeAccessToken() {
    localStorage.removeItem(this.accessTokenKey);
  }

  static setRefreshToken(refreshToken: string) {
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  static removeRefreshToken() {
    localStorage.removeItem(this.refreshTokenKey);
  }

  static setSelectedChannelId(channelId: string) {
    localStorage.setItem(this.selectedChannelKey, channelId);
  }

  static getSelectedChannelId(): string | null {
    return localStorage.getItem(this.selectedChannelKey);
  }

  static getUserContext(): UserContext | null {
    const userContextStr = localStorage.getItem(this.userContextKey);
    return userContextStr === null ? null : JSON.parse(userContextStr);
  }

  static setUserContext(userContext: UserContext) {
    localStorage.setItem(this.userContextKey, JSON.stringify(userContext));
  }

  static removeUserContext() {
    localStorage.removeItem(this.userContextKey);
  }

  static setJoinToken(joinToken: string) {
    localStorage.setItem(this.joinTokenKey, joinToken);
  }

  static getJoinToken(): string | null {
    return localStorage.getItem(this.joinTokenKey);
  }
}
