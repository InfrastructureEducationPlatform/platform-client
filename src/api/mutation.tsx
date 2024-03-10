import { useMutation } from '@tanstack/react-query';

import { useErrorHandler } from '../components/providers/ErrorProvider.tsx';
import {
  AddUserToChannelRequest,
  ChannelPermissionType,
} from '../libs/core-api/api';
import { channelApi, deploymentApi, userApi } from './index.ts';

export const useUpdateChannelPermissionMutation = (
  channelId: string,
  onSuccess?: () => void,
) => {
  const { showError } = useErrorHandler();
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
    onError: (error) => {
      showError(error);
    },
  });
};

export const useRemoveUserFromChannelMutation = (
  channelId: string,
  onSuccess?: () => void,
) => {
  const { showError } = useErrorHandler();
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
    onError: (error) => {
      showError(error);
    },
  });
};

export const useAddMemberToChannelMutation = (
  channelId: string,
  onSuccess?: () => void,
) => {
  const { showError } = useErrorHandler();
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
    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteAccount = () => {
  const { showError } = useErrorHandler();
  return useMutation({
    mutationKey: ['delete-account'],
    mutationFn: async () => {
      await userApi.deleteUserAsync();
    },
    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteDeployment = () => {
  return useMutation({
    mutationKey: ['delete-deployment'],
    mutationFn: async (deploymentId: string) => {
      await deploymentApi.destroyDeploymentAsync(deploymentId);
    },
  });
};
