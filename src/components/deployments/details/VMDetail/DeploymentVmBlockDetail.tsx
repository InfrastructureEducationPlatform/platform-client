import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, DescriptionsProps, Tabs } from 'antd';
import React from 'react';
import Markdown from 'react-markdown';

import {
  DeploymentProjection,
  PricingInformationProjection,
} from '../../../../libs/core-api/api';
import { VirtualMachineBlock } from '../../../../types/BlockTypes.ts';
import { findPrice } from '../../../../utils/PricingUtils.ts';
import { VirtualMachineGuideline } from './VirtualMachineGuideline.ts';

export function DeploymentVmBlockDetail({
  nodeData,
  priceInfo,
  plugin,
  deploymentProjection,
}: {
  nodeData: VirtualMachineBlock;
  priceInfo: PricingInformationProjection[];
  plugin: string;
  deploymentProjection: DeploymentProjection;
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

  const outputFeature = deploymentProjection.deploymentOutput.find(
    (a: any) => a.id === nodeData.id,
  ).virtualMachineOutput as VirtualMachineOutput;

  return (
    <Card>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: 'VM 서버 블록 정보',
            key: '1',
            children: (
              <Descriptions
                title={`가상 머신 "${nodeData.name}" 정보`}
                items={descriptionItems}
              />
            ),
          },
          {
            label: '배포 정보 확인하기',
            key: '2',
            children: (
              <Descriptions
                title={'배포 인스턴스 정보'}
                column={2}
                items={[
                  {
                    key: '1',
                    label: '인스턴스 ID',
                    children: outputFeature.instanceId,
                  },
                  {
                    key: '2',
                    label: 'SSH Key 다운로드',
                    children: (
                      <Button
                        onClick={() => downloadKey(outputFeature.sshPrivateKey)}
                        style={{ margin: 0 }}
                        icon={<DownloadOutlined />}
                      >
                        다운로드
                      </Button>
                    ),
                  },
                  {
                    key: '3',
                    label: '사용자 이름(username)',
                    children: 'ubuntu',
                  },
                  {
                    key: '4',
                    label: 'IP Address',
                    children: outputFeature.ipAddress,
                  },
                  {
                    key: '5',
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
                ]}
              />
            ),
          },
          {
            label: '팁 및 연결하기',
            key: '3',
            children: (
              <VmDeploymentTutorial
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

type VirtualMachineOutput = {
  instanceId: string;
  ipAddress: string;
  sshPrivateKey: string;
};
function VmDeploymentTutorial({
  deploymentProjection,
  blockId,
}: {
  deploymentProjection: DeploymentProjection;
  blockId: string;
}) {
  const outputFeature = deploymentProjection.deploymentOutput.find(
    (a: any) => a.id === blockId,
  ).virtualMachineOutput as VirtualMachineOutput;

  return (
    <>
      <Markdown>{VirtualMachineGuideline(outputFeature.ipAddress)}</Markdown>
    </>
  );
}

function downloadKey(key: string) {
  const element = document.createElement('a');
  const file = new Blob([key], {
    type: 'text/plain',
  });
  element.href = URL.createObjectURL(file);
  element.download = 'key.pem';
  console.log('element', element);
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}
