import { LaptopOutlined } from '@ant-design/icons';
import { Avatar, Flex, Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import React, { ReactNode } from 'react';
import { FaRegBell } from 'react-icons/fa6';

import { UserContext } from '../types/UserContext.ts';
import { ChannelSelector } from './ChannelSelector.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';
import {
  UserContextProvider,
  useUserContext,
} from './providers/UserContextProvider.tsx';

const { Header, Content, Sider } = Layout;

const leftSideMenuItem: MenuProps['items'] = [
  {
    key: '1',
    label: '스케치 리스트',
    icon: <LaptopOutlined />,
  },
];

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <UserContextProvider>
        <InnerLayout>{children}</InnerLayout>
      </UserContextProvider>
    </AuthProvider>
  );
}

function InnerLayout({ children }: { children: ReactNode }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const userContext = useUserContext();
  const selectedChannelId = getSelectedChannelIdOrDefault(userContext);
  const selectedChannelName = userContext.channelPermissions.filter(
    (a) => a.id === selectedChannelId,
  )[0].name;
  console.log(selectedChannelName);

  return (
    <Layout style={{ height: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'white',
          paddingLeft: '20px',
          paddingRight: '20px',
          justifyContent: 'space-between',
        }}
      >
        <Flex style={{ alignItems: 'center', gap: 20 }}>
          <Avatar size={'large'}>{selectedChannelName.charAt(0)}</Avatar>
          <ChannelSelector userContext={userContext} />
        </Flex>
        <Flex style={{ alignItems: 'center', gap: 20 }}>
          <FaRegBell size={'32px'} />
          <Avatar size={'large'}>
            {userContext.userName.charAt(0).toUpperCase()}
          </Avatar>
        </Flex>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={leftSideMenuItem}
          />
        </Sider>
        <Layout>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
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
