import { Button, Drawer, Form, Input, Select } from 'antd';
import React, { ReactNode } from 'react';
import { Node } from 'reactflow';

import { DatabaseBlockNodeProps } from './DatabaseBlockNode.tsx';
import { VirtualMachineBlockNodeProps } from './VirtualMachineBlockNode.tsx';
import { WebServerBlockNodeProps } from './WebServerBlockNode.tsx';

const { Option } = Select;

type CommonBlockNodeContentProps = {
  node: Node | undefined;
  setNode: (value: Node) => void;
  setDrawerVisible: (value: boolean) => void;
};

// Top Level Key-Map for Drawer Contents
const keyMap = new Map<
  string,
  (commonBlockNodeContentProps: CommonBlockNodeContentProps) => ReactNode
>();
keyMap.set('virtualMachine', (commonBlockNodeContentProps) => (
  <VirtualMachineBlockNodeEditContents
    node={commonBlockNodeContentProps.node}
    setNode={commonBlockNodeContentProps.setNode}
    setDrawerVisible={commonBlockNodeContentProps.setDrawerVisible}
  />
));
keyMap.set('webServer', (commonBlockNodeContentProps) => (
  <WebServerBlockNodeEditContents
    node={commonBlockNodeContentProps.node}
    setNode={commonBlockNodeContentProps.setNode}
    setDrawerVisible={commonBlockNodeContentProps.setDrawerVisible}
  />
));
keyMap.set('database', (commonBlockNodeContentProps) => (
  <DatabaseBlockNodeEditContents
    node={commonBlockNodeContentProps.node}
    setNode={commonBlockNodeContentProps.setNode}
    setDrawerVisible={commonBlockNodeContentProps.setDrawerVisible}
  />
));

export function BlockNodeEditDrawer({
  drawerVisible,
  setDrawerVisible,
  node,
  setNode,
}: CommonBlockNodeContentProps & { drawerVisible: boolean }) {
  if (node === undefined || keyMap.get(node?.type ?? '') === undefined) {
    return <></>;
  }

  return (
    <Drawer
      title={'블록 편집'}
      placement={'right'}
      open={drawerVisible}
      getContainer={false}
      onClose={() => setDrawerVisible(false)}
    >
      {keyMap.get(node.type!)!({
        node,
        setNode,
        setDrawerVisible,
      })}
    </Drawer>
  );
}

function VirtualMachineBlockNodeEditContents({
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
      >
        <Input />
      </Form.Item>

      <Form.Item<VirtualMachineBlockNodeProps>
        label="리소스 설명"
        name={'blockDescription'}
        rules={[
          { required: true, message: '리소스에 대한 설명은 필수 입니다!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<VirtualMachineBlockNodeProps>
        label="VM Tier"
        name={'vmTier'}
        rules={[
          {
            required: true,
            message: 'VM Tier를 선택해 주세요!(low, medium, high, custom) 중 1',
          },
        ]}
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

      <Form.Item<VirtualMachineBlockNodeProps>
        label="VM Region"
        name={'vmRegion'}
        rules={[
          {
            required: true,
            message: 'VM Region을 선택해 주세요!(korea, defaultAccount) 중 1',
          },
        ]}
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
      >
        <Select placeholder="운영체제 선택">
          <Option value="ubuntu">Ubuntu 22.04</Option>
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

function WebServerBlockNodeEditContents({
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
      >
        <Input />
      </Form.Item>

      <Form.Item<WebServerBlockNodeProps>
        label="리소스 설명"
        name={'blockDescription'}
        rules={[
          { required: true, message: '리소스에 대한 설명은 필수 입니다!' },
        ]}
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

function DatabaseBlockNodeEditContents({
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
        rules={[{ required: true, message: '리소스 이름은 필수 필드입니다!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<DatabaseBlockNodeProps>
        label="리소스 설명"
        name={'blockDescription'}
        rules={[
          { required: true, message: '리소스에 대한 설명은 필수 입니다!' },
        ]}
      >
        <Input />
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
