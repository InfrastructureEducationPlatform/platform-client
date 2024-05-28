import { Button, Form, Input, Select } from 'antd';
import React from 'react';

import { MessageQueueBlockNodeProps } from '../MessageQueueBlockNode.tsx';
import { CommonBlockNodeContentProps } from './BlockNodeEditDrawer.tsx';

const { Option } = Select;
export function MessageQueueEditDrawer({
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
      <Form.Item<MessageQueueBlockNodeProps>
        label="리소스 이름"
        name={'blockTitle'}
        rules={[{ required: true, message: '리소스 이름은 필수 필드입니다!' }]}
        initialValue={node.data.blockTitle}
      >
        <Input />
      </Form.Item>

      <Form.Item<MessageQueueBlockNodeProps>
        label="리소스 설명"
        name={'blockDescription'}
        rules={[
          { required: true, message: '리소스에 대한 설명은 필수 입니다!' },
        ]}
        initialValue={node.data.blockDescription}
      >
        <Input />
      </Form.Item>

      <Form.Item<MessageQueueBlockNodeProps>
        label="MQ Username"
        name={'mqUsername'}
        rules={[{ required: true, message: 'DB 사용자 이름은 필수 입니다!' }]}
        initialValue={node.data.masterUsername}
      >
        <Input />
      </Form.Item>

      <Form.Item<MessageQueueBlockNodeProps>
        label="MQ Password"
        name={'mqPassword'}
        rules={[
          { required: true, message: 'MQ 비밀번호는 필수입니다!', min: 12 },
        ]}
        initialValue={node.data.masterPassword}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<MessageQueueBlockNodeProps>
        label="메시지 큐 Tier"
        name={'mqTier'}
        rules={[
          {
            required: true,
            message: 'MQ Tier를 선택해 주세요!(low, medium, high) 중 1',
          },
        ]}
        initialValue={node.data.dbTier}
      >
        <Select placeholder="성능 선택">
          <Option value="low">Low Performance(2Core, 1Gb Ram)</Option>
          <Option value="medium">Medium Performance(2Core, 8Gb Ram)</Option>
          <Option value="high">High Performance(4Core, 16Gb Ram)</Option>
        </Select>
      </Form.Item>

      <Form.Item<MessageQueueBlockNodeProps>
        label="메시지 큐 Region"
        name={'mqRegion'}
        rules={[
          {
            required: true,
            message: 'MQ Region을 선택해 주세요!(korea, defaultAccount) 중 1',
          },
        ]}
        initialValue={node.data.dbRegion}
      >
        <Select placeholder="배포 위치 선택">
          <Option value="korea">한국</Option>
          <Option value="defaultAccount" disabled={true}>
            계정 기본값
          </Option>
        </Select>
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
