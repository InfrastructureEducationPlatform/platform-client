import { Descriptions, DescriptionsProps, Flex } from 'antd';
import { useEffect } from 'react';

import { DeploymentProjection } from '../../libs/core-api/api';

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
      <DeploymentGeneralProperties
        deploymentProjection={deploymentProjection}
      />
      밑에는 실제 블록들의 스펙 등등(플러그인 적용된?)
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
