import { useQuery } from '@tanstack/react-query';

import { channelApi } from './index.ts';

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
