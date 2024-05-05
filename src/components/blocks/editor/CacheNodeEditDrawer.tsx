import { Button, Form, Input, Select } from 'antd';
import React from 'react';

import { CacheBlockNodeProps } from '../CacheBlockNode.tsx';
import { CommonBlockNodeContentProps } from './BlockNodeEditDrawer.tsx';

const { Option } = Select;
export function CacheBlockEditor({
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
      <Form.Item<CacheBlockNodeProps>
        label="리소스 이름"
        name={'blockTitle'}
        rules={[{ required: true, message: '리소스 이름은 필수 필드입니다!' }]}
        initialValue={node.data.blockTitle}
      >
        <Input />
      </Form.Item>

      <Form.Item<CacheBlockNodeProps>
        label="리소스 설명"
        name={'blockDescription'}
        rules={[
          { required: true, message: '리소스에 대한 설명은 필수 입니다!' },
        ]}
        initialValue={node.data.blockDescription}
      >
        <Input />
      </Form.Item>

      <Form.Item<CacheBlockNodeProps>
        label="Cache Tier"
        name={'cacheTier'}
        rules={[
          {
            required: true,
            message: 'VM Tier를 선택해 주세요!(low, medium, high, custom) 중 1',
          },
        ]}
        initialValue={node.data.dbTier}
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

      <Form.Item<CacheBlockNodeProps>
        label="Cache Region"
        name={'cacheRegion'}
        rules={[
          {
            required: true,
            message: 'VM Region을 선택해 주세요!(korea, defaultAccount) 중 1',
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
