import { LaptopOutlined } from '@ant-design/icons';
import { Avatar, Flex, Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaRegBell } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import { userApi } from '../api';
import { ChannelSelector } from '../components/ChannelSelector.tsx';
import { UserContext } from '../types/UserContext.ts';

const { Header, Content, Sider } = Layout;

const leftSideMenuItem: MenuProps['items'] = [
  {
    key: '1',
    label: '스케치 리스트',
    icon: <LaptopOutlined />,
  },
];

export function Home() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const [userChannelInformation, setUserChannelInformation] =
    useState<UserContext>();

  // Load Context Information
  useEffect(() => {
    (async () => {
      const userDetail = await userApi.getUsersDetailProjectionAsync();
      setUserChannelInformation({
        userId: userDetail.data.userId,
        userName: userDetail.data.name,
        userEmail: userDetail.data.email,
        userProfilePictureUrl: undefined,
        channelPermissions: userDetail.data.channelPermissionList.map((a) => ({
          id: a.channelId,
          name: '',
          permission: a.channelPermissionType,
        })),
      });
      if (userDetail.data.channelPermissionList.length == 0) {
        // 채널 생성 온보딩이 필요한 경우
        navigate('/onBoarding');
      }
    })();
  }, [navigate]);

  // If data is not loaded, just show loading screen
  if (!userChannelInformation) {
    return <div>loading...</div>;
  }

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
          <Avatar size={'large'}>asdf</Avatar>
          <ChannelSelector userContext={userChannelInformation} />
        </Flex>
        <Flex style={{ alignItems: 'center', gap: 20 }}>
          <FaRegBell size={'32px'} />
          <Avatar size={'large'}>
            {userChannelInformation.userName.charAt(0).toUpperCase()}
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
          <Content>This is the content area</Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
