import { Avatar, Flex } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { FaRegBell } from 'react-icons/fa6';

import { ChannelSelector } from './ChannelSelector.tsx';
import { useChannelNavigationContext } from './providers/ChannelNavigationProvider.tsx';
import { useUserContext } from './providers/UserContextProvider.tsx';

export function TopBarHeader() {
  const userContext = useUserContext();
  const channelNavigationContext = useChannelNavigationContext();
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
  );
}
