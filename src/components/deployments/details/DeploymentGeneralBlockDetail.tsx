import React from 'react';

import { useSketchBlockQuery } from '../../../api/queries.tsx';
import { DeploymentProjection } from '../../../libs/core-api/api';
import {
  DatabaseBlock,
  VirtualMachineBlock,
  WebServerBlock,
} from '../../../types/BlockTypes.ts';
import { DeploymentDatabaseBlockDetail } from './DeploymentDatabaseBlockDetail.tsx';
import { DeploymentVmBlockDetail } from './DeploymentVmBlockDetail.tsx';
import { DeploymentWebServerBlockDetail } from './DeploymentWebServerBlockDetail.tsx';

export function DeploymentGeneralBlockDetail({
  deploymentProjection,
}: {
  deploymentProjection: DeploymentProjection;
}) {
  const { data } = useSketchBlockQuery(
    deploymentProjection.channelId,
    deploymentProjection.sketchId,
  );

  if (!data) {
    return <div>블록 정보를 불러오는 중...</div>;
  }

  return data.map((node) => {
    if (node.type === 'virtualMachine') {
      return (
        <DeploymentVmBlockDetail
          key={node.id}
          nodeData={node as VirtualMachineBlock}
        />
      );
    }
    if (node.type === 'webServer') {
      return (
        <DeploymentWebServerBlockDetail
          key={node.id}
          nodeData={node as WebServerBlock}
        />
      );
    }
    if (node.type === 'database') {
      return (
        <DeploymentDatabaseBlockDetail
          key={node.id}
          nodeData={node as DatabaseBlock}
        />
      );
    }
  });
}
