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

export type CacheBlockNodeProps = CommonBlockProps & {
  cacheTier: 'low' | 'medium' | 'high' | 'custom';
  cacheRegion: 'korea' | 'defaultAccount';
};

export function CacheBlockNode(props: NodeProps<CacheBlockNodeProps>) {
  const cacheDescriptions: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Cache 성능',
      children: props.data.cacheTier,
    },
    {
      key: '2',
      label: 'Cache 지역',
      children: props.data.cacheRegion,
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
          title={'Cache 서버 정보'}
          size={'default'}
          items={cacheDescriptions}
        />
      </Card>
    </div>
  );
}
