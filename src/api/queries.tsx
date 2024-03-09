import { UserOutlined } from '@ant-design/icons';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DeploymentListElementProps } from '../Pages/DeploymentListPage.tsx';
import {
  DatabaseBlock,
  VirtualMachineBlock,
  WebServerBlock,
} from '../types/BlockTypes.ts';
import { InstalledPluginsProjection } from '../types/InstalledPluginsProjection.ts';
import { UserContext } from '../types/UserContext.ts';
import {
  channelApi,
  deploymentApi,
  pluginApi,
  pricingApi,
  sketchApi,
  userApi,
} from './index.ts';

export function useChannelInformationQuery(
  channelId: string,
  forceReload: string,
) {
  return useQuery({
    placeholderData: keepPreviousData,
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

export const useAvailablePluginsQuery = (channelId: string) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: ['availablePlugins', channelId],
    queryFn: async () => {
      const response = await pluginApi.listAvailablePlugins(channelId);

      return response.data;
    },
  });
};

export const useInstalledPluginsQuery = (channelId: string) => {
  return useQuery({
    queryKey: ['installedPlugins', channelId],
    queryFn: async (): Promise<InstalledPluginsProjection[]> => {
      const response = await pluginApi.listAvailablePlugins(channelId);

      return response.data
        .filter((data) => data.pluginInstallation !== null)
        .map((data) => ({
          id: data.id,
          name: data.name,
          description: data.description,
          pluginInstallation: {
            channelId: data.pluginInstallation!.channelId!,
            installedAt: data.pluginInstallation!.installedAt!,
          },
        }));
    },
  });
};

export const useDeploymentListAsMenuQuery = (forceReloadKey: string) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: ['deployments', forceReloadKey],
    queryFn: async () => {
      const response = await deploymentApi.getDeploymentInformationListAsync();

      return {
        deploymentLogReference: response.data,
        deploymentMenuList: response.data.map((a) => {
          return {
            key: a.deploymentId,
            label: a.deploymentId,
            icon: <UserOutlined />,
          };
        }),
      };
    },
  });
};

export const useDeploymentInformationListQuery = (forceReloadKey: string) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: ['deploymentInformationList', forceReloadKey],
    queryFn: async (): Promise<DeploymentListElementProps[]> => {
      const response = await deploymentApi.getDeploymentInformationListAsync();

      return response.data.map((a) => {
        return {
          deploymentId: a.deploymentId,
          channelName: a.channelName,
          sketchId: a.sketchId,
          sketchName: a.sketchName,
          deployDate: a.createdAt,
          deployStatus: a.deploymentStatus,
        };
      });
    },
  });
};

export const useDeploymentInformationQuery = (
  deploymentId: string,
  forceReloadKey: string,
) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: ['deploymentInformation', deploymentId, forceReloadKey],
    queryFn: async () => {
      const response =
        await deploymentApi.getDeploymentInformationAsync(deploymentId);

      return response.data;
    },
  });
};

type MultipleBlockType = VirtualMachineBlock | WebServerBlock | DatabaseBlock;
export const useSketchBlockQuery = (channelId: string, sketchId: string) => {
  return useQuery({
    queryKey: ['sketchBlock', channelId, sketchId],
    queryFn: async () => {
      const response = await sketchApi.getSketchAsync(channelId, sketchId);

      return response.data.blockSketch.blockList as MultipleBlockType[];
    },
  });
};

export const usePricingQuery = () => {
  return useQuery({
    queryKey: ['pricing'],
    queryFn: async () => {
      const response = await pricingApi.getAllPricingInformationAsync();

      return response.data;
    },
  });
};
