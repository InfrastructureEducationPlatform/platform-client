export type InstalledPluginsProjection = {
  id: string;
  name: string;
  description: string;
  pluginInstallation: {
    channelId: string;
    installedAt: string;
  };
};
