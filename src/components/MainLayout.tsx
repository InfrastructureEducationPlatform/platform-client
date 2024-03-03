import { LaptopOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import React, { ReactNode, useState } from 'react';

import { TopBarHeader } from './TopBarHeader.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';
import { ChannelNavigationProvider } from './providers/ChannelNavigationProvider.tsx';
import { ErrorHandlerProvider } from './providers/ErrorProvider.tsx';
import { UserContextProvider } from './providers/UserContextProvider.tsx';

const { Content, Sider } = Layout;

export type PageKey = 'sketch-list';

const leftSideMenuItem: MenuProps['items'] = [
  {
    key: 'sketch-list',
    label: '스케치 리스트',
    icon: <LaptopOutlined />,
  },
];

export function MainLayout({
  children,
  selectorRef,
  pageKey,
}: {
  children: ReactNode;
  selectorRef?: React.Ref<HTMLDivElement> | undefined;
  pageKey: PageKey;
}) {
  return (
    <ErrorHandlerProvider>
      <AuthProvider>
        <UserContextProvider>
          <ChannelNavigationProvider>
            <InnerLayout pageKey={pageKey} selectorRef={selectorRef}>
              {children}
            </InnerLayout>
          </ChannelNavigationProvider>
        </UserContextProvider>
      </AuthProvider>
    </ErrorHandlerProvider>
  );
}

function InnerLayout({
  children,
  selectorRef,
  pageKey,
}: {
  children: ReactNode;
  selectorRef: React.Ref<HTMLDivElement> | undefined;
  pageKey: PageKey;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: '100vh' }}>
      <TopBarHeader selectorRef={selectorRef} />
      <Layout>
        <Sider
          width={200}
          style={{ background: 'white' }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={
            <div style={{ background: 'white' }}>
              {collapsed ? (
                <RightOutlined style={{ color: 'black' }} />
              ) : (
                <LeftOutlined style={{ color: 'black' }} />
              )}
            </div>
          }
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={[pageKey]}
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
