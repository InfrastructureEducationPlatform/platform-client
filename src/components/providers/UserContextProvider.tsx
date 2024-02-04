import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { userApi } from '../../api';
import { UserContext } from '../../types/UserContext.ts';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils.ts';

const UsrContext = createContext<UserContextValue | undefined>(undefined);

type UserContextValue = {
  userContext: UserContext;
  setForceReload: (reloadKey: string) => void;
};

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [userContext, setUserContext] = useState<UserContext>();
  const [forceReload, setForceReload] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  useEffect(() => {
    // 로컬스토리지에 캐시 확인
    const cachedData = LocalStorageUtils.getUserContext();
    if (cachedData) {
      setUserContext(cachedData);
      if (cachedData.channelPermissions.length == 0) {
        // 채널 생성 온보딩이 필요한 경우
        navigate('/onBoarding');
      }
      return;
    }

    // 로컬 스토리지에 캐시가 없는 경우 서버에서 요청 -> 캐시
    (async () => {
      const userDetail = await userApi.getUsersDetailProjectionAsync();
      const userContext: UserContext = {
        userId: userDetail.data.userId,
        userName: userDetail.data.name,
        userEmail: userDetail.data.email,
        userProfilePictureUrl: userDetail.data.profilePictureImageUrl as
          | string
          | undefined,
        channelPermissions: userDetail.data.channelPermissionList.map((a) => ({
          id: a.channelId,
          name: a.channelName,
          permission: a.channelPermissionType,
        })),
      };
      LocalStorageUtils.setUserContext(userContext);
      setUserContext(userContext);
      if (userDetail.data.channelPermissionList.length == 0) {
        // 채널 생성 온보딩이 필요한 경우
        navigate('/onBoarding');
      }
    })();
  }, [navigate]);

  useEffect(() => {
    if (forceReload) {
      (async () => {
        const userDetail = await userApi.getUsersDetailProjectionAsync();
        const userContext: UserContext = {
          userId: userDetail.data.userId,
          userName: userDetail.data.name,
          userEmail: userDetail.data.email,
          userProfilePictureUrl: userDetail.data.profilePictureImageUrl as
            | string
            | undefined,
          channelPermissions: userDetail.data.channelPermissionList.map(
            (a) => ({
              id: a.channelId,
              name: a.channelName,
              permission: a.channelPermissionType,
            }),
          ),
        };
        LocalStorageUtils.setUserContext(userContext);
        setUserContext(userContext);
      })();
    }
  }, [forceReload]);

  if (!userContext) {
    return <div>로딩중</div>;
  }

  return (
    <UsrContext.Provider
      value={{
        userContext,
        setForceReload,
      }}
    >
      {children}
    </UsrContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UsrContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}
