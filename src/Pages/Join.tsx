import { Button, Card, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';

import { authApi } from '../api';
import { CredentialProvider } from '../libs/core-api/api';
import { LocalStorageUtils } from '../utils/LocalStorageUtils.ts';

type RegistrationFormType = {
  userName: string;
  userEmail: string;
};

export function Join() {
  const navigate = useNavigate();

  const onSubmit = (value: RegistrationFormType) => {
    (async () => {
      // 회원가입 API
      const response = await authApi.registerAsync({
        name: value.userName,
        email: value.userEmail,
        credentialProvider: CredentialProvider.Google,
        joinToken: LocalStorageUtils.getJoinToken(),
        profileImageUrl: null,
      });

      // 요청에 성공 한 경우(서버 응답 값에 토큰이 정상적으로 있는 경우) 엑세스 토큰을 로컬스토리지에 등록하고 홈페이지로 이동
      if (response.data.token) {
        LocalStorageUtils.setAccessToken(response.data.token);
        navigate('/onboardingTour'); // Navigate to home
      }
    })();
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card title={'회원가입'}>
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ width: 500, maxWidth: 800 }}
          onFinish={(value) => onSubmit(value)}
          autoComplete="off"
        >
          <Form.Item<RegistrationFormType>
            label="사용자 이름"
            name={'userName'}
            rules={[
              { required: true, message: '사용자 이름을 입력해 주세요!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<RegistrationFormType>
            label="사용자 이메일"
            name={'userEmail'}
            rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button type="primary" htmlType="submit">
              회원가입
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
