import { Button, Divider, Flex, Table, TableProps, Typography } from 'antd';
import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

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
};

export function DeploymentListPage() {
  const { data } = useDeploymentInformationListQuery('');
  const navigate = useNavigate();
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
        <Button
          onClick={() =>
            navigate(`/deployments/${record.deploymentId}/general`)
          }
          type={'link'}
        >
          배포 상세
        </Button>
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
    </MainLayout>
  );
}
