import { Button, Form, Input, Select } from 'antd';
import React from 'react';

import { WebServerBlockNodeProps } from '../WebServerBlockNode.tsx';
import { CommonBlockNodeContentProps } from './BlockNodeEditDrawer.tsx';

const { Option } = Select;

export function WebServerBlockEditor({
  node,
  setNode,
  setDrawerVisible,
}: CommonBlockNodeContentProps) {
  if (!node) throw new Error('Cannot edit undefined node');
  const [form] = Form.useForm();
  return (
    <Form
      layout={'vertical'}
      form={form}
      onFinish={(value) => {
        console.log(node);
        const newNode = {
          ...node,
          data: {
            ...node.data,
            ...value,
          },
        };
        setNode(newNode);
        form.resetFields();
        setDrawerVisible(false);
      }}
    >
      <Form.Item<WebServerBlockNodeProps>
        label="리소스 이름"
        name={'blockTitle'}
        rules={[{ required: true, message: '리소스 이름은 필수 필드입니다!' }]}
        initialValue={node.data.blockTitle}
      >
        <Input />
      </Form.Item>

      <Form.Item<WebServerBlockNodeProps>
        label="리소스 설명"
        name={'blockDescription'}
        rules={[
          { required: true, message: '리소스에 대한 설명은 필수 입니다!' },
        ]}
        initialValue={node.data.blockDescription}
      >
        <Input />
      </Form.Item>

      <Form.Item<WebServerBlockNodeProps>
        label="VM Tier"
        name={'webServerTier'}
        rules={[
          {
            required: true,
            message:
              'Web Server Tier를 선택해 주세요!(low, medium, high, custom) 중 1',
          },
        ]}
        initialValue={node.data.webServerTier}
      >
        <Select placeholder="성능 선택">
          <Option value="low">Low Performance</Option>
          <Option value="medium">Medium Performance</Option>
          <Option value="high">High Performance</Option>
          <Option value="custom" disabled={true}>
            Custom Performance
          </Option>
        </Select>
      </Form.Item>

      <Form.Item<WebServerBlockNodeProps>
        label="Web Server Region"
        name={'webServerRegion'}
        rules={[
          {
            required: true,
            message:
              'Web Server Region을 선택해 주세요!(korea, defaultAccount) 중 1',
          },
        ]}
        initialValue={node.data.webServerRegion}
      >
        <Select placeholder="배포 위치 선택">
          <Option value="korea">한국</Option>
          <Option value="defaultAccount" disabled={true}>
            계정 기본값
          </Option>
        </Select>
      </Form.Item>

      <Form.Item<WebServerBlockNodeProps>
        label="Container Registry URL"
        name={['containerData', 'registryUrl']}
        rules={[
          {
            required: true,
            message: 'Container Registry URL을 설정해 주세요!',
          },
        ]}
        initialValue={node.data.containerData.registryUrl}
      >
        <Input />
      </Form.Item>

      <Form.Item<WebServerBlockNodeProps>
        label="Container Image ID/Tags"
        name={['containerData', 'imageTags']}
        rules={[
          {
            required: true,
            message: '이미지 이름 및 태그를 설정해 주세요!',
          },
        ]}
        initialValue={node.data.containerData.imageTags}
      >
        <Input />
      </Form.Item>

      <Form.Item<WebServerBlockNodeProps>
        label="Container Registry Auth ID"
        name={['containerData', 'username']}
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<WebServerBlockNodeProps>
        label="Container Registry Auth Secrets"
        name={['containerData', 'secrets']}
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button type="primary" htmlType="submit">
          블록 저장하기
        </Button>
      </Form.Item>
    </Form>
  );
}
