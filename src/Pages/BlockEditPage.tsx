import {
  CloudOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { FloatButton } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Node, OnNodesChange, ReactFlow, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import { ulid } from 'ulid';

import { sketchApi } from '../api';
import { MainLayout } from '../components/MainLayout.tsx';
import { BlockNodeEditDrawer } from '../components/blocks/BlockNodeEditDrawer.tsx';
import { DatabaseBlockNodeProps } from '../components/blocks/DatabaseBlockNode.tsx';
import { VirtualMachineBlockNodeProps } from '../components/blocks/VirtualMachineBlockNode.tsx';
import { WebServerBlockNodeProps } from '../components/blocks/WebServerBlockNode.tsx';
import { useChannelNavigationContext } from '../components/providers/ChannelNavigationProvider.tsx';
import {
  SketchProvider,
  useSketchBlockContext,
} from '../components/providers/SketchProvider.tsx';
import {
  convertBlockToNode,
  convertNodeToBlock,
  supportedBlockNodeTypes,
} from '../utils/BlockUtils.tsx';

export function BlockEditPage() {
  // Get Sketch Parameter ID
  const { sketchId } = useParams();

  return (
    <MainLayout>
      <SketchProvider sketchId={sketchId!}>
        <BlockEditPageComponent />
      </SketchProvider>
    </MainLayout>
  );
}

function BlockEditPageComponent() {
  // Sketch Provider
  const { sketchBlock, setSketchBlock } = useSketchBlockContext();
  const { currentChannel } = useChannelNavigationContext();

  // Define Nodes, Node Types
  const [nodes, setNodes] = useState<Node[]>(
    sketchBlock.blockList.map<Node>((a) => convertBlockToNode(a)),
  );

  // Drawer 관련 State
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [nodeToEdit, setNodeToEdit] = useState<Node | undefined>(undefined);

  // Node Change Callback
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes],
  );

  // Update sketchBlock when nodes are changed (saving to server)
  useEffect(() => {
    setSketchBlock({
      sketchId: sketchBlock.sketchId,
      blockList: nodes.map((node) => convertNodeToBlock(node)),
    });
  }, [nodes]);

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
        nodeTypes={supportedBlockNodeTypes}
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
          icon={<DesktopOutlined />}
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
        <FloatButton
          icon={<CloudServerOutlined />}
          tooltip={'웹 서버 블록 생성'}
          onClick={() => {
            const newNode: Node<WebServerBlockNodeProps> = {
              id: ulid(),
              position: { x: 0, y: 0 },
              data: {
                blockTitle: '웹 서버 블록',
                blockDescription: '웹 서버 블록입니다.',
                blockTags: [],
                webServerTier: 'low',
                webServerRegion: 'korea',
                containerData: {
                  registryUrl: '',
                  username: '',
                  secrets: '',
                  imageTags: '',
                },
              },
              type: 'webServer',
            };
            setNodes((nds) => nds.concat(newNode));
          }}
        />
        <FloatButton
          icon={<DatabaseOutlined />}
          tooltip={'DB 블록 생성'}
          onClick={() => {
            const newNode: Node<DatabaseBlockNodeProps> = {
              id: ulid(),
              position: { x: 0, y: 0 },
              data: {
                blockTitle: '웹 서버 블록',
                blockDescription: '웹 서버 블록입니다.',
                blockTags: [],
                dbTier: 'low',
                dbRegion: 'korea',
              },
              type: 'database',
            };
            setNodes((nds) => nds.concat(newNode));
          }}
        />
        <FloatButton
          icon={<CloudOutlined />}
          tooltip={'클라우드에 배포'}
          onClick={() => {
            (async () => {
              await sketchApi.deploySketchAsync(
                sketchBlock.sketchId,
                currentChannel.channelId,
              );
            })();
          }}
        />
      </FloatButton.Group>
    </div>
  );
}
