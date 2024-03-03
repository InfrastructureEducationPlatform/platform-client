import { DownOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Flex, MenuProps, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react';

import { UserContext } from '../types/UserContext.ts';
import { useChannelNavigationContext } from './providers/ChannelNavigationProvider.tsx';

const { Text } = Typography;

export function ChannelSelector({ userContext }: { userContext: UserContext }) {
  const { currentChannel, setChannelInformation } =
    useChannelNavigationContext();

  const selectedChannelPermission = userContext.channelPermissions.filter(
    (a) => a.id === currentChannel.channelId,
  )[0].permission;

  return (
    <Dropdown
      menu={{
        items: GenerateMenuItem(userContext),
        onClick: (data) => {
          setChannelInformation(data.key);
        },
        style: { width: '300px' },
      }}
      placement="topRight"
    >
      <Flex gap={20} style={{ height: '100%' }}>
        <Flex
          style={{ flexDirection: 'column', gap: 2, justifyContent: 'center' }}
        >
          <Title level={5} style={{ margin: 0 }}>
            {currentChannel.channelName}
          </Title>
          <Text type={'secondary'}>
            Permission: {selectedChannelPermission}
          </Text>
        </Flex>
        <DownOutlined />
      </Flex>
    </Dropdown>
  );
}

export function ChannelSelectionMenuItems({
  channelName,
  channelPermissionType,
}: {
  channelName: string;
  channelPermissionType: string;
}) {
  return (
    <Flex gap={20} style={{ alignItems: 'center' }}>
      <Avatar style={{ verticalAlign: 'middle' }} size={'large'}>
        {channelName.charAt(0)}
      </Avatar>
      <Flex
        style={{ flexDirection: 'column', gap: 2, justifyContent: 'center' }}
      >
        <Title level={5} style={{ margin: 0 }}>
          {channelName}
        </Title>
        <Text type={'secondary'}>Permission: {channelPermissionType}</Text>
      </Flex>
    </Flex>
  );
}

export function GenerateMenuItem(userContext: UserContext): MenuProps['items'] {
  return userContext.channelPermissions.map((a) => ({
    key: a.id,
    label: (
      <ChannelSelectionMenuItems
        channelName={a.name}
        channelPermissionType={a.permission}
      />
    ),
  }));
}
