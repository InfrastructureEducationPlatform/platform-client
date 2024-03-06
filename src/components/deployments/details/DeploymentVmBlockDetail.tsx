import { Card, Descriptions, DescriptionsProps } from 'antd';
import React from 'react';

import { VirtualMachineBlock } from '../../../types/BlockTypes.ts';

export function DeploymentVmBlockDetail({
  nodeData,
}: {
  nodeData: VirtualMachineBlock;
}) {
  const descriptionItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'VM 성능',
      children: nodeData.virtualMachineFeatures.tier,
    },
    {
      key: '2',
      label: 'VM 지역',
      children: nodeData.virtualMachineFeatures.region,
    },
    {
      key: '3',
      label: '운영체제',
      children: nodeData.virtualMachineFeatures.osType,
    },
  ];
  return (
    <Card>
      <Descriptions
        title={`가상 머신 "${nodeData.name}" 정보`}
        items={descriptionItems}
      />
    </Card>
  );
}
