import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, DescriptionsProps, Tabs } from 'antd';
import React from 'react';
import Markdown from 'react-markdown';

import {
  DeploymentProjection,
  PricingInformationProjection,
} from '../../../../libs/core-api/api';
import { DatabaseBlock } from '../../../../types/BlockTypes.ts';
import { findPrice } from '../../../../utils/PricingUtils.ts';
import { getDbGuideline } from './DbGuideline.ts';

export function DeploymentDatabaseBlockDetail({
  nodeData,
  priceInfo,
  plugin,
  deploymentProjection,
}: {
  nodeData: DatabaseBlock;
  priceInfo: PricingInformationProjection[];
  plugin: string;
  deploymentProjection: DeploymentProjection;
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
      <Tabs
        defaultActiveKey={'1'}
        items={[
          {
            key: '1',
            label: '데이터베이스 블록 정보',
            children: (
              <Descriptions
                title={`데이터베이스 "${nodeData.name}" 정보`}
                items={descriptionItems}
              />
            ),
          },
          {
            key: '2',
            label: '배포 결과 및 DB 정보 확인하기',
            children: (
              <DBDeploymentResultView
                deploymentProjection={deploymentProjection}
                blockId={nodeData.id}
              />
            ),
          },
          {
            key: '3',
            label: '기본 DB연결 가이드/팁',
            children: (
              <DbGuideTip
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

type DatabaseOutput = {
  publicFQDN: string;
  databaseUsername: string;
  databasePassword: string;
  dbInstanceIdentifierVal: string;
};

function DbGuideTip({
  deploymentProjection,
  blockId,
}: {
  deploymentProjection: DeploymentProjection;
  blockId: string;
}) {
  const outputFeature = deploymentProjection.deploymentOutput?.find(
    (a: any) => a.id === blockId,
  )?.databaseOutput as DatabaseOutput | undefined;

  if (!outputFeature) {
    return '배포 정보가 없습니다. 배포가 완료되었는지 확인해 주세요.';
  }

  return <Markdown>{getDbGuideline(outputFeature.publicFQDN)}</Markdown>;
}

function DBDeploymentResultView({
  deploymentProjection,
  blockId,
}: {
  deploymentProjection: DeploymentProjection;
  blockId: string;
}) {
  const outputFeature = deploymentProjection.deploymentOutput?.find(
    (a: any) => a.id === blockId,
  )?.databaseOutput as DatabaseOutput | undefined;

  if (!outputFeature) {
    return '배포 정보가 없습니다. 배포가 완료되었는지 확인해 주세요.';
  }

  return (
    <Descriptions
      column={1}
      items={[
        {
          key: '1',
          label: 'DB Identifier',
          children: outputFeature.dbInstanceIdentifierVal,
        },
        {
          key: '2',
          label: 'DB FQDN(Endpoint)',
          children: outputFeature.publicFQDN,
        },
        {
          key: '3',
          label: 'DB ID/비밀번호',
          children: (
            <Button
              icon={<DownloadOutlined />}
              onClick={() =>
                downloadCredential(
                  outputFeature.databaseUsername,
                  outputFeature.databasePassword,
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
  Database Username: ${username}
  Database Password: ${password}
  `;
  const element = document.createElement('a');
  const file = new Blob([fileContent], {
    type: 'text/plain',
  });
  element.href = URL.createObjectURL(file);
  element.download = 'credential.txt';
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}
