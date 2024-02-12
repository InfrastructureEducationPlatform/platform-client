import { CloseOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Flex,
  Menu,
  MenuProps,
  Modal,
  Typography,
} from 'antd';
import React, { useState } from 'react';

import { ChannelPermission } from '../../types/UserContext.ts';
import { GenerateMenuItem } from '../ChannelSelector.tsx';
import { useUserContext } from '../providers/UserContextProvider.tsx';
import { GeneralAccountPreferences } from './GeneralAccountPreferences.tsx';
import { GeneralChannelPreferences } from './GeneralChannelPreferences.tsx';

type PreferencesMode = 'account-general' | 'channel-general';

export function Preferences({
  modalVisible,
  setModalVisible,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}) {
  return (
    <Modal
      open={modalVisible}
      centered
      footer={null}
      modalRender={() => (
        <InnerModalContent setModalVisible={setModalVisible} />
      )}
      width={'60%'}
      style={{
        pointerEvents: 'all',
      }}
    />
  );
}

function InnerModalContent({
  setModalVisible,
}: {
  setModalVisible: (visible: boolean) => void;
}) {
  const { userContext: userInfo, setForceReload } = useUserContext();
  const [preferencesMode, setPreferencesMode] =
    useState<PreferencesMode>('account-general');
  const [preferenceSelectedChannel, setPreferenceSelectedChannel] =
    useState<ChannelPermission>(userInfo.channelPermissions[0]);
  const renderMap = {
    'account-general': (
      <GeneralAccountPreferences
        userContext={userInfo}
        setForceReload={setForceReload}
      />
    ),
    'channel-general': (
      <GeneralChannelPreferences
        channelId={preferenceSelectedChannel.id}
        forceReloadUserContext={setForceReload}
      />
    ),
  };
  const menuItems: MenuProps['items'] = [
    {
      key: 'account',
      label: '계정 설정',
      type: 'group',
      children: [
        {
          key: 'profile-overview',
          label: (
            <Flex style={{ flexDirection: 'column' }}>
              <Typography.Text>{userInfo.userName}</Typography.Text>
              <Typography.Text type={'secondary'}>
                {userInfo.userEmail}
              </Typography.Text>
            </Flex>
          ),
          style: {
            height: '60px',
          },
        },
        {
          key: 'user-profile-settings',
          label: '내 계정 정보',
          icon: <UserOutlined />,
          onClick: () => setPreferencesMode('account-general'),
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
                items: GenerateMenuItem(userInfo),
                onClick: (a) => {
                  setPreferenceSelectedChannel(
                    userInfo.channelPermissions.filter(
                      (b) => b.id === a.key,
                    )[0],
                  );
                },
              }}
              placement="topRight"
            >
              <Flex
                gap={20}
                style={{ height: '100%', justifyContent: 'space-between' }}
              >
                <Flex
                  style={{
                    flexDirection: 'column',
                    gap: 2,
                    justifyContent: 'center',
                  }}
                >
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    {preferenceSelectedChannel.name}
                  </Typography.Title>
                  <Typography.Text type={'secondary'}>
                    Permission: {preferenceSelectedChannel.permission}
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
          key: 'channel-general-settings',
          label: '채널 정보',
          onClick: () => setPreferencesMode('channel-general'),
        },
      ],
    },
  ];
  return (
    <Flex
      style={{
        background: 'white',
        borderRadius: '8px',
        height: '400px',
        overflow: 'hidden',
      }}
    >
      <Flex
        style={{
          background: 'rgba(55, 53, 47, 0.03)',
          width: '240px',
        }}
      >
        <Menu
          mode="inline"
          items={menuItems}
          defaultSelectedKeys={['user-profile-settings']}
        />
      </Flex>
      {renderMap[preferencesMode]}
      <Button
        icon={<CloseOutlined />}
        shape={'circle'}
        type={'text'}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
        }}
        onClick={() => setModalVisible(false)}
      />
    </Flex>
  );
}
