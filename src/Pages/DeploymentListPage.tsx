import {
  Button,
  Divider,
  Flex,
  Modal,
  Table,
  TableProps,
  Typography,
} from 'antd';
import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { useDeleteDeployment } from '../api/mutation.tsx';
import { useDeploymentInformationListQuery } from '../api/queries.tsx';
import { MainLayout } from '../components/MainLayout.tsx';
import { DeploymentDetailView } from '../components/deployments/DeploymentDetailView.tsx';

export type DeploymentListElementProps = {
  deploymentId: string;
  channelName: string;
  sketchName: string;
  sketchId: string;
  deployDate: string;
  deployStatus: string;
  isLatestDeployment: boolean;
};

export function DeploymentListPage() {
  const { data } = useDeploymentInformationListQuery('');
  const [modal, contexHolder] = Modal.useModal();
  const navigate = useNavigate();
  const { mutateAsync: deleteDeployment } = useDeleteDeployment();
  const columns: TableProps<DeploymentListElementProps>['columns'] = [
    {
      title: '채널 이름',
      dataIndex: 'channelName',
      key: 'channelName',
    },
    {
      title: '스케치 이름',
      dataIndex: 'sketchName',
      key: 'sketchName',
      render: (_, record) => (
        <Button
          onClick={() => navigate(`/sketches/${record.sketchId}`)}
          type={'link'}
        >
          {record.sketchName}
        </Button>
      ),
    },
    {
      title: '배포 날짜',
      dataIndex: 'deployDate',
      key: 'deployDate',
    },
    {
      title: '현재 배포 상태',
      dataIndex: 'deployStatus',
      key: 'deployStatus',
    },
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <Flex>
          <Button
            onClick={() =>
              navigate(`/deployments/${record.deploymentId}/general`)
            }
            type={'link'}
          >
            배포 상세
          </Button>
          <Button
            type={'link'}
            danger
            disabled={!record.isLatestDeployment}
            onClick={() => {
              modal.confirm({
                title: '배포 삭제',
                content:
                  '정말 이 배포를 삭제하시겠습니까? 인프라 내에 보존된 데이터는 모두 유실됩니다.',
                centered: true,
                onOk: async () => {
                  await deleteDeployment(record.deploymentId);
                },
              });
            }}
          >
            배포 삭제
          </Button>
        </Flex>
      ),
    },
  ];
  return (
    <MainLayout pageKey="deployment-list">
      <Flex
        style={{
          // Border Left Only
          borderLeft: '1px solid #e6e6e6',
          background: 'white',
          height: '100%',
          flexDirection: 'column',
          padding: '20px',
          overflow: 'auto',
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div>
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    배포 리스트
                  </Typography.Title>
                  <Typography.Text type={'secondary'}>
                    배포된 리스트를 확인할 수 있습니다.
                  </Typography.Text>
                  <Divider style={{ marginTop: '15px' }} />
                </div>
                <Table<DeploymentListElementProps>
                  columns={columns}
                  dataSource={data}
                />
              </>
            }
          />
          <Route path="/:deploymentId/*" element={<DeploymentDetailView />} />
        </Routes>
      </Flex>
      {contexHolder}
    </MainLayout>
  );
}
