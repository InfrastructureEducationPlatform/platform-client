import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { authApi } from '../api';
import { LoginResult } from '../libs/core-api/api';

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
      localStorage.setItem('joinToken', response.data.token);
      navigate('/register');
    } else {
      // 만약 응답 값이 로그인 인 경우
      localStorage.setItem('accessToken', response.data.token);
      localStorage.removeItem('userContext');
      navigate('/home');
    }
  };

  useEffect(() => {
    const code = searchParameters.get('code');
    requestToServer(code!);
  }, [searchParameters]);

  return <></>;
}
