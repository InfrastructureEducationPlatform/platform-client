import { CloseOutlined } from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Divider,
  Flex,
  Menu,
  Steps,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { useDeploymentListAsMenuQuery } from '../api/queries.tsx';
import { DeploymentProjection, DeploymentStatus } from '../libs/core-api/api';
import { CustomModal } from './CustomModal.tsx';

export function DeploymentListView({
  modalVisible,
  setModalVisible,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}) {
  const [refetchKey, setRefetchKey] = useState(`${modalVisible}`);
  const { data, isLoading } = useDeploymentListAsMenuQuery(refetchKey);
  const [selectedDeployment, setSelectedDeployment] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (!data) return;

    if (!selectedDeployment) {
      setSelectedDeployment(data.deploymentMenuList[0].key);
    }
  }, [data]);

  useEffect(() => {
    setRefetchKey(`${modalVisible}`);
  }, [modalVisible]);

  if (!data || isLoading) {
    return <div>로딩중..s</div>;
  }

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
            background: 'rgba(55, 53, 47, 0.03)',
            width: '240px',
          }}
        >
          <Menu
            mode="inline"
            items={data.deploymentMenuList}
            onSelect={(a) => {
              setSelectedDeployment(a.key);
            }}
            selectedKeys={[selectedDeployment ?? '']}
          />
        </Flex>

        <SingleDeploymentLog
          isModalVisible={modalVisible}
          selectedDeploymentId={selectedDeployment}
          deploymentList={data.deploymentLogReference}
          setRefetchKey={setRefetchKey}
        />

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

function SingleDeploymentLog({
  isModalVisible,
  selectedDeploymentId,
  deploymentList,
  setRefetchKey,
}: {
  isModalVisible: boolean;
  selectedDeploymentId: string | undefined;
  deploymentList: DeploymentProjection[];
  setRefetchKey: (key: string) => void;
}) {
  // Setup Refetch Key
  useEffect(() => {
    if (isModalVisible) {
      const interval = setInterval(() => {
        setRefetchKey(new Date().toISOString());
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [setRefetchKey, isModalVisible]);

  if (!selectedDeploymentId) return null;

  const currentDeploymentLog = deploymentList.find(
    (a) => a.deploymentId === selectedDeploymentId,
  )!;

  const convertDeploymentStatus = (status: DeploymentStatus) => {
    switch (status) {
      case DeploymentStatus.Created:
        return 0;
      case DeploymentStatus.Deploying:
        return 1;
      case DeploymentStatus.Deployed:
        return 2;
    }
  };

  return (
    <Flex
      style={{
        flexDirection: 'column',
        padding: '20px',
        width: 'calc(100% - 240px)',
        overflow: 'auto',
        lineHeight: 'initial',
      }}
    >
      <div>
        <Typography.Title level={4}>배포 기본 정보</Typography.Title>
        <Divider style={{ width: '100%', margin: 0 }} />
        <Descriptions
          title={''}
          column={1}
          size={'small'}
          items={[
            {
              key: 'deploymentId',
              label: '배포 ID',
              children: currentDeploymentLog.deploymentId,
            },
            {
              key: 'pluginId',
              label: '사용한 플러그인 ID',
              children: currentDeploymentLog.pluginId,
            },
            {
              key: 'createdAt',
              label: '배포 요청 시각',
              children: new Date(currentDeploymentLog.createdAt).toString(),
            },
          ]}
        />
      </div>
      <div>
        <Typography.Title level={4}>배포 상태</Typography.Title>
        <Divider style={{ width: '100%', margin: 0, marginBottom: '10px' }} />
        <Steps
          direction={'vertical'}
          size={'small'}
          current={convertDeploymentStatus(
            currentDeploymentLog.deploymentStatus,
          )}
          status={
            currentDeploymentLog.deploymentStatus === DeploymentStatus.Deployed
              ? 'finish'
              : 'process'
          }
          items={[
            {
              title: '배포 요청',
              description:
                '배포 요청을 확인 했고, 인프라를 생성할 준비하고 있습니다.',
            },
            {
              title: '배포 진행 중',
              description: '인프라를 생성하고, 배포를 진행하고 있습니다.',
            },
            {
              title: '배포 완료',
              description:
                '배포가 완료되었습니다. 아래 배포 결과를 확인하세요.',
            },
          ]}
        />
      </div>
    </Flex>
  );
}
