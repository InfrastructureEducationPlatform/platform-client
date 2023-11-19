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
  return (
    <Dropdown
      menu={{ items: generateMenuItem(userContext), onClick: handleMenuClick }}
      placement="topRight"
    >
      <Flex gap={20} style={{ height: '100%' }}>
        <Flex
          style={{ flexDirection: 'column', gap: 2, justifyContent: 'center' }}
        >
          <Title level={5} style={{ margin: 0 }}>
            ChannelName
          </Title>
          <Text type={'secondary'}>Collaborators: count</Text>
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
    <Flex gap={20} style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Avatar style={{ verticalAlign: 'middle' }} size={'large'}>
        T
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
