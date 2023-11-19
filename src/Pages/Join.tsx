import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '../api';
import { CredentialProvider } from '../libs/core-api/api';

export function Join() {
  localStorage.getItem('joinToken');

  return (
    <>
      <div>
        <InputBox />
      </div>
    </>
  );
}

function InputBox() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Form의 기본 엑션 방지
    event.preventDefault();

    // 비동기로 API 요청(회원가입 요청)
    (async () => {
      // 회원가입 API
      const response = await authApi.registerAsync({
        name: userName,
        email: userEmail,
        credentialProvider: CredentialProvider.Google,
        joinToken: localStorage.getItem('joinToken'),
        profileImageUrl: null,
      });

      // 응답값 로깅(필수 아님, 로깅용)
      console.log(response);

      // 요청에 성공 한 경우(서버 응답 값에 토큰이 정상적으로 있는 경우) 엑세스 토큰을 로컬스토리지에 등록하고 홈페이지로 이동
      if (response.data.token) {
        localStorage.setItem('accessToken', response.data.token);
        navigate('/'); // Navigate to home
      }
    })();
  };

  return (
    /* Root Content Area */
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Outer Content Area */}
      <div
        style={{
          width: '720px',
          height: '610px',
          background: '#A87575',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Inner Content Area */}
        <div
          style={{
            background: 'white',
            width: '640px',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <h1 style={{ color: 'black' }}>회원가입</h1>
          <form
            onSubmit={onSubmit}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div>
              <label htmlFor="userNameInput">사용자 이름</label>
              <input
                id="userNameInput"
                type="text"
                onChange={(event) => setUserName(event.target.value)}
                value={userName}
              />
            </div>
            <div>
              <label htmlFor="userEmailInput">사용자 이메일</label>
              <input
                type="text"
                onChange={(event) => setUserEmail(event.target.value)}
                value={userEmail}
              />
            </div>
            <button style={{ width: '30%' }} type="submit">
              회원가입
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
