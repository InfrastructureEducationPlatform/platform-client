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

export type DatabaseBlockNodeProps = CommonBlockProps & {
  dbTier: 'low' | 'medium' | 'high' | 'custom';
  dbRegion: 'korea' | 'defaultAccount';
};

export function DatabaseBlockNode(props: NodeProps<DatabaseBlockNodeProps>) {
  const dbDescriptions: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'DB 성능',
      children: props.data.dbTier,
    },
    {
      key: '2',
      label: 'DB 지역',
      children: props.data.dbRegion,
    },
  ];

  return (
    <Card
      key={props.id}
      style={{
        position: 'relative',
        width: '450px',
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
      <Divider style={{ marginTop: 15, marginBottom: 15 }} />
      <Descriptions
        title={'DB 서버 정보'}
        size={'default'}
        items={dbDescriptions}
      />
    </Card>
  );
}
