import { useMutation } from '@tanstack/react-query';

import { ChannelPermissionType } from '../libs/core-api/api';
import { channelApi } from './index.ts';

export const useUpdateChannelPermissionMutation = (channelId: string) => {
  return useMutation({
    mutationKey: ['update-channel-permission', channelId],
    mutationFn: async ({
      targetUserId,
      channelPermissionType,
    }: {
      targetUserId: string;
      channelPermissionType: ChannelPermissionType;
    }) => {
      await channelApi.updateUserChannelRoleAsync(channelId, {
        userId: targetUserId,
        channelPermissionType: channelPermissionType,
      });
    },
  });
};

export const useRemoveUserFromChannelMutation = (channelId: string) => {
  return useMutation({
    mutationKey: ['remove-user-from-channel', channelId],
    mutationFn: async (targetUserId: string) => {
      await channelApi.removeUserFromChannelAsync(channelId, targetUserId);
    },
  });
};
