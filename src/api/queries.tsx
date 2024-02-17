import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { UserContext } from '../types/UserContext.ts';
import { channelApi, userApi } from './index.ts';

export function useChannelInformationQuery(
  channelId: string,
  forceReload: string,
) {
  return useQuery({
    queryKey: ['channelInformation', channelId, forceReload],
    queryFn: async () => {
      const response = await channelApi.getChannelInformationAsync(channelId);
      return response.data;
    },
  });
}

export const useChannelUserSearch = (searchQuery: string) => {
  return useQuery({
    queryKey: ['channelUserSearch', searchQuery],
    queryFn: async () => {
      console.log('searchQuery', searchQuery);
      if (searchQuery === '') return [];
      const response = await userApi.searchUserAsync(searchQuery);
      return response.data;
    },
  });
};

export const useUserContextQuery = (forceReload: string) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: ['userContext', forceReload],
    queryFn: async (): Promise<UserContext> => {
      const response = await userApi.getUsersDetailProjectionAsync();
      return {
        userId: response.data.userId,
        userName: response.data.name,
        userEmail: response.data.email,
        userProfilePictureUrl: response.data.profilePictureImageUrl as
          | string
          | undefined,
        channelPermissions: response.data.channelPermissionList.map((a) => ({
          id: a.channelId,
          name: a.channelName,
          permission: a.channelPermissionType,
        })),
      };
    },
  });
};
