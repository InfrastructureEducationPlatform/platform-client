export type Block = {
  id: string;
  x: number;
  y: number;
  type: string;
  name: string;
  description: string;
  tags: string[];
  advancedMeta: any;
};

export type VirtualMachineBlock = Block & {
  type: 'virtualMachine';
  virtualMachineFeatures: {
    tier: 'low' | 'medium' | 'high' | 'custom';
    region: 'korea' | 'defaultAccount';
    osType: 'ubuntu';
  };
};

export type ExtendedBlock = VirtualMachineBlock;
