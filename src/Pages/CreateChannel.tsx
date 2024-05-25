import { Button, Card, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';

import { channelApi, userApi } from '../api';
import { LocalStorageUtils } from '../utils/LocalStorageUtils.ts';
import { useUserContextQuery } from '../api/queries.tsx';
import { useState } from 'react';
import { InputRuled } from '../components/InputRuled.tsx';
import { reject } from 'lodash';
import { validateInput, validationConfig } from '../utils/validators.ts';

type CreateChannelType = {
  channelName: string;
  channelDescription: string;
  channelProfileImageUrl: string | undefined;
};

export function CreateChannel() {
  const navigate = useNavigate();
  const onSubmit = (value: CreateChannelType) => {
    (async () => {
      const response = await channelApi.createChannelAsync({
        name: value.channelName,
        description: value.channelDescription,
        imageUrl: null,
      });

      if (response != null) {
        LocalStorageUtils.removeUserContext();
        const userResponse = await userApi.getUsersDetailProjectionAsync();
        LocalStorageUtils.setSelectedChannelId(
          userResponse.data.channelPermissionList[0].channelId,
        );
        navigate('/home', { state: { userContextReloadKey: 'true' } });
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
      <Card title={'채널 생성'}>
        <Form
          name="basic"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 18 }}
          style={{ width: 600, maxWidth: 800 }}
          onFinish={(value) => onSubmit(value)}
          autoComplete="off"
        >
          <Form.Item<CreateChannelType>
            label="채널 이름"
            name={'channelName'}
            required={true}
            rules={[
              {
                validator: (_, value) => {
                  return validateInput({ value, ...validationConfig.channelName });
                }
              }
            ]}
          >
          </Form.Item>

          <Form.Item<CreateChannelType>
            label="채널 설명"
            name={'channelDescription'}
            required={true}
            rules={[
              {
                validator: (_, value) => {
                  return validateInput({ value, ...validationConfig.channelDescription });
                }
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<CreateChannelType>
            label="채널 채널 프로필 이미지 URL"
            name={'channelProfileImageUrl'}
            required={true}
            rules={[
              {
                validator: (_, value) => {
                  return validateInput({ value, ...validationConfig.channelProfileImg });
                }
              }
            ]}
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
              채널 생성
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
