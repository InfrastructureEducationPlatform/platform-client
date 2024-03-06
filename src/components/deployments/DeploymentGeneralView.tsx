import { Descriptions, DescriptionsProps, Flex, Typography } from 'antd';
import React, { useEffect } from 'react';

import { DeploymentProjection } from '../../libs/core-api/api';
import { DeploymentGeneralBlockDetail } from './details/DeploymentGeneralBlockDetail.tsx';

export function DeploymentGeneralView({
  setCurrent,
  deploymentProjection,
}: {
  setCurrent: (key: string) => void;
  deploymentProjection: DeploymentProjection;
}) {
  useEffect(() => {
    setCurrent('general');
  }, [setCurrent]);

  return (
    <Flex style={{ flexDirection: 'column', padding: '15px' }} gap={20}>
      <div>
        <Typography.Title level={4} style={{ margin: 0 }}>
          배포 기본 정보
        </Typography.Title>
        <DeploymentGeneralProperties
          deploymentProjection={deploymentProjection}
        />
      </div>
      <Flex style={{ flexDirection: 'column', gap: '15px' }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          배포 블록 상세 정보
        </Typography.Title>
        <DeploymentGeneralBlockDetail
          deploymentProjection={deploymentProjection}
        />
      </Flex>
    </Flex>
  );
}

function DeploymentGeneralProperties({
  deploymentProjection,
}: {
  deploymentProjection: DeploymentProjection;
}) {
  const properties: DescriptionsProps['items'] = [
    {
      key: 'deploymentId',
      label: '배포 ID',
      children: deploymentProjection.deploymentId,
    },
    {
      key: 'deploymentCreatedDate',
      label: '배포 생성일',
      children: deploymentProjection.createdAt,
    },
    {
      key: 'deploymentStatus',
      label: '배포 상태',
      children: deploymentProjection.deploymentStatus,
    },
    {
      key: 'channelId',
      label: '채널 이름(채널 ID)',
      children: `${deploymentProjection.channelName}(${deploymentProjection.channelId})`,
    },
    {
      key: 'pluginId',
      label: '플러그인 ID',
      children: deploymentProjection.pluginId,
    },
  ];

  return <Descriptions items={properties} bordered />;
}
