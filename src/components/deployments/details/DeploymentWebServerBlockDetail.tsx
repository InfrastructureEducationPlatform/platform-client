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

import {
  DeploymentProjection,
  PricingInformationProjection,
} from '../../../libs/core-api/api';
import { WebServerBlock } from '../../../types/BlockTypes.ts';
import { CustomModal } from '../../CustomModal.tsx';
import { findPrice } from './DeploymentVmBlockDetail.tsx';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      children: nodeData.webServerFeatures.containerMetadata.username,
    },
    {
      key: '6',
      label: '시간 당 예상 가격(플러그인 반영)',
      children: `$${findPrice(
        plugin,
        priceInfo,
        'WebServer',
        nodeData.webServerFeatures.tier === 'high'
          ? 'large'
          : nodeData.webServerFeatures.tier,
      )}`,
    },
  ];

  return (
    <Card>
      <Descriptions
        title={`웹 서버 "${nodeData.name}" 정보`}
        items={descriptionItems}
      />
      <Flex style={{ justifyContent: 'flex-end' }}>
        <Button type={'primary'} onClick={() => setIsModalVisible(true)}>
          배포 결과 및 연결 문자열 보기
        </Button>
      </Flex>
      {isModalVisible && (
        <WebDeploymentTutorialModal
          modalVisible={isModalVisible}
          setModalVisible={setIsModalVisible}
          deploymentProjection={deploymentProjection}
          blockId={nodeData.id}
        />
      )}
    </Card>
  );
}

type WebServerOutput = {
  appName: string;
  publicFQDN: string;
};
function WebDeploymentTutorialModal({
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
    (a: any) => a.id === blockId,
  ).webServerOutput as WebServerOutput;
  // const markdown = `
  // ### SSH Client 설치 (TODO: 각 OS별로 설치 방법 추가)
  // - Windows: [PuTTY](https://www.putty.org/)
  // - Mac: [Terminal](https://support.apple.com/ko-kr/guide/terminal/welcome/mac)
  //
  // ### 기본 연결 정보
  // - Host: ${outputFeature.ipAddress}
  // - Port: 22
  // - Username: ubuntu
  // - Password: PEM 키(배포 결과 확인 칸에서 다운로드) 사용
  //
  // ### SSH 연결 방법(Windows)
  // ### *Nix/Mac ssh연결 방법
  // \`\`\`shell
  // $ chmod 400 /path/to/key.pem
  // $ ssh -i /path/to/key.pem ubuntu@${outputFeature.ipAddress}
  // \`\`\`
  // `;
  const steps = [
    {
      title: '배포 결과 및 웹 서버 정보 확인',
      content: (
        <Flex style={{ flexDirection: 'column', gap: '10px' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            웹 인스턴스 정보
          </Typography.Title>
          <Descriptions
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
            ]}
          />
        </Flex>
      ),
    },
    {
      title: 'Tutorial: 이미지 업데이트',
      content: '',
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
      </Flex>
    </CustomModal>
  );
}
