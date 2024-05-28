import React from 'react';

import { usePricingQuery } from '../../../api/queries.tsx';
import { DeploymentProjection } from '../../../libs/core-api/api';
import {
  CacheBlock,
  DatabaseBlock,
  VirtualMachineBlock,
  WebServerBlock,
} from '../../../types/BlockTypes.ts';
import { CacheBlockDetail } from './CacheBlockDetail/CacheBlockDetail.tsx';
import { DeploymentDatabaseBlockDetail } from './DatabaseBlockDetail/DeploymentDatabaseBlockDetail.tsx';
import { DeploymentVmBlockDetail } from './VMDetail/DeploymentVmBlockDetail.tsx';
import { DeploymentWebServerBlockDetail } from './WebServerDetail/DeploymentWebServerBlockDetail.tsx';

type MultipleBlockType =
  | VirtualMachineBlock
  | WebServerBlock
  | DatabaseBlock
  | CacheBlock;

export function DeploymentGeneralBlockDetail({
  deploymentProjection,
}: {
  deploymentProjection: DeploymentProjection;
}) {
  const data = deploymentProjection.capturedBlockSketch
    .blockList as MultipleBlockType[];

  const { data: priceList } = usePricingQuery();

  if (!data || !priceList) {
    return <div>블록 정보를 불러오는 중...</div>;
  }

  return data.map((node) => {
    if (node.type === 'virtualMachine') {
      return (
        <DeploymentVmBlockDetail
          key={node.id}
          nodeData={node as VirtualMachineBlock}
          priceInfo={priceList}
          plugin={deploymentProjection.pluginId}
          deploymentProjection={deploymentProjection}
        />
      );
    }
    if (node.type === 'webServer') {
      return (
        <DeploymentWebServerBlockDetail
          key={node.id}
          nodeData={node as WebServerBlock}
          priceInfo={priceList}
          plugin={deploymentProjection.pluginId}
          deploymentProjection={deploymentProjection}
        />
      );
    }
    if (node.type === 'database') {
      return (
        <DeploymentDatabaseBlockDetail
          key={node.id}
          nodeData={node as DatabaseBlock}
          priceInfo={priceList}
          plugin={deploymentProjection.pluginId}
          deploymentProjection={deploymentProjection}
        />
      );
    }
    if (node.type === 'cache') {
      return (
        <CacheBlockDetail
          key={node.id}
          nodeData={node as CacheBlock}
          priceInfo={priceList}
          plugin={deploymentProjection.pluginId}
          deploymentProjection={deploymentProjection}
        />
      );
    }
  });
}
