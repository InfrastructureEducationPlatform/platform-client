import { Card, Descriptions, DescriptionsProps } from 'antd';
import React from 'react';

import { PricingInformationProjection } from '../../../libs/core-api/api';
import { VirtualMachineBlock } from '../../../types/BlockTypes.ts';

export function DeploymentVmBlockDetail({
  nodeData,
  priceInfo,
  plugin,
}: {
  nodeData: VirtualMachineBlock;
  priceInfo: PricingInformationProjection[];
  plugin: string;
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
    {
      key: '4',
      label: '시간 당 예상 가격(플러그인 반영)',
      children: `$${findPrice(
        plugin,
        priceInfo,
        'VirtualMachine',
        nodeData.virtualMachineFeatures.tier === 'high'
          ? 'large'
          : nodeData.virtualMachineFeatures.tier,
      )}`,
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

export const findPrice = (
  plugin: string,
  priceInfo: PricingInformationProjection[],
  machineType: string,
  tier: string,
) => {
  const ventorType = plugin === 'aws-static' ? 'AWS' : 'Azure';
  const info = priceInfo.find(
    (a) => a.machineType === machineType && a.tier === tier,
  );

  return (
    info?.priceInfoPerVendors.find((a) => a.vendor === ventorType)
      ?.pricePerHour ?? 0
  );
};
