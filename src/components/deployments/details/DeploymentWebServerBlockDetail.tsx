import { Card, Descriptions, DescriptionsProps } from 'antd';
import React from 'react';

import { WebServerBlock } from '../../../types/BlockTypes.ts';

export function DeploymentWebServerBlockDetail({
  nodeData,
}: {
  nodeData: WebServerBlock;
}) {
  const descriptionItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '웹서버 성능',
      children: nodeData.webServerFeatures.tier,
    },
    {
      key: '2',
      label: '웹서버 지역',
      children: nodeData.webServerFeatures.region,
    },
    {
      key: '3',
      label: '컨테이너 Registry URL',
      children: nodeData.webServerFeatures.containerMetadata.registryUrl,
    },
    {
      key: '4',
      label: '컨테이너 이미지 태그',
      children: nodeData.webServerFeatures.containerMetadata.imageTags,
    },
    {
      key: '5',
      label: '컨테이너 사용자 이름',
      children: nodeData.webServerFeatures.containerMetadata.username,
    },
  ];

  return (
    <Card>
      <Descriptions
        title={`웹 서버 "${nodeData.name}" 정보`}
        items={descriptionItems}
      />
    </Card>
  );
}
