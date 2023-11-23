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

export type WebServerBlockNodeProps = CommonBlockProps & {
  webServerTier: 'low' | 'medium' | 'high' | 'custom';
  webServerRegion: 'korea' | 'defaultAccount';
  containerData: {
    registryUrl: string;
    imageTags: string;
    username: string | undefined;
    secrets: string | undefined;
  };
};

export function WebServerBlockNode(props: NodeProps<WebServerBlockNodeProps>) {
  const webGeneralDescriptions: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '웹 서버 성능',
      children: props.data.webServerTier,
    },
    {
      key: '2',
      label: '웹 서버 지역',
      children: props.data.webServerRegion,
    },
  ];

  const webDetailDescriptions: DescriptionsProps['items'] = [
    {
      key: '3',
      label: '이미지 주소',
      children: `${props.data.containerData.registryUrl}/${props.data.containerData.imageTags}`,
    },
  ];
  return (
    <Card
      key={props.id}
      style={{
        position: 'relative',
        width: '500px',
        height: '300px',
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
        title={'웹 서버 정보'}
        size={'default'}
        items={webGeneralDescriptions}
      />
      <Descriptions
        title={'컨테이너 정보'}
        size={'default'}
        items={webDetailDescriptions}
      />
    </Card>
  );
}
