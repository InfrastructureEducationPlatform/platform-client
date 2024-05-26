import { Card, Descriptions, DescriptionsProps, Flex, Tabs } from 'antd';
import React from 'react';
import Markdown from 'react-markdown';

import {
  DeploymentProjection,
  PricingInformationProjection,
} from '../../../../libs/core-api/api';
import { WebServerBlock } from '../../../../types/BlockTypes.ts';
import { findPrice } from '../DeploymentVmBlockDetail.tsx';
import { generateGithubIntegrationGuideline } from './WebServerGuideline.ts';

export function DeploymentWebServerBlockDetail({
  nodeData,
  priceInfo,
  plugin,
  deploymentProjection,
}: {
  nodeData: WebServerBlock;
  priceInfo: PricingInformationProjection[];
  plugin: string;
  deploymentProjection: DeploymentProjection;
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
      children: nodeData.webServerFeatures.containerMetadata.username ?? 'N/A',
    },
  ];

  return (
    <Card bodyStyle={{ paddingTop: 16 }}>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: '웹 서버 블록 정보',
            key: '1',
            children: (
              <Descriptions
                title={`웹 서버 "${nodeData.name}" 정보`}
                items={descriptionItems}
              />
            ),
          },
          {
            label: '배포 및 연결 정보 확인하기',
            key: '2',
            children: (
              <WebDeploymentOutputView
                deploymentProjection={deploymentProjection}
                blockId={nodeData.id}
                pricing={findPrice(
                  plugin,
                  priceInfo,
                  'WebServer',
                  nodeData.webServerFeatures.tier === 'high'
                    ? 'large'
                    : nodeData.webServerFeatures.tier,
                )}
              />
            ),
          },
          {
            key: '3',
            label: 'Github Action과 연동하기',
            children: (
              <Markdown>
                {generateGithubIntegrationGuideline(
                  deploymentProjection.channelId,
                  deploymentProjection.sketchId,
                  deploymentProjection.pluginId,
                  nodeData.id,
                )}
              </Markdown>
            ),
          },
        ]}
      />
    </Card>
  );
}

type WebServerOutput = {
  appName: string;
  publicFQDN: string;
};
function WebDeploymentOutputView({
  deploymentProjection,
  blockId,
  pricing,
}: {
  deploymentProjection: DeploymentProjection;
  blockId: string;
  pricing: number;
}) {
  const outputFeature = deploymentProjection.deploymentOutput.find(
    (a: any) => a.id === blockId,
  ).webServerOutput as WebServerOutput;
  return (
    <Flex style={{ flexDirection: 'column', gap: '10px' }}>
      <Descriptions
        title={'웹 인스턴스 정보'}
        column={1}
        items={[
          {
            key: '1',
            label: '어플리케이션 이름',
            children: outputFeature.appName,
          },
          {
            key: '2',
            label: 'Web Server FQDN(Endpoint)',
            children: outputFeature.publicFQDN,
          },
          {
            key: '3',
            label: '시간 당 예상 가격',
            children: `$${pricing}`,
          },
        ]}
      />
    </Flex>
  );
}
