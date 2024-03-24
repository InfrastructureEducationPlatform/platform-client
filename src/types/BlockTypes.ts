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

export type WebServerBlock = Block & {
  type: 'webServer';
  webServerFeatures: {
    tier: 'low' | 'medium' | 'high' | 'custom';
    region: 'korea' | 'defaultAccount';
    containerMetadata: {
      registryUrl: string;
      imageTags: string;
      username: string | undefined;
      secrets: string | undefined;
    };
    connectionMetadata: {
      targetBlockId: string;
      env: { [key: string]: string };
    }[];
  };
};

export type DatabaseBlock = Block & {
  type: 'database';
  databaseFeatures: {
    tier: 'low' | 'medium' | 'high' | 'custom';
    region: 'korea' | 'defaultAccount';
    masterUsername: string;
    masterPassword: string;
  };
};

export type ExtendedBlock =
  | VirtualMachineBlock
  | WebServerBlock
  | DatabaseBlock
  | Block;
