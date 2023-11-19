import { DownOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Flex, MenuProps, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../types/UserContext.ts';

const { Text } = Typography;

export function ChannelSelector({ userContext }: { userContext: UserContext }) {
  const navigate = useNavigate();
  const handleMenuClick: MenuProps['onClick'] = (data) => {
    console.log(data.key);
    localStorage.setItem('selectedChannelId', data.key);
    navigate('/home');
  };

  const selectedChannelId = getSelectedChannelIdOrDefault(userContext);
  const selectedChannelName = userContext.channelPermissions.filter(
    (a) => a.id === selectedChannelId,
  )[0].name;
  const selectedChannelPermission = userContext.channelPermissions.filter(
    (a) => a.id === selectedChannelId,
  )[0].permission;

  return (
    <Dropdown
      menu={{
        items: generateMenuItem(userContext),
        onClick: handleMenuClick,
        style: { width: '300px' },
      }}
      placement="topRight"
    >
      <Flex gap={20} style={{ height: '100%' }}>
        <Flex
          style={{ flexDirection: 'column', gap: 2, justifyContent: 'center' }}
        >
          <Title level={5} style={{ margin: 0 }}>
            {selectedChannelName}
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

function ChannelSelectionMenuItems({
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

function generateMenuItem(userContext: UserContext): MenuProps['items'] {
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

function getSelectedChannelIdOrDefault(userContext: UserContext): string {
  const selectedChannelId = localStorage.getItem('selectedChannelId');
  if (selectedChannelId) {
    return selectedChannelId;
  }

  localStorage.setItem(
    'selectedChannelId',
    userContext.channelPermissions[0].id,
  );

  return userContext.channelPermissions[0].id;
}
