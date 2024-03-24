import {
  CloudOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { FloatButton, Table, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  OnNodesChange,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ulid } from 'ulid';

import { DeploymentListView } from '../components/DeploymentListView.tsx';
import { MainLayout } from '../components/MainLayout.tsx';
import { SelectInstalledPluginModal } from '../components/SelectInstalledPluginModal.tsx';
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
  convertBlockToEdges,
  convertBlockToNode,
  convertNodeToBlock,
  getConnectionEnvironment,
  supportedBlockNodeTypes,
  supportedEdgeTypes,
} from '../utils/BlockUtils.tsx';

export function BlockEditPage() {
  // Get Sketch Parameter ID
  const { sketchId } = useParams();

  return (
    <MainLayout pageKey={'sketch-list'}>
      <SketchProvider sketchId={sketchId!}>
        <BlockEditPageComponent />
      </SketchProvider>
    </MainLayout>
  );
}

function BlockEditPageComponent() {
  // Deployment Modal
  const [deploymentModalVisible, setDeploymentModalVisible] = useState(false);

  // Sketch Provider
  const { sketchBlock, setSketchBlock } = useSketchBlockContext();
  const { currentChannel } = useChannelNavigationContext();

  // Define Nodes, Node Types
  const [nodes, setNodes] = useState<Node[]>(
    sketchBlock.blockList.map<Node>((a) => convertBlockToNode(a)),
  );
  const [edges, setEdges] = useState<Edge[]>(
    convertBlockToEdges(sketchBlock.blockList),
  );

  // Drawer 관련 State
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [nodeToEdit, setNodeToEdit] = useState<Node | undefined>(undefined);

  // Deployment select modal
  const [pluginSelectModalVisible, setPluginSelectModalVisible] =
    useState(false);

  // Node Change Callback
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes],
  );

  // Edge Change Callback
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      console.log('onEdgesChange', changes);
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges],
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = { ...connection, type: 'custom-edge' };

      // Get Source Node
      const sourceNode = nodes.find(
        (node) => node.id === connection.source,
      )! as Node<WebServerBlockNodeProps>;

      sourceNode.data.connectionMetadata = getConnectionEnvironment(
        nodes,
        connection.target!,
        sourceNode.data.connectionMetadata,
      );
      setEdges((eds) => addEdge(newEdge, eds));
      setNodes((nds) =>
        nds.map((node) => (node.id === sourceNode.id ? sourceNode : node)),
      );
    },
    [setEdges, setNodes, nodes],
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
    <>
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
          edgeTypes={supportedEdgeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={(event, node) => {
            setNodeToEdit(node);
            setDrawerVisible(true);
          }}
          onConnect={onConnect}
          onEdgesChange={onEdgesChange}
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
                  connectionMetadata: {
                    dbRef: '',
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
                  masterUsername: '',
                  masterPassword: '',
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
              setPluginSelectModalVisible(true);
            }}
          />
          <FloatButton
            tooltip={'배포 이력 및 현황 확인하기'}
            onClick={() => setDeploymentModalVisible(true)}
          />
        </FloatButton.Group>
      </div>
      <DeploymentListView
        modalVisible={deploymentModalVisible}
        setModalVisible={setDeploymentModalVisible}
      />
      <SelectInstalledPluginModal
        isOpen={pluginSelectModalVisible}
        setIsOpen={setPluginSelectModalVisible}
        channelId={currentChannel.channelId}
        sketchId={sketchBlock.sketchId}
      />
    </>
  );
}

function PriceEstimateView({ nodeList }: { nodeList: Node[] }) {
  const columns = [
    {
      title: '블록 타입',
      dataIndex: 'blockType',
      key: 'blockType',
    },
    {
      title: '티어',
      dataIndex: 'tier',
      key: 'tier',
    },
    {
      title: '가격(월별, USD 기준)',
      dataIndex: 'price',
      key: 'price',
    },
  ];
  const vmTierPricingCalculator = (tier: string) => {
    switch (tier) {
      case 'low':
        return 30;
      case 'medium':
        return 60;
      case 'high':
        return 121;
      case 'custom':
        return 40;
    }
  };

  const webServerTierPricingCalculator = (tier: string) => {
    switch (tier) {
      case 'low':
        return 40;
      case 'medium':
        return 80;
      case 'high':
        return 160;
      case 'custom':
        return 50;
    }
  };

  const dbTierPricingCalculator = (tier: string) => {
    switch (tier) {
      case 'low':
        return 50;
      case 'medium':
        return 100;
      case 'high':
        return 200;
      case 'custom':
        return 60;
    }
  };
  const data = nodeList.map((node) => {
    if (node.type === 'virtualMachine') {
      return {
        blockType: '가상 머신',
        tier: node.data.vmTier,
        price: vmTierPricingCalculator(node.data.vmTier),
      };
    } else if (node.type === 'webServer') {
      return {
        blockType: '웹 서버',
        tier: node.data.webServerTier,
        price: webServerTierPricingCalculator(node.data.webServerTier),
      };
    } else {
      return {
        blockType: '데이터베이스',
        tier: node.data.dbTier,
        price: dbTierPricingCalculator(node.data.dbTier),
      };
    }
  });
  const total = data.reduce((acc, cur) => acc + cur.price!, 0);
  return (
    <div>
      <Table columns={columns} dataSource={data} pagination={false} />
      <Typography.Text type="secondary" style={{ display: 'block' }}>
        총 가격은 월간 ${total} 입니다.
      </Typography.Text>
      <Typography.Text type="secondary">
        본 서비스는 과금 요소의 추정치만 제공하며, 실제 과금 확인은 각 클라우드
        제공자에게 확인해 주세요.
      </Typography.Text>
    </div>
  );
}
