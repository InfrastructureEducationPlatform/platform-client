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
import { Handle, NodeProps, Position } from 'reactflow';

import { CommonBlockProps } from '../../types/CommonBlockProps.ts';

export type MessageQueueBlockNodeProps = CommonBlockProps & {
  mqTier: 'low' | 'medium' | 'high' | 'custom';
  mqRegion: 'korea' | 'defaultAccount';
  mqUsername: string;
  mqPassword: string;
};

export function MessageQueueBlockNode(
  props: NodeProps<MessageQueueBlockNodeProps>,
) {
  const cacheDescriptions: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'MQ 성능',
      children: props.data.mqTier,
    },
    {
      key: '2',
      label: 'MQ 지역',
      children: props.data.mqRegion,
    },
    {
      key: '3',
      label: 'MQ Username',
      children: props.data.mqUsername,
    },
    {
      key: '4',
      label: 'MQ Password',
      children: '********',
    },
  ];

  return (
    <div>
      <Handle type={'target'} position={Position.Left} isConnectable={true} />
      <Card
        key={props.id}
        style={{
          position: 'relative',
          width: '450px',
          height: '280px',
          border: props.selected
            ? '2px solid #1890ff'
            : '2px solid rgb(0 0 0 / 0%)',
          margin: '2px',
        }}
      >
        <Flex gap={'15px'}>
          <Avatar icon={<LaptopOutlined />} size={40} />
          <Meta
            title={props.data.blockTitle}
            description={props.data.blockDescription}
          />
        </Flex>
        <Divider style={{ marginTop: 15, marginBottom: 15 }} />
        <Descriptions
          title={'MQ 서버 정보'}
          size={'default'}
          items={cacheDescriptions}
        />
      </Card>
    </div>
  );
}
