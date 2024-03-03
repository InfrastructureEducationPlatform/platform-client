import { Flex, Menu, MenuProps, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import { MainLayout } from '../components/MainLayout.tsx';
import { ChannelMemberPreferences } from '../components/preferences/ChannelMemberPreferences.tsx';
import { ChannelPluginPreference } from '../components/preferences/ChannelPluginPreference.tsx';
import { GeneralAccountPreferences } from '../components/preferences/GeneralAccountPreferences.tsx';
import { GeneralChannelPreferences } from '../components/preferences/GeneralChannelPreferences.tsx';
import { useChannelNavigationContext } from '../components/providers/ChannelNavigationProvider.tsx';
import { useUserContext } from '../components/providers/UserContextProvider.tsx';

export type PreferenceType = 'account' | 'channels';

export function PreferencePage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<PreferenceType>('account');

  const menuItems: MenuProps['items'] = [
    {
      label: '계정 정보/설정',
      key: 'account',
      onClick: () => navigate('/preferences/account'),
    },
    {
      label: '채널 설정',
      key: 'channels',
      onClick: () => navigate('/preferences/channels'),
    },
  ];

  return (
    <MainLayout pageKey={'preferences'}>
      <Flex
        style={{
          // Border Left Only
          borderLeft: '1px solid #e6e6e6',
          background: 'white',
          height: '100%',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        <div>
          <Typography.Title level={2} style={{ margin: 0 }}>
            설정
          </Typography.Title>
          <Typography.Text type={'secondary'}>
            You can change your preferences here.
          </Typography.Text>
        </div>
        <Menu selectedKeys={[current]} items={menuItems} mode={'horizontal'} />
        <Routes>
          <Route
            path={'/'}
            element={<Navigate to={'/preferences/account'} />}
          />
          <Route
            path={'/account'}
            element={<GeneralAccountPreferences setCurrent={setCurrent} />}
          />
          <Route
            path={'/channels/*'}
            element={<TestChannel setCurrent={setCurrent} />}
          />
        </Routes>
      </Flex>
    </MainLayout>
  );
}

function TestChannel({
  setCurrent,
}: {
  setCurrent: (current: PreferenceType) => void;
}) {
  const { setForceReload } = useUserContext();
  const { currentChannel } = useChannelNavigationContext();
  useEffect(() => {
    setCurrent('channels');
  }, [setCurrent]);

  return (
    <Routes>
      <Route
        path={'/:channelId'}
        element={
          <Flex
            style={{
              flexDirection: 'column',
              gap: '20px',
              paddingLeft: '16px',
            }}
          >
            <GeneralChannelPreferences
              channelId={currentChannel.channelId}
              forceReloadUserContext={setForceReload}
            />
            <ChannelMemberPreferences channelId={currentChannel.channelId} />
            <ChannelPluginPreference channelId={currentChannel.channelId} />
          </Flex>
        }
      />
      <Route
        path={'*'}
        element={
          <Navigate to={`/preferences/channels/${currentChannel.channelId}`} />
        }
      />
    </Routes>
  );
}
