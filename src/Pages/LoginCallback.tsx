import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { authApi } from '../api';
import { LoginResult } from '../libs/core-api/api';
import { LocalStorageUtils } from '../utils/LocalStorageUtils.ts';

export function LoginCallback() {
  const [searchParameters, _] = useSearchParams();
  const navigate = useNavigate(); // 이동 시킬 때  쓰는 훅
  const requestToServer = async (code: string) => {
    // After
    const response = await authApi.loginAsync({
      provider: 'Google',
      authenticationCode: code,
    });

    /* Before
        const requestBody = {
            "provider": "Google",
            "authenticationCode": code
        }    
        const response = await axios.post("https://api.blockinfra.kangdroid.me/auth/login", requestBody);
        */

    // 회원가입
    if (response.data.loginResult === LoginResult.NeedsRegistration) {
      // 만약 응답 값이 회원가입인 경우
      LocalStorageUtils.setJoinToken(response.data.token);
      navigate('/register');
    } else {
      // 만약 응답 값이 로그인 인 경우
      LocalStorageUtils.setAccessToken(response.data.token);
      LocalStorageUtils.setRefreshToken(response.data.refreshToken!);
      LocalStorageUtils.removeUserContext();
      navigate('/home');
    }
  };

  useEffect(() => {
    const code = searchParameters.get('code');
    requestToServer(code!);
  }, [searchParameters]);

  return <></>;
}
