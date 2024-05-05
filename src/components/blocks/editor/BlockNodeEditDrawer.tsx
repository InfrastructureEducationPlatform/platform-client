import { Drawer } from 'antd';
import React, { ReactNode } from 'react';
import { Node } from 'reactflow';

import { CacheBlockEditor } from './CacheNodeEditDrawer.tsx';
import { DatabaseBlockEditor } from './DatabaseBlockEditor.tsx';
import { VirtualMachineBlockEditor } from './VirtualMachineBlockEditor.tsx';
import { WebServerBlockEditor } from './WebServerBlockEditor.tsx';

export type CommonBlockNodeContentProps = {
  node: Node | undefined;
  setNode: (value: Node) => void;
  setDrawerVisible: (value: boolean) => void;
};

// Top Level Key-Map for Drawer Contents
const keyMap = new Map<
  string,
  (commonBlockNodeContentProps: CommonBlockNodeContentProps) => ReactNode
>();
keyMap.set('virtualMachine', (commonBlockNodeContentProps) => (
  <VirtualMachineBlockEditor
    node={commonBlockNodeContentProps.node}
    setNode={commonBlockNodeContentProps.setNode}
    setDrawerVisible={commonBlockNodeContentProps.setDrawerVisible}
  />
));
keyMap.set('webServer', (commonBlockNodeContentProps) => (
  <WebServerBlockEditor
    node={commonBlockNodeContentProps.node}
    setNode={commonBlockNodeContentProps.setNode}
    setDrawerVisible={commonBlockNodeContentProps.setDrawerVisible}
  />
));
keyMap.set('database', (commonBlockNodeContentProps) => (
  <DatabaseBlockEditor
    node={commonBlockNodeContentProps.node}
    setNode={commonBlockNodeContentProps.setNode}
    setDrawerVisible={commonBlockNodeContentProps.setDrawerVisible}
  />
));
keyMap.set('cache', (commonBlockNodeContentProps) => (
  <CacheBlockEditor
    node={commonBlockNodeContentProps.node}
    setNode={commonBlockNodeContentProps.setNode}
    setDrawerVisible={commonBlockNodeContentProps.setDrawerVisible}
  />
));

export function BlockNodeEditDrawer({
  drawerVisible,
  setDrawerVisible,
  node,
  setNode,
}: CommonBlockNodeContentProps & { drawerVisible: boolean }) {
  if (node === undefined || keyMap.get(node?.type ?? '') === undefined) {
    return <></>;
  }

  return (
    <Drawer
      title={'블록 편집'}
      placement={'right'}
      open={drawerVisible}
      getContainer={false}
      onClose={() => setDrawerVisible(false)}
    >
      {drawerVisible &&
        keyMap.get(node.type!)!({
          node,
          setNode,
          setDrawerVisible,
        })}
    </Drawer>
  );
}
