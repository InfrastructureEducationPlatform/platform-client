import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, DescriptionsProps, Tabs } from 'antd';
import React from 'react';

import {
  DeploymentProjection,
  PricingInformationProjection,
} from '../../../../libs/core-api/api';
import { MqBlock } from '../../../../types/BlockTypes.ts';

export function MessageQueueDetail({
  nodeData,
  priceInfo,
  plugin,
  deploymentProjection,
}: {
  nodeData: MqBlock;
  priceInfo: PricingInformationProjection[];
  plugin: string;
  deploymentProjection: DeploymentProjection;
}) {
  const descriptionItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'MQ 성능',
      children: nodeData.mqFeatures.tier,
    },
    {
      key: '2',
      label: 'MQ 지역',
      children: nodeData.mqFeatures.region,
    },
  ];

  return (
    <Card>
      <Tabs
        defaultActiveKey={'1'}
        items={[
          {
            key: '1',
            label: 'MQ 블록 정보',
            children: (
              <Descriptions
                title={`MQ "${nodeData.name}" 정보`}
                items={descriptionItems}
              />
            ),
          },
          {
            key: '2',
            label: '배포 결과 및 MQ 정보 확인하기',
            children: (
              <MQResultView
                mqBlock={nodeData}
                deploymentProjection={deploymentProjection}
                blockId={nodeData.id}
              />
            ),
          },
        ]}
      />
    </Card>
  );
}

type MQOutput = {
  mqAmqps: string;
};

function MQResultView({
  mqBlock,
  deploymentProjection,
  blockId,
}: {
  mqBlock: MqBlock;
  deploymentProjection: DeploymentProjection;
  blockId: string;
}) {
  const outputFeature = deploymentProjection.deploymentOutput?.find(
    (a: any) => a.id === blockId,
  )?.mqOutput as MQOutput | undefined;

  if (!outputFeature) {
    return '배포 정보가 없습니다. 배포가 완료되었는지 확인해 주세요.';
  }

  return (
    <Descriptions
      column={1}
      items={[
        {
          key: '1',
          label: 'MQ AMQPS(연결 문자열)',
          children: outputFeature.mqAmqps,
        },
        {
          key: '2',
          label: 'MQ Username/Password',
          children: (
            <Button
              icon={<DownloadOutlined />}
              onClick={() =>
                downloadCredential(
                  mqBlock.mqFeatures.username,
                  mqBlock.mqFeatures.password,
                )
              }
            >
              다운로드
            </Button>
          ),
        },
      ]}
    />
  );
}

function downloadCredential(username: string, password: string) {
  const fileContent = `
  MQ Username: ${username}
  MQ Password: ${password}
  `;
  const element = document.createElement('a');
  const file = new Blob([fileContent], {
    type: 'text/plain',
  });
  element.href = URL.createObjectURL(file);
  element.download = 'MQ_credential.txt';
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}
