import { useQuery } from '@tanstack/react-query';

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
