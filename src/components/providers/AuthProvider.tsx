import { Button, Modal, Result } from 'antd';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { LocalStorageUtils } from '../../utils/LocalStorageUtils.ts';

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = LocalStorageUtils.getAccessToken();
  const navigate = useNavigate();

  if (!token) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Result
          status={'error'}
          title="엑세스 토큰을 찾을 수 없습니다. 재로그인 해주세요."
          extra={
            <Button type={'primary'} onClick={() => navigate('/')}>
              로그인 페이지로 이동
            </Button>
          }
        />
      </Modal>
    );
  }
  return <>{children}</>;
}
