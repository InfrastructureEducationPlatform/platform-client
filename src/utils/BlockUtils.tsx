import { Node } from 'reactflow';

import {
  VirtualMachineBlockNode,
  VirtualMachineBlockNodeProps,
} from '../components/blocks/VirtualMachineBlockNode.tsx';
import { ExtendedBlock, VirtualMachineBlock } from '../types/BlockTypes.ts';

// Supported Node Type
export const supportedBlockNodeTypes = {
  virtualMachine: VirtualMachineBlockNode,
};

// Convert Block(usually from saved data from server) to Node(react-flow)
// this will examine blockType and convert it to Node(see each sub-function for more reference.)
export function convertBlockToNode(block: ExtendedBlock): Node {
  if (block.type === 'virtualMachine') {
    return convertVMBlockToNode(block as VirtualMachineBlock);
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

// Convert Node(react-flow) to Block(usually for saving to server)
// this will examine blockType and convert it to Block(see each sub-function for more reference.)
export function convertNodeToBlock(node: Node): ExtendedBlock {
  if (node.type === 'virtualMachine') {
    return convertVMNodeToBlock(node);
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
