import { CloseOutlined } from '@ant-design/icons';
import { Button, Flex, Menu } from 'antd';
import React, { useEffect, useState } from 'react';

import { ChannelPermission } from '../../types/UserContext.ts';
import { CustomModal } from '../CustomModal.tsx';
import { useUserContext } from '../providers/UserContextProvider.tsx';
import { GeneralAccountPreferences } from './GeneralAccountPreferences.tsx';
import { GeneralChannelPreferences } from './GeneralChannelPreferences.tsx';
import { CreatePreferenceMenuItems } from './PreferenceMenuItems.tsx';

export type PreferencesMode = 'account-general' | 'channel-general';

export function Preferences({
  modalVisible,
  setModalVisible,
  initialMode,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  initialMode: PreferencesMode;
}) {
  const { userContext: currentUserInfo, setForceReload } = useUserContext();
  const [preferencesMode, setPreferencesMode] =
    useState<PreferencesMode>(initialMode);
  const [preferenceSelectedChannel, setPreferenceSelectedChannel] =
    useState<ChannelPermission>(currentUserInfo.channelPermissions[0]);
  const menuItems = CreatePreferenceMenuItems({
    currentUserInfo: currentUserInfo,
    currentChannel: preferenceSelectedChannel,
    setCurrentChannel: setPreferenceSelectedChannel,
    setPreferenceMode: setPreferencesMode,
  });

  // Make sure we are setting to initial model when modal is visible
  useEffect(() => {
    setPreferencesMode(initialMode);
  }, [initialMode, modalVisible]);

  // When user context is updated, we need to update the selected channel
  useEffect(() => {
    setPreferenceSelectedChannel(
      currentUserInfo.channelPermissions.filter(
        (b) => b.id === preferenceSelectedChannel.id,
      )[0],
    );
  }, [currentUserInfo]);

  const renderMap = {
    'account-general': (
      <GeneralAccountPreferences
        userContext={currentUserInfo}
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

  return (
    <CustomModal isVisible={modalVisible}>
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
            defaultSelectedKeys={[initialMode]}
            selectedKeys={[preferencesMode]}
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
          onClick={() => {
            setModalVisible(false);
          }}
        />
      </Flex>
    </CustomModal>
  );
}
