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

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [forceReload, setForceReload] = useState<string>('');
  const navigate = useNavigate();
  const { data: userContext, isLoading } = useUserContextQuery(forceReload);
  const [childrenReal, setChildrenReal] = useState<ReactNode>(null);
  

  useEffect(() => {
    console.log('userContext', userContext);
    if (!userContext || isLoading) {
      return;
    }

    if (userContext.channelPermissions.length === 0) {
      // 채널 생성 온보딩이 필요한 경우
      navigate('/onBoarding');
      return;
    }
    else{
      setChildrenReal(children);
    }
  }, [userContext]);

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
      {childrenReal}
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
