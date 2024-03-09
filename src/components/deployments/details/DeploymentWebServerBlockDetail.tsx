import { Card, Descriptions, DescriptionsProps } from 'antd';
import React from 'react';

import { PricingInformationProjection } from '../../../libs/core-api/api';
import { WebServerBlock } from '../../../types/BlockTypes.ts';
import { findPrice } from './DeploymentVmBlockDetail.tsx';

export function DeploymentWebServerBlockDetail({
  nodeData,
  priceInfo,
  plugin,
}: {
  nodeData: WebServerBlock;
  priceInfo: PricingInformationProjection[];
  plugin: string;
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
    {
      key: '6',
      label: '시간 당 예상 가격(플러그인 반영)',
      children: `$${findPrice(
        plugin,
        priceInfo,
        'WebServer',
        nodeData.webServerFeatures.tier === 'high'
          ? 'large'
          : nodeData.webServerFeatures.tier,
      )}`,
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
