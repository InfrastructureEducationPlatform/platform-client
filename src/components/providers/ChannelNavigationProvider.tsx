import React, { createContext, useContext, useEffect, useState } from 'react';

import { UserContext } from '../../types/UserContext.ts';
import { useUserContext } from './UserContextProvider.tsx';

type ChannelNavigationContextValue = {
  currentChannel: CurrentChannel;
  setChannelInformation: (channelId: string) => void;
};

type CurrentChannel = {
  channelId: string;
  channelName: string;
};

const ChannelNavigationContext = createContext<
  ChannelNavigationContextValue | undefined
>(undefined);
export function ChannelNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const userContext = useUserContext();
  const [currentChannel, setCurrentChannel] = useState<CurrentChannel>();
  const [channelId, setChannelId] = useState<string>(
    getSelectedChannelIdOrDefault(userContext),
  );

  useEffect(() => {
    const selectedChannel = userContext.channelPermissions.filter(
      (a) => a.id === channelId,
    )[0];
    setCurrentChannel({
      channelId: selectedChannel.id,
      channelName: selectedChannel.name,
    });
  }, [channelId, userContext.channelPermissions]);

  if (!currentChannel) {
    return <div>로딩중</div>;
  }

  return (
    <ChannelNavigationContext.Provider
      value={{
        currentChannel: currentChannel,
        setChannelInformation: (a) => {
          localStorage.setItem('selectedChannelId', a);
          setChannelId(a);
        },
      }}
    >
      {children}
    </ChannelNavigationContext.Provider>
  );
}

export function useChannelNavigationContext() {
  const channelNavigationContext = useContext(ChannelNavigationContext);
  if (!channelNavigationContext) {
    throw new Error(
      'useChannelNavigationContext must be used within a ChannelNavigationProvider',
    );
  }

  return channelNavigationContext;
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
