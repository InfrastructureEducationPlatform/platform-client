import { useMutation } from '@tanstack/react-query';

import {
  AddUserToChannelRequest,
  ChannelPermissionType,
} from '../libs/core-api/api';
import { channelApi } from './index.ts';

export const useUpdateChannelPermissionMutation = (
  channelId: string,
  onSuccess?: () => void,
) => {
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
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useRemoveUserFromChannelMutation = (
  channelId: string,
  onSuccess?: () => void,
) => {
  return useMutation({
    mutationKey: ['remove-user-from-channel', channelId],
    mutationFn: async (targetUserId: string) => {
      await channelApi.removeUserFromChannelAsync(channelId, targetUserId);
    },
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};

export const useAddMemberToChannelMutation = (
  channelId: string,
  onSuccess?: () => void,
) => {
  return useMutation({
    mutationKey: ['add-member-to-channel', channelId],
    mutationFn: async (addUserToChannelRequest: AddUserToChannelRequest) => {
      await channelApi.addUserToChannelAsync(
        channelId,
        addUserToChannelRequest,
      );
    },
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
  });
};
