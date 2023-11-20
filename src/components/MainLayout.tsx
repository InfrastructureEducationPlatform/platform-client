import { LaptopOutlined } from '@ant-design/icons';
import { Avatar, Flex, Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import React, { ReactNode } from 'react';
import { FaRegBell } from 'react-icons/fa6';

import { UserContext } from '../types/UserContext.ts';
import { ChannelSelector } from './ChannelSelector.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';
import {
  ChannelNavigationProvider,
  useChannelNavigationContext,
} from './providers/ChannelNavigationProvider.tsx';
import { ErrorHandlerProvider } from './providers/ErrorProvider.tsx';
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
    <ErrorHandlerProvider>
      <AuthProvider>
        <UserContextProvider>
          <ChannelNavigationProvider>
            <InnerLayout>{children}</InnerLayout>
          </ChannelNavigationProvider>
        </UserContextProvider>
      </AuthProvider>
    </ErrorHandlerProvider>
  );
}

function InnerLayout({ children }: { children: ReactNode }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const userContext = useUserContext();
  const channelNavigationContext = useChannelNavigationContext();

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
          <Avatar size={'large'}>
            {channelNavigationContext.currentChannel.channelName.charAt(0)}
          </Avatar>
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
          <Content style={{ overflow: 'scroll' }}>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
