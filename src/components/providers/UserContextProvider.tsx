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

const UsrContext = createContext<UserContext | undefined>(undefined);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [userContext, setUserContext] = useState<UserContext>();
  const navigate = useNavigate();
  useEffect(() => {
    // 로컬스토리지에 캐시 확인
    const cachedData = localStorage.getItem('userContext');
    if (cachedData) {
      const contextData = JSON.parse(cachedData);
      setUserContext(JSON.parse(cachedData));
      if (contextData.channelPermissions.length == 0) {
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
        userProfilePictureUrl: undefined,
        channelPermissions: userDetail.data.channelPermissionList.map((a) => ({
          id: a.channelId,
          name: '',
          permission: a.channelPermissionType,
        })),
      };
      localStorage.setItem('userContext', JSON.stringify(userContext));
      setUserContext(userContext);
      if (userDetail.data.channelPermissionList.length == 0) {
        // 채널 생성 온보딩이 필요한 경우
        navigate('/onBoarding');
      }
    })();
  }, [navigate]);

  if (!userContext) {
    return <div>로딩중</div>;
  }

  return (
    <UsrContext.Provider value={userContext}>{children}</UsrContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UsrContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}
