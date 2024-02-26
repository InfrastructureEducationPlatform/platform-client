import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Flex, MenuProps, Typography } from 'antd';
import React from 'react';

import { ChannelPermission, UserContext } from '../../types/UserContext.ts';
import { GenerateMenuItem } from '../ChannelSelector.tsx';
import { PreferencesMode } from './Preferences.tsx';

export function CreatePreferenceMenuItems({
  currentUserInfo,
  currentChannel,
  setCurrentChannel,
  setPreferenceMode,
}: {
  currentUserInfo: UserContext;
  currentChannel: ChannelPermission;
  setCurrentChannel: (channel: ChannelPermission) => void;
  setPreferenceMode: (preferenceMode: PreferencesMode) => void;
}): MenuProps['items'] {
  return [
    {
      key: 'account',
      label: '계정 설정',
      type: 'group',
      children: [
        {
          key: 'profile-overview',
          label: (
            <Flex style={{ flexDirection: 'column' }}>
              <Typography.Text>{currentUserInfo.userName}</Typography.Text>
              <Typography.Text type={'secondary'}>
                {currentUserInfo.userEmail}
              </Typography.Text>
            </Flex>
          ),
          style: {
            height: '60px',
          },
        },
        {
          key: 'account-general',
          label: '내 계정 정보',
          icon: <UserOutlined />,
          onClick: () => setPreferenceMode('account-general'),
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      key: 'channel-preference',
      label: '채널 설정',
      type: 'group',
      children: [
        {
          key: 'channel-preferences',
          label: (
            <Dropdown
              menu={{
                items: GenerateMenuItem(currentUserInfo),
                onClick: (a) => {
                  setCurrentChannel(
                    currentUserInfo.channelPermissions.filter(
                      (b) => b.id === a.key,
                    )[0],
                  );
                  setPreferenceMode('channel-general');
                },
              }}
              placement="topRight"
            >
              <Flex
                gap={20}
                style={{
                  height: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <Flex
                  style={{
                    flexDirection: 'column',
                    gap: 2,
                    justifyContent: 'center',
                  }}
                >
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    {currentChannel.name}
                  </Typography.Title>
                  <Typography.Text type={'secondary'}>
                    Permission: {currentChannel.permission}
                  </Typography.Text>
                </Flex>
                <DownOutlined />
              </Flex>
            </Dropdown>
          ),
          style: {
            height: '60px',
          },
        },
        {
          key: 'channel-general',
          label: '채널 정보',
          onClick: () => setPreferenceMode('channel-general'),
        },
        {
          key: 'channel-members',
          label: '채널 멤버',
          onClick: () => setPreferenceMode('channel-members'),
        },
        {
          key: 'channel-plugins',
          label: '플러그인',
          onClick: () => setPreferenceMode('channel-plugins'),
        },
      ],
    },
  ];
}
