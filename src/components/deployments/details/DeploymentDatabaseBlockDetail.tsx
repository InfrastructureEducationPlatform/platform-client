import { Card, Descriptions, DescriptionsProps } from 'antd';
import React from 'react';

import { DatabaseBlock } from '../../../types/BlockTypes.ts';

export function DeploymentDatabaseBlockDetail({
  nodeData,
}: {
  nodeData: DatabaseBlock;
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
