import { Button, Form, Input, Select } from 'antd';
import React from 'react';

import { VirtualMachineBlockNodeProps } from '../VirtualMachineBlockNode.tsx';
import { CommonBlockNodeContentProps } from './BlockNodeEditDrawer.tsx';

const { Option } = Select;

export function VirtualMachineBlockEditor({
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
      <Form.Item<VirtualMachineBlockNodeProps>
        label="리소스 이름"
        name={'blockTitle'}
        rules={[{ required: true, message: '리소스 이름은 필수 필드입니다!' }]}
        initialValue={node.data.blockTitle}
      >
        <Input />
      </Form.Item>

      <Form.Item<VirtualMachineBlockNodeProps>
        label="리소스 설명"
        name={'blockDescription'}
        rules={[
          { required: true, message: '리소스에 대한 설명은 필수 입니다!' },
        ]}
        initialValue={node.data.blockDescription}
      >
        <Input />
      </Form.Item>

      <Form.Item<VirtualMachineBlockNodeProps>
        label="VM Tier"
        name={'vmTier'}
        rules={[
          {
            required: true,
            message: 'VM Tier를 선택해 주세요!(low, medium, high) 중 1',
          },
        ]}
        initialValue={node.data.vmTier}
      >
        <Select placeholder="성능 선택">
          <Option value="low">Low Performance(2Core, 4Gb Ram)</Option>
          <Option value="medium">Medium Performance(2Core, 8Gb Ram)</Option>
          <Option value="high">High Performance(4Core, 16Gb Ram)</Option>
        </Select>
      </Form.Item>

      <Form.Item<VirtualMachineBlockNodeProps>
        label="VM Region"
        name={'vmRegion'}
        rules={[
          {
            required: true,
            message: 'VM Region을 선택해 주세요!(korea, defaultAccount) 중 1',
          },
        ]}
        initialValue={node.data.vmRegion}
      >
        <Select placeholder="배포 위치 선택">
          <Option value="korea">한국</Option>
          <Option value="defaultAccount" disabled={true}>
            계정 기본값
          </Option>
        </Select>
      </Form.Item>

      <Form.Item<VirtualMachineBlockNodeProps>
        label="VM Operating System"
        name={'vmOperatingSystem'}
        rules={[
          {
            required: true,
            message: 'VM Operating System을 선택해 주세요!(ubuntu)',
          },
        ]}
        initialValue={node.data.vmOperatingSystem}
      >
        <Select placeholder="운영체제 선택">
          <Option value="ubuntu_22_04">Ubuntu 22.04</Option>
          <Option value="ubuntu_20_04">Ubuntu 20.04</Option>
          <Option value="ubuntu_18_04">Ubuntu 18.04</Option>
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
