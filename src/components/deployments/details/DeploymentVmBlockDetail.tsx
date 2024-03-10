import { CloseOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Descriptions,
  DescriptionsProps,
  Flex,
  Steps,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import Markdown from 'react-markdown';

import {
  DeploymentProjection,
  PricingInformationProjection,
} from '../../../libs/core-api/api';
import { VirtualMachineBlock } from '../../../types/BlockTypes.ts';
import { CustomModal } from '../../CustomModal.tsx';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      <Flex style={{ justifyContent: 'flex-end' }}>
        <Button type={'primary'} onClick={() => setIsModalVisible(true)}>
          배포 결과 및 연결 문자열 보기
        </Button>
      </Flex>
      <VmDeploymentTutorialModal
        modalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        deploymentProjection={deploymentProjection}
        blockId={nodeData.id}
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

type VirtualMachineOutput = {
  instanceId: string;
  ipAddress: string;
  sshPrivateKey: string;
};
function VmDeploymentTutorialModal({
  modalVisible,
  setModalVisible,
  deploymentProjection,
  blockId,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  deploymentProjection: DeploymentProjection;
  blockId: string;
}) {
  const [current, setCurrent] = useState(0);
  const outputFeature = deploymentProjection.deploymentOutput.find(
    (a) => a.id === blockId,
  ).virtualMachineOutput as VirtualMachineOutput;
  const markdown = `
  ### SSH Client 설치 (TODO: 각 OS별로 설치 방법 추가)
  - Windows: [PuTTY](https://www.putty.org/)
  - Mac: [Terminal](https://support.apple.com/ko-kr/guide/terminal/welcome/mac)
  
  ### 기본 연결 정보
  - Host: ${outputFeature.ipAddress}
  - Port: 22
  - Username: ubuntu
  - Password: PEM 키(배포 결과 확인 칸에서 다운로드) 사용
  
  ### SSH 연결 방법(Windows)
  ### *Nix/Mac ssh연결 방법
  \`\`\`shell
  $ chmod 400 /path/to/key.pem
  $ ssh -i /path/to/key.pem ubuntu@${outputFeature.ipAddress}
  \`\`\`
  `;
  const steps = [
    {
      title: '배포 결과 확인',
      content: (
        <Flex style={{ flexDirection: 'column', gap: '10px' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            가상 머신 연결에 필요한 정보
          </Typography.Title>
          <Descriptions
            column={1}
            items={[
              {
                key: '1',
                label: '인스턴스 ID',
                children: outputFeature.instanceId,
              },
              {
                key: '2',
                label: 'IP 주소',
                children: outputFeature.ipAddress,
              },
              {
                key: '3',
                label: 'SSH Private Key',
                children: (
                  <Button
                    onClick={() => downloadKey(outputFeature.sshPrivateKey)}
                    type={'link'}
                  >
                    다운로드
                  </Button>
                ),
              },
            ]}
          />
        </Flex>
      ),
    },
    {
      title: 'SSH Client',
      content: (
        <Flex style={{ flexDirection: 'column', gap: '10px' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            가상 머신 연결에 필요한 정보
          </Typography.Title>
          <Markdown>{markdown}</Markdown>
        </Flex>
      ),
    },
  ];
  return (
    <CustomModal isVisible={modalVisible}>
      <Flex
        style={{
          background: 'white',
          borderRadius: '8px',
          height: '400px',
          overflow: 'hidden',
        }}
      >
        <Flex
          style={{
            padding: '20px',
            width: '240px',
            height: '50%',
            borderRight: '1px solid rgba(55, 53, 47, 0.06)',
          }}
        >
          <Steps
            onChange={(value) => setCurrent(value)}
            direction="vertical"
            current={current}
            items={steps}
          />
        </Flex>

        <Flex
          style={{
            padding: '20px',
            width: 'calc(100% - 240px)',
            flexDirection: 'column',
            gap: '20px',
            overflow: 'auto',
          }}
        >
          {steps[current].content}
        </Flex>

        <Button
          icon={<CloseOutlined />}
          shape={'circle'}
          type={'text'}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
          }}
          onClick={() => {
            setModalVisible(false);
          }}
        />
      </Flex>{' '}
    </CustomModal>
  );
}

function downloadKey(key: string) {
  const element = document.createElement('a');
  const file = new Blob([key], {
    type: 'text/plain',
  });
  element.href = URL.createObjectURL(file);
  element.download = 'key.pem';
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}
