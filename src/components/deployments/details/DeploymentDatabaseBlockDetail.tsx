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
import { DatabaseBlock } from '../../../types/BlockTypes.ts';
import { CustomModal } from '../../CustomModal.tsx';
import { findPrice } from './DeploymentVmBlockDetail.tsx';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      <Descriptions
        title={`데이터베이스 "${nodeData.name}" 정보`}
        items={descriptionItems}
      />
      <Flex style={{ justifyContent: 'flex-end' }}>
        <Button type={'primary'} onClick={() => setIsModalVisible(true)}>
          배포 결과 및 연결 문자열 보기
        </Button>
      </Flex>
      {isModalVisible && (
        <DBDeploymentTutorialModal
          modalVisible={isModalVisible}
          setModalVisible={setIsModalVisible}
          deploymentProjection={deploymentProjection}
          blockId={nodeData.id}
        />
      )}
    </Card>
  );
}

type DatabaseOutput = {
  publicFQDN: string;
  databaseUsername: string;
  databasePassword: string;
  dbInstanceIdentifierVal: string;
};
function DBDeploymentTutorialModal({
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
  ).databaseOutput as DatabaseOutput;
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
      title: '배포 결과 및 DB정보 확인',
      content: (
        <Flex style={{ flexDirection: 'column', gap: '10px' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            DB 연결에 필요한 정보
          </Typography.Title>
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
                    onClick={() =>
                      downloadCredential(
                        outputFeature.databaseUsername,
                        outputFeature.databasePassword,
                      )
                    }
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
      title: 'Tutorial: PSQL을 통한 연결',
      content: '',
    },
    {
      title: 'Tutorial: DB Driver을 통한 연결(C#)',
      content: '',
    },
    {
      title: 'Tutorial: DB Driver을 통한 연결(Kotlin)',
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
