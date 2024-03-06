import { LoadingOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import React, { useEffect } from 'react';

import {
  DeploymentProjection,
  DeploymentStatus,
} from '../../libs/core-api/api';

export function DeploymentTimelineView({
  setCurrent,
  deploymentProjection,
}: {
  setCurrent: (key: string) => void;
  deploymentProjection: DeploymentProjection;
}) {
  useEffect(() => {
    setCurrent('timeline');
  }, [setCurrent]);

  const convertDeploymentStatus = (status: DeploymentStatus) => {
    switch (status) {
      case DeploymentStatus.Created:
        return 1;
      case DeploymentStatus.Deploying:
        return 2;
      case DeploymentStatus.Deployed:
        return 3;
    }
  };

  return (
    <Steps
      style={{
        marginTop: '20px',
      }}
      direction={'vertical'}
      size={'default'}
      current={convertDeploymentStatus(deploymentProjection.deploymentStatus)}
      status={
        deploymentProjection.deploymentStatus === DeploymentStatus.Failed
          ? 'error'
          : deploymentProjection.deploymentStatus === DeploymentStatus.Deployed
            ? 'finish'
            : 'process'
      }
      items={[
        {
          title: '배포 요청',
          description:
            '스케치/배포 블록 데이터와 플러그인 정보를 서버에 전송했습니다.',
        },
        {
          title: '배포 요청',
          description:
            '배포 요청 데이터를 확인하고 배포를 진행할 수 있도록 설정 중입니다.',
          icon:
            convertDeploymentStatus(deploymentProjection.deploymentStatus) ===
            1 ? (
              <LoadingOutlined />
            ) : undefined,
        },
        {
          title: '배포 진행 중',
          description: '인프라를 생성하고, 배포를 진행하고 있습니다.',
          icon:
            convertDeploymentStatus(deploymentProjection.deploymentStatus) ===
            2 ? (
              <LoadingOutlined />
            ) : undefined,
        },
        {
          title: '배포 완료',
          description: '배포가 완료되었습니다. 배포 결과를 확인하세요.',
        },
      ]}
    />
  );
}
