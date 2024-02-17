import { RightOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Input, Typography } from 'antd';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { userApi } from '../../api';
import { UserContext } from '../../types/UserContext.ts';
import { ImageUploader } from '../ProfileImageUploader.tsx';

export function GeneralAccountPreferences({
  userContext,
  setForceReload,
}: {
  userContext: UserContext;
  setForceReload: (forceReload: string) => void;
}) {
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const preferenceEditCallback = useCallback(
    debounce(async (userContext: UserContext, userName: string) => {
      await userApi.updateUserPreferenceAsync({
        profilePictureImageUrl: userContext.userProfilePictureUrl,
        email: userContext.userEmail,
        name: userName,
      });
      setForceReload(new Date().toISOString());
    }, 500),
    [],
  );

  return (
    <Flex
      style={{
        flexDirection: 'column',
        padding: '20px',
        width: 'calc(100% - 240px)',
        overflow: 'auto',
        lineHeight: 'initial',
      }}
    >
      <div>
        <Typography.Title level={4}>내 프로필</Typography.Title>
        <Divider style={{ width: '100%', margin: 0 }} />
        <Flex style={{ marginTop: '10px', gap: '20px', alignItems: 'center' }}>
          <ImageUploader
            defaultImageUrl={userContext.userProfilePictureUrl}
            onImageUploaded={(imageUrl) => {
              (async () => {
                await userApi.updateUserPreferenceAsync({
                  profilePictureImageUrl: imageUrl,
                  email: userContext.userEmail,
                  name: userContext.userName,
                });
                setForceReload(new Date().toISOString());
              })();
            }}
            onImageDeleted={() => {
              (async () => {
                await userApi.updateUserPreferenceAsync({
                  profilePictureImageUrl: undefined,
                  email: userContext.userEmail,
                  name: userContext.userName,
                });
                setForceReload(new Date().toISOString());
              })();
            }}
          />
          <div>
            <Typography.Text type={'secondary'}>선호하는 이름</Typography.Text>
            <Input
              defaultValue={userContext.userName}
              onInput={(event) => {
                preferenceEditCallback(
                  userContext,
                  (event.target as HTMLInputElement).value,
                );
              }}
            />
          </div>
        </Flex>
      </div>
      <div>
        <Typography.Title level={4}>계정 보안</Typography.Title>
        <Divider style={{ width: '100%', margin: 0 }} />
        <Button
          type={'text'}
          style={{
            width: '100%',
            padding: '0',
            textAlign: 'left',
            height: 'unset',
            paddingTop: '5px',
            paddingBottom: '5px',
          }}
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
        >
          <Flex justify={'space-between'}>
            <Flex style={{ flexDirection: 'column' }}>
              <Typography.Text style={{ margin: 0 }}>로그아웃</Typography.Text>
              <Typography.Text type={'secondary'}>
                현재 기기에서 로그아웃 합니다.
              </Typography.Text>
            </Flex>
            <RightOutlined />
          </Flex>
        </Button>
        <Button
          type={'text'}
          style={{
            width: '100%',
            padding: '0',
            textAlign: 'left',
            height: 'unset',
            paddingTop: '5px',
            paddingBottom: '5px',
          }}
        >
          <Flex justify={'space-between'}>
            <Flex style={{ flexDirection: 'column' }}>
              <Typography.Text style={{ margin: 0 }}>계정 삭제</Typography.Text>
              <Typography.Text type={'secondary'}>
                현재 로그인한 계정을 삭제합니다.
              </Typography.Text>
            </Flex>
            <RightOutlined />
          </Flex>
        </Button>
      </div>
    </Flex>
  );
}
