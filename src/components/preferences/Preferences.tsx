import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Menu, MenuProps, Modal, Typography } from 'antd';
import { useState } from 'react';

import { useUserContext } from '../providers/UserContextProvider.tsx';
import { GeneralAccountPreferences } from './GeneralAccountPreferences.tsx';

type PreferencesMode = 'account-general';

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
  const userInfo = useUserContext();
  const [preferencesMode, setPreferencesMode] =
    useState<PreferencesMode>('account-general');
  const renderMap = {
    'account-general': <GeneralAccountPreferences userContext={userInfo} />,
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
    },
  ];
  return (
    <Flex
      style={{
        background: 'white',
        borderRadius: '8px',
        height: '400px',
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
