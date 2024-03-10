import { Node } from 'reactflow';

import { DatabaseBlockNode } from '../components/blocks/DatabaseBlockNode.tsx';
import {
  VirtualMachineBlockNode,
  VirtualMachineBlockNodeProps,
} from '../components/blocks/VirtualMachineBlockNode.tsx';
import {
  WebServerBlockNode,
  WebServerBlockNodeProps,
} from '../components/blocks/WebServerBlockNode.tsx';
import {
  DatabaseBlock,
  ExtendedBlock,
  VirtualMachineBlock,
  WebServerBlock,
} from '../types/BlockTypes.ts';

// Supported Node Type
export const supportedBlockNodeTypes = {
  virtualMachine: VirtualMachineBlockNode,
  webServer: WebServerBlockNode,
  database: DatabaseBlockNode,
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

  throw new Error(`Block Type ${block.type} is not supported!`);
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
      },
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
      },
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
