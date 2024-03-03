import Icon from '@ant-design/icons';
import { Button, Card, Flex, Modal, Typography } from 'antd';
import React from 'react';

import { sketchApi } from '../api';
import { useInstalledPluginsQuery } from '../api/queries.tsx';
import { AwsIcon } from '../assets/AwsIcon.tsx';
import { InstalledPluginsProjection } from '../types/InstalledPluginsProjection.ts';

export function SelectInstalledPluginModal({
  isOpen,
  setIsOpen,
  channelId,
  sketchId,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  channelId: string;
  sketchId: string;
}) {
  const { data: installedPlugins } = useInstalledPluginsQuery(channelId);
  return (
    <Modal title="배포 플러그인 선택" open={isOpen} footer={null}>
      {installedPlugins?.map((plugin) => (
        <InstalledPluginEntry
          plugin={plugin}
          onPluginSelected={(plugin) => {
            (async () => {
              await sketchApi.deploySketchAsync(channelId, sketchId, plugin.id);
            })();
            setIsOpen(false);
          }}
        />
      ))}
    </Modal>
  );
}

function InstalledPluginEntry({
  plugin,
  onPluginSelected,
}: {
  plugin: InstalledPluginsProjection;
  onPluginSelected: (plugin: InstalledPluginsProjection) => void;
}) {
  return (
    <Card>
      <Flex
        style={{
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Flex
          style={{
            gap: 10,
            alignItems: 'center',
          }}
        >
          <Icon component={AwsIcon} />
          <div>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {plugin.name}
            </Typography.Title>
            <Typography.Text type={'secondary'}>
              {plugin.description}
            </Typography.Text>
            {plugin.pluginInstallation && (
              <Typography.Text style={{ display: 'block' }} type={'secondary'}>
                플러그인 설치 날짜:{' '}
                {new Date(plugin.pluginInstallation.installedAt!).toString()}
              </Typography.Text>
            )}
          </div>
        </Flex>
      </Flex>
      <Flex style={{ justifyContent: 'flex-end' }}>
        <Button type={'primary'} onClick={() => onPluginSelected(plugin)}>
          선택
        </Button>
      </Flex>
    </Card>
  );
}
