import { Edge, MarkerType, Node } from 'reactflow';

import { CacheBlockNode } from '../components/blocks/CacheBlockNode.tsx';
import { DatabaseBlockNode } from '../components/blocks/DatabaseBlockNode.tsx';
import {
  MessageQueueBlockNode,
  MessageQueueBlockNodeProps,
} from '../components/blocks/MessageQueueBlockNode.tsx';
import {
  VirtualMachineBlockNode,
  VirtualMachineBlockNodeProps,
} from '../components/blocks/VirtualMachineBlockNode.tsx';
import {
  WebServerBlockNode,
  WebServerBlockNodeProps,
} from '../components/blocks/WebServerBlockNode.tsx';
import CustomEdge from '../components/edges/CustomEdge.tsx';
import {
  CacheBlock,
  DatabaseBlock,
  ExtendedBlock,
  MqBlock,
  VirtualMachineBlock,
  WebServerBlock,
} from '../types/BlockTypes.ts';

// Supported Node Type
export const supportedBlockNodeTypes = {
  virtualMachine: VirtualMachineBlockNode,
  webServer: WebServerBlockNode,
  database: DatabaseBlockNode,
  cache: CacheBlockNode,
  mq: MessageQueueBlockNode,
};

export const supportedEdgeTypes = {
  'custom-edge': CustomEdge,
};

// Convert Block(usually from saved data from server) to Node(react-flow)
// this will examine blockType and convert it to Node(see each sub-function for more reference.)
export function convertBlockToNode(block: ExtendedBlock): Node {
  if (block.type === 'virtualMachine') {
    return convertVMBlockToNode(block as VirtualMachineBlock);
  }

  if (block.type === 'webServer') {
    return convertWebServerBlockToNode(block as WebServerBlock);
  }

  if (block.type === 'database') {
    return convertDatabaseBlockToNode(block as DatabaseBlock);
  }

  if (block.type === 'cache') {
    return convertCacheBlockToNode(block as CacheBlock);
  }

  if (block.type === 'mq') {
    return convertMQBlockToNode(block as MqBlock);
  }

  throw new Error(`Block Type ${block.type} is not supported!`);
}

export function convertBlockToEdges(block: ExtendedBlock[]): Edge[] {
  const edges: Edge[] = [];

  block.forEach((block) => {
    if (block.type === 'webServer') {
      const webServerBlock = block as WebServerBlock;

      Object.entries(
        webServerBlock.webServerFeatures.connectionMetadata,
      ).forEach(([key, value]) => {
        edges.push({
          id: `${block.id}-${key}`,
          source: block.id,
          target: value,
          animated: true,
          type: 'custom-edge',
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      });
    }
  });
  console.log('convertBlockToEdges', edges);
  return edges;
}

// Convert VM Block(usually from saved data from server) to Node(react-flow)
function convertVMBlockToNode(block: VirtualMachineBlock): Node {
  return {
    id: block.id,
    position: { x: block.x, y: block.y },
    type: block.type,
    data: {
      blockTitle: block.name,
      blockDescription: block.description,
      vmTier: block.virtualMachineFeatures.tier,
      vmRegion: block.virtualMachineFeatures.region,
      vmOperatingSystem: block.virtualMachineFeatures.osType,
      blockTags: block.tags,
    },
  };
}

// Convert WebServer Block(usually from saved data from server) to Node(react-flow)
function convertWebServerBlockToNode(
  block: WebServerBlock,
): Node<WebServerBlockNodeProps> {
  return {
    id: block.id,
    position: { x: block.x, y: block.y },
    type: block.type,
    data: {
      blockTitle: block.name,
      blockDescription: block.description,
      blockTags: block.tags,
      webServerRegion: block.webServerFeatures.region,
      webServerTier: block.webServerFeatures.tier,
      containerData: {
        registryUrl: block.webServerFeatures.containerMetadata.registryUrl,
        username: block.webServerFeatures.containerMetadata.username,
        secrets: block.webServerFeatures.containerMetadata.secrets,
        imageTags: block.webServerFeatures.containerMetadata.imageTags,
        containerPort: block.webServerFeatures.containerMetadata.containerPort,
      },
      connectionMetadata: block.webServerFeatures.connectionMetadata,
    },
  };
}

// Convert Database Block(usually from saved data from server) to Node(react-flow)
function convertDatabaseBlockToNode(block: DatabaseBlock): Node {
  return {
    id: block.id,
    position: { x: block.x, y: block.y },
    type: block.type,
    data: {
      blockTitle: block.name,
      blockDescription: block.description,
      blockTags: block.tags,
      dbTier: block.databaseFeatures.tier,
      dbRegion: block.databaseFeatures.region,
      masterUsername: block.databaseFeatures.masterUsername,
      masterPassword: block.databaseFeatures.masterPassword,
    },
  };
}

// Convert Cache Block(usually from saved data from server) to Node(react-flow)
function convertCacheBlockToNode(block: CacheBlock): Node {
  return {
    id: block.id,
    position: { x: block.x, y: block.y },
    type: block.type,
    data: {
      blockTitle: block.name,
      blockDescription: block.description,
      blockTags: block.tags,
      cacheTier: block.cacheFeatures.tier,
      cacheRegion: block.cacheFeatures.region,
    },
  };
}

// Convert MQ Block(usually from saved data from server) to Node(react-flow)
function convertMQBlockToNode(
  block: MqBlock,
): Node<MessageQueueBlockNodeProps> {
  return {
    id: block.id,
    position: { x: block.x, y: block.y },
    type: block.type,
    data: {
      blockTitle: block.name,
      blockDescription: block.description,
      blockTags: block.tags,
      mqTier: block.mqFeatures.tier,
      mqRegion: block.mqFeatures.region,
      mqUsername: block.mqFeatures.username,
      mqPassword: block.mqFeatures.password,
    },
  };
}

// Convert Node(react-flow) to Block(usually for saving to server)
// this will examine blockType and convert it to Block(see each sub-function for more reference.)
export function convertNodeToBlock(node: Node): ExtendedBlock {
  if (node.type === 'virtualMachine') {
    return convertVMNodeToBlock(node);
  }

  if (node.type === 'webServer') {
    return convertWebServerNodeToBlock(node);
  }

  if (node.type === 'database') {
    return convertDatabseNodeToBlock(node);
  }

  if (node.type === 'cache') {
    return convertCacheNodeToBlock(node);
  }

  if (node.type === 'mq') {
    return convertMQNodeToBlock(node);
  }

  throw new Error(`Node Type ${node.type} is not supported!`);
}

function convertVMNodeToBlock(
  node: Node<VirtualMachineBlockNodeProps>,
): VirtualMachineBlock {
  return {
    id: node.id,
    x: node.position.x,
    y: node.position.y,
    type: 'virtualMachine',
    name: node.data.blockTitle,
    description: node.data.blockDescription,
    tags: node.data.blockTags,
    advancedMeta: {},
    virtualMachineFeatures: {
      tier: node.data.vmTier,
      region: node.data.vmRegion,
      osType: node.data.vmOperatingSystem,
    },
  };
}

function convertWebServerNodeToBlock(
  node: Node<WebServerBlockNodeProps>,
): WebServerBlock {
  return {
    id: node.id,
    x: node.position.x,
    y: node.position.y,
    type: 'webServer',
    name: node.data.blockTitle,
    description: node.data.blockDescription,
    tags: node.data.blockTags,
    advancedMeta: {},
    webServerFeatures: {
      tier: node.data.webServerTier,
      region: node.data.webServerRegion,
      containerMetadata: {
        registryUrl: node.data.containerData.registryUrl,
        username: node.data.containerData.username,
        secrets: node.data.containerData.secrets,
        imageTags: node.data.containerData.imageTags,
        containerPort: node.data.containerData.containerPort,
      },
      connectionMetadata: node.data.connectionMetadata,
    },
  };
}

function convertDatabseNodeToBlock(node: Node): DatabaseBlock {
  return {
    id: node.id,
    x: node.position.x,
    y: node.position.y,
    type: 'database',
    name: node.data.blockTitle,
    description: node.data.blockDescription,
    tags: node.data.blockTags,
    advancedMeta: {},
    databaseFeatures: {
      tier: node.data.dbTier,
      region: node.data.dbRegion,
      masterUsername: node.data.masterUsername,
      masterPassword: node.data.masterPassword,
    },
  };
}

function convertCacheNodeToBlock(node: Node): CacheBlock {
  return {
    id: node.id,
    x: node.position.x,
    y: node.position.y,
    type: 'cache',
    name: node.data.blockTitle,
    description: node.data.blockDescription,
    tags: node.data.blockTags,
    advancedMeta: {},
    cacheFeatures: {
      tier: node.data.cacheTier,
      region: node.data.cacheRegion,
    },
  };
}

function convertMQNodeToBlock(node: Node): MqBlock {
  return {
    id: node.id,
    x: node.position.x,
    y: node.position.y,
    type: 'mq',
    name: node.data.blockTitle,
    description: node.data.blockDescription,
    tags: node.data.blockTags,
    advancedMeta: {},
    mqFeatures: {
      tier: node.data.mqTier,
      region: node.data.mqRegion,
      username: node.data.mqUsername,
      password: node.data.mqPassword,
    },
  };
}

export function getConnectionEnvironment(
  nodes: Node[],
  targetNodeId: string,
  previousConnectionMeta: { dbRef: string; cacheRef: string; mqRef: string },
): { dbRef: string; cacheRef: string; mqRef: string } {
  const node = nodes.find((node) => node.id === targetNodeId)!;

  // Each value will be evaluated by the server.
  if (node.type === 'database') {
    return { ...previousConnectionMeta, dbRef: node.id };
  }

  if (node.type === 'cache') {
    return { ...previousConnectionMeta, cacheRef: node.id };
  }

  if (node.type === 'mq') {
    return { ...previousConnectionMeta, mqRef: node.id };
  }

  return { ...previousConnectionMeta };
}

export function getCpuRamData(pluginId: string, instanceTier: string) {
  if (pluginId === 'aws-static') {
    return cpuRamDataForAws[instanceTier];
  }

  if (pluginId === 'azure-static') {
    return cpuRamDataForAzure[instanceTier];
  }

  throw new Error(`Plugin ${pluginId} is not supported!`);
}

const cpuRamDataForAws: {
  [key: string]: { cpuCount: number; ramInGb: number };
} = {
  't2.medium': {
    cpuCount: 2,
    ramInGb: 4,
  },

  't2.large': {
    cpuCount: 2,
    ramInGb: 8,
  },

  't2.xlarge': {
    cpuCount: 4,
    ramInGb: 16,
  },
};

const cpuRamDataForAzure: {
  [key: string]: { cpuCount: number; ramInGb: number };
} = {
  Standard_DS1_v2: {
    cpuCount: 1,
    ramInGb: 3.5,
  },

  Standard_DS2_v2: {
    cpuCount: 2,
    ramInGb: 7,
  },

  Standard_DS3_v2: {
    cpuCount: 4,
    ramInGb: 14,
  },
};
