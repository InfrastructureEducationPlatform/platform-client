import { Button, Form, Input, Select } from 'antd';
import React from 'react';

import { DatabaseBlockNodeProps } from '../DatabaseBlockNode.tsx';
import { CommonBlockNodeContentProps } from './BlockNodeEditDrawer.tsx';
import { validateInput, validationConfig } from '../../../utils/validators.ts';

const { Option } = Select;
export function DatabaseBlockEditor({
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
      <Form.Item<DatabaseBlockNodeProps>
        label="리소스 이름"
        name={'blockTitle'}
        rules={[
          {validator(_, value){
            return validateInput({value, ...validationConfig.blockTitle})
          }}
        ]}
        
        initialValue={node.data.blockTitle}
      >
        <Input />
      </Form.Item>

      <Form.Item<DatabaseBlockNodeProps>
        label="리소스 설명"
        name={'blockDescription'}
        rules={[
          {validator(_, value){
            return validateInput({value, ...validationConfig.blockDescription})}
          }
        ]}
        initialValue={node.data.blockDescription}
      >
        <Input />
      </Form.Item>

      <Form.Item<DatabaseBlockNodeProps>
        label="DB Username"
        name={'masterUsername'}
        rules={[{ required: true, message: 'DB 사용자 이름은 필수 입니다!' }]}
        initialValue={node.data.masterUsername}
      >
        <Input />
      </Form.Item>

      <Form.Item<DatabaseBlockNodeProps>
        label="DB Password"
        name={'masterPassword'}
        rules={[{ required: true, message: 'DB 비밀번호는 필수입니다!' }]}
        initialValue={node.data.masterPassword}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<DatabaseBlockNodeProps>
        label="DB Tier"
        name={'dbTier'}
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

      <Form.Item<DatabaseBlockNodeProps>
        label="DB Region"
        name={'dbRegion'}
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
