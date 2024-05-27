import { LaptopOutlined } from '@ant-design/icons';
import {
  Avatar,
  Card,
  Descriptions,
  DescriptionsProps,
  Divider,
  Flex,
} from 'antd';
import Meta from 'antd/es/card/Meta';
import React from 'react';
import { NodeProps } from 'reactflow';

import { CommonBlockProps } from '../../types/CommonBlockProps.ts';

export type VirtualMachineBlockNodeProps = CommonBlockProps & {
  vmTier: 'low' | 'medium' | 'high' | 'custom';
  vmRegion: 'korea' | 'defaultAccount';
  vmOperatingSystem:
    | 'ubuntu'
    | 'ubuntu_22_04'
    | 'ubuntu_20_04'
    | 'ubuntu_18_04';
};

export function VirtualMachineBlockNode(
  props: NodeProps<VirtualMachineBlockNodeProps>,
) {
  const descriptionItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'VM 성능',
      children: props.data.vmTier,
    },
    {
      key: '2',
      label: 'VM 지역',
      children: props.data.vmRegion,
    },
    {
      key: '3',
      label: '운영체제',
      children: props.data.vmOperatingSystem,
    },
  ];
  return (
    <Card
      key={props.id}
      style={{
        position: 'relative',
        width: '400px',
        height: '280px',
        border: props.selected
          ? '2px solid #1890ff'
          : '2px solid rgb(0 0 0 / 0%)',
      }}
    >
      <Flex gap={'15px'}>
        <Avatar icon={<LaptopOutlined />} size={40} />
        <Meta
          title={props.data.blockTitle}
          description={props.data.blockDescription}
        />
      </Flex>
      <Divider style={{ marginTop: 15 }} />

      <Descriptions
        title={'가상 머신 정보'}
        size={'default'}
        items={descriptionItems}
        layout={'vertical'}
      />
    </Card>
  );
}
