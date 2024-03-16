import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserContextQuery } from '../../api/queries.tsx';
import { UserContext } from '../../types/UserContext.ts';

const UsrContext = createContext<UserContextValue | undefined>(undefined);

type UserContextValue = {
  userContext: UserContext;
  setForceReload: (reloadKey: string) => void;
};

export function UserContextProvider({ children, isReload}: { children: ReactNode, isReload?:string }) {
  const [forceReload, setForceReload] = useState<string>(isReload || '');
  const navigate = useNavigate();
  const { data: userContext, isLoading } = useUserContextQuery(forceReload);
  
  useEffect(() => {
    if (!userContext || isLoading) {
      return;
    }

    if (userContext.channelPermissions.length === 0) {
      // 채널 생성 온보딩이 필요한 경우
      navigate('/onBoarding');
      return;
    }
  }, [userContext]);

  if (!userContext || userContext!.channelPermissions.length === 0) {
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
