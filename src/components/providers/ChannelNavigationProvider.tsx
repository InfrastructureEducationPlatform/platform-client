import React, { createContext, useContext, useEffect, useState } from 'react';

import { UserContext } from '../../types/UserContext.ts';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils.ts';
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
  const { userContext } = useUserContext();
  const [channelId, setChannelId] = useState<string>(
    getSelectedChannelIdOrDefault(userContext),
  );

  const [currentChannel, setCurrentChannel] = useState<CurrentChannel>(() => {
    const selectedChannel = userContext.channelPermissions.filter(
      (a) => a.id === channelId,
    )[0];
    return {
      channelId: selectedChannel.id,
      channelName: selectedChannel.name,
    };
  });

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
          LocalStorageUtils.setSelectedChannelId(a);
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
  const selectedChannelId = LocalStorageUtils.getSelectedChannelId();
  if (selectedChannelId) {
    return selectedChannelId;
  }

  LocalStorageUtils.setSelectedChannelId(userContext.channelPermissions[0].id);
  return userContext.channelPermissions[0].id;
}
