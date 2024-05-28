import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, DescriptionsProps, Tabs } from 'antd';
import React from 'react';

import {
  DeploymentProjection,
  PricingInformationProjection,
} from '../../../../libs/core-api/api';
import { CacheBlock } from '../../../../types/BlockTypes.ts';

export function CacheBlockDetail({
  nodeData,
  priceInfo,
  plugin,
  deploymentProjection,
}: {
  nodeData: CacheBlock;
  priceInfo: PricingInformationProjection[];
  plugin: string;
  deploymentProjection: DeploymentProjection;
}) {
  const descriptionItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Cache 성능',
      children: nodeData.cacheFeatures.tier,
    },
    {
      key: '2',
      label: 'Cache 지역',
      children: nodeData.cacheFeatures.region,
    },
  ];

  return (
    <Card>
      <Tabs
        defaultActiveKey={'1'}
        items={[
          {
            key: '1',
            label: '캐시 블록 정보',
            children: (
              <Descriptions
                title={`캐시 "${nodeData.name}" 정보`}
                items={descriptionItems}
              />
            ),
          },
          {
            key: '2',
            label: '배포 결과 및 캐시 정보 확인하기',
            children: (
              <CacheResultView
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

type CacheOutput = {
  redisHost: string;
  redisPort: number;
  redisPrimaryAccessKey: string;
};

function CacheResultView({
  deploymentProjection,
  blockId,
}: {
  deploymentProjection: DeploymentProjection;
  blockId: string;
}) {
  const outputFeature = deploymentProjection.deploymentOutput?.find(
    (a: any) => a.id === blockId,
  )?.cacheOutput as CacheOutput | undefined;

  if (!outputFeature) {
    return '배포 정보가 없습니다. 배포가 완료되었는지 확인해 주세요.';
  }

  return (
    <Descriptions
      column={1}
      items={[
        {
          key: '1',
          label: 'Redis Cache Host',
          children: outputFeature.redisHost,
        },
        {
          key: '2',
          label: 'Redis Cache Port',
          children: outputFeature.redisPort,
        },
        {
          key: '3',
          label: 'Redis Cache Primary Access Key',
          children:
            outputFeature.redisPrimaryAccessKey.length > 0 ? (
              <Button
                icon={<DownloadOutlined />}
                onClick={() =>
                  downloadRedis(outputFeature?.redisPrimaryAccessKey)
                }
              >
                다운로드
              </Button>
            ) : (
              'Key 없음(서비스에서 키 없이 접근 가능)'
            ),
        },
      ]}
    />
  );
}

function downloadRedis(accessKey: string) {
  const fileContent = `
  accessKey: ${accessKey}
  `;
  const element = document.createElement('a');
  const file = new Blob([fileContent], {
    type: 'text/plain',
  });
  element.href = URL.createObjectURL(file);
  element.download = 'redis_credential.txt';
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}
