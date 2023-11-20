import { PlusOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Node, OnNodesChange, ReactFlow, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import { ulid } from 'ulid';

import { MainLayout } from '../components/MainLayout.tsx';
import { BlockNodeEditDrawer } from '../components/blocks/BlockNodeEditDrawer.tsx';
import {
  VirtualMachineBlockNode,
  VirtualMachineBlockNodeProps,
} from '../components/blocks/VirtualMachineBlockNode.tsx';
import { useErrorHandler } from '../components/providers/ErrorProvider.tsx';

export function BlockEditPage() {
  return (
    <MainLayout>
      <BlockEditPageComponent />
    </MainLayout>
  );
}

function BlockEditPageComponent() {
  // Get Sketch Parameter ID
  const { sketchId } = useParams();

  // Error Handler
  const errorHandler = useErrorHandler();

  // Define Nodes, Node Types
  const nodeTypes = useMemo(
    () => ({ virtualMachine: VirtualMachineBlockNode }),
    [],
  );
  const [nodes, setNodes] = useState<Node[]>([]);

  // Drawer 관련 State
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [nodeToEdit, setNodeToEdit] = useState<Node | undefined>(undefined);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes],
  );

  useEffect(() => {
    if (sketchId === undefined || sketchId === null || sketchId.length === 0) {
      errorHandler.showError(new Error('스케치 ID가 없습니다.'));
    }
  }, [errorHandler, sketchId]);

  useEffect(() => {
    if (!nodeToEdit) return;

    console.log('Editing Node: ', nodeToEdit);
    setNodes((nds) =>
      nds.map((eachNode) => {
        if (eachNode.id === nodeToEdit.id) {
          eachNode.data = {
            ...eachNode.data,
            ...nodeToEdit.data,
          };
        }

        return eachNode;
      }),
    );
  }, [nodeToEdit]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <BlockNodeEditDrawer
        drawerVisible={drawerVisible}
        setDrawerVisible={setDrawerVisible}
        node={nodeToEdit}
        setNode={setNodeToEdit}
      />
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        onNodeClick={(event, node) => {
          setNodeToEdit(node);
          setDrawerVisible(true);
        }}
      />
      <FloatButton.Group
        trigger={'click'}
        type={'primary'}
        icon={<PlusOutlined />}
      >
        <FloatButton
          icon={<PlusOutlined />}
          tooltip={'EC2 블록 생성'}
          onClick={() => {
            const newNode: Node<VirtualMachineBlockNodeProps> = {
              id: ulid(),
              position: { x: 0, y: 0 },
              data: {
                blockTitle: '가상 머신 블록',
                blockDescription: '가상 머신 블록입니다.',
                vmTier: 'low',
                vmRegion: 'korea',
                vmOperatingSystem: 'ubuntu',
                blockTags: [],
              },
              type: 'virtualMachine',
            };
            setNodes((nds) => nds.concat(newNode));
          }}
        />
      </FloatButton.Group>
    </div>
  );
}
