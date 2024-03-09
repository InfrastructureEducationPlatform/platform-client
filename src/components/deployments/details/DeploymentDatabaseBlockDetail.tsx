import { Card, Descriptions, DescriptionsProps } from 'antd';
import React from 'react';

import { PricingInformationProjection } from '../../../libs/core-api/api';
import { DatabaseBlock } from '../../../types/BlockTypes.ts';
import { findPrice } from './DeploymentVmBlockDetail.tsx';

export function DeploymentDatabaseBlockDetail({
  nodeData,
  priceInfo,
  plugin,
}: {
  nodeData: DatabaseBlock;
  priceInfo: PricingInformationProjection[];
  plugin: string;
}) {
  const descriptionItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'DB 성능',
      children: nodeData.databaseFeatures.tier,
    },
    {
      key: '2',
      label: 'DB 지역',
      children: nodeData.databaseFeatures.region,
    },
    {
      key: '3',
      label: '시간 당 예상 가격(플러그인 반영)',
      children: `$${findPrice(
        plugin,
        priceInfo,
        'VirtualMachine',
        nodeData.databaseFeatures.tier === 'high'
          ? 'large'
          : nodeData.databaseFeatures.tier,
      )}`,
    },
  ];

  return (
    <Card>
      <Descriptions
        title={`데이터베이스 "${nodeData.name}" 정보`}
        items={descriptionItems}
      />
    </Card>
  );
}
