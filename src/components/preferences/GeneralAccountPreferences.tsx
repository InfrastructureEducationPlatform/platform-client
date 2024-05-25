import { RightOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Input, Modal, Typography } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PreferenceType } from '../../Pages/Preferences.tsx';
import { userApi } from '../../api';
import { useDeleteAccount } from '../../api/mutation.tsx';
import { UserContext } from '../../types/UserContext.ts';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils.ts';
import { ImageUploader } from '../ProfileImageUploader.tsx';
import { useUserContext } from '../providers/UserContextProvider.tsx';
import { InputRuled } from '../InputRuled.tsx';
import { validationConfig } from '../../utils/validators.ts';

export function GeneralAccountPreferences({
  setCurrent,
}: {
  setCurrent: (current: PreferenceType) => void;
}) {
  const [modal, contexHolder] = Modal.useModal();
  const navigate = useNavigate();
  const { userContext, setForceReload } = useUserContext();
  const { mutateAsync: deleteAccount } = useDeleteAccount();

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

  useEffect(() => {
    setCurrent('account');
  }, [setCurrent]);

  return (
    <Flex
      style={{
        flexDirection: 'column',
        padding: '20px',
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
            <InputRuled
              value={userContext.userName}
              callback={(inputValue : string) => {
                preferenceEditCallback(
                  userContext,
                  inputValue,
                );
              }}
              {...validationConfig.userName}
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
            modal.confirm({
              title: '로그아웃',
              content: '로그아웃 하시겠습니까?',
              centered: true,
              onOk: () => {
                LocalStorageUtils.removeUserContext();
                navigate('/');
              },
            });
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
          onClick={() => {
            modal.confirm({
              title: '계정 삭제',
              content:
                '계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 사용자의 1명인 채널도 모두 삭제됩니다.',
              centered: true,
              onOk: async () => {
                await deleteAccount();
                LocalStorageUtils.removeUserContext();
                localStorage.clear();
                navigate('/');
              },
            });
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
      {contexHolder}
    </Flex>
  );
}
