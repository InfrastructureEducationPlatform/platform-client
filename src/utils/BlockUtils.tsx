import { Node } from 'reactflow';

import { VirtualMachineBlockNode } from '../components/blocks/VirtualMachineBlockNode.tsx';
import { Block } from '../components/providers/SketchProvider.tsx';

// Supported Node Type
export const supportedBlockNodeTypes = {
  virtualMachine: VirtualMachineBlockNode,
};

// Convert Block(usually from saved data from server) to Node(react-flow)
// this will examine blockType and convert it to Node(see each sub-function for more reference.)
export function convertBlockToNode(block: Block): Node {
  if (block.blockType === 'virtualMachine') {
    return convertVMBlockToNode(block);
  }
  throw new Error(`Block Type ${block.blockType} is not supported!`);
}

// Convert VM Block(usually from saved data from server) to Node(react-flow)
function convertVMBlockToNode(block: Block): Node {
  return {
    id: block.id,
    position: { x: block.x, y: block.y },
    type: block.blockType,
    data: {
      blockTitle: block.blockTitle,
      blockDescription: block.blockDescription,
      vmTier: block.vmTier,
      vmRegion: block.vmRegion,
      vmOperatingSystem: block.vmOperatingSystem,
      blockTags: block.blockTags,
    },
  };
}
