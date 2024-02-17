import { Avatar, Dropdown, Flex, MenuProps } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useState } from 'react';
import { FaRegBell } from 'react-icons/fa6';

import { ChannelSelector } from './ChannelSelector.tsx';
import { Preferences } from './preferences/Preferences.tsx';
import { useChannelNavigationContext } from './providers/ChannelNavigationProvider.tsx';
import { useUserContext } from './providers/UserContextProvider.tsx';

export function TopBarHeader({
  selectorRef,
}: {
  selectorRef: React.Ref<HTMLDivElement> | undefined;
}) {
  const { userContext } = useUserContext();
  const channelNavigationContext = useChannelNavigationContext();
  const [preferencesVisible, setPreferencesVisible] = useState(false);
  const userMenu: MenuProps['items'] = [
    {
      key: 'settings',
      label: '설정',
      onClick: () => {
        setPreferencesVisible(() => true);
      },
    },
  ];
  return (
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
      <Flex ref={selectorRef} style={{ alignItems: 'center', gap: 20 }}>
        <Avatar size={'large'}>
          {channelNavigationContext.currentChannel.channelName.charAt(0)}
        </Avatar>
        <ChannelSelector userContext={userContext} />
      </Flex>
      <Flex style={{ alignItems: 'center', gap: 20 }}>
        <FaRegBell size={'32px'} />
        <Dropdown
          menu={{
            items: userMenu,
          }}
        >
          <Avatar size={'large'} src={userContext.userProfilePictureUrl}>
            {userContext.userProfilePictureUrl
              ? undefined
              : userContext.userName.charAt(0).toUpperCase()}
          </Avatar>
        </Dropdown>
      </Flex>
      <Preferences
        modalVisible={preferencesVisible}
        setModalVisible={setPreferencesVisible}
        initialMode={'account-general'}
      />
    </Header>
  );
}
