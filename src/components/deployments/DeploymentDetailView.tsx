import { Divider, Menu, MenuProps, Typography } from 'antd';
import React, { useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useDeploymentInformationQuery } from '../../api/queries.tsx';
import { DeploymentGeneralView } from './DeploymentGeneralView.tsx';
import { DeploymentTimelineView } from './DeploymentTimelineView.tsx';

export function DeploymentDetailView() {
  const navigate = useNavigate();
  const [forceReloadKey, setForceReloadKey] = useState('');
  const { deploymentId } = useParams();
  const { data } = useDeploymentInformationQuery(
    deploymentId ?? '',
    forceReloadKey,
  );
  const [selectedKey, setSelectedKey] = useState('general');

  const menuItems: MenuProps['items'] = [
    {
      label: '배포 정보',
      key: 'general',
      onClick: () => navigate(`/deployments/${deploymentId}/general`),
    },
    {
      label: '배포 타임라인',
      key: 'timeline',
      onClick: () => navigate(`/deployments/${deploymentId}/timeline`),
    },
  ];

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div>
        <Typography.Title level={3} style={{ margin: 0 }}>
          배포 상세 정보
        </Typography.Title>
        <Typography.Text type={'secondary'}>
          배포에 대한 상세 정보를 확인할 수 있습니다.
        </Typography.Text>
        <Divider style={{ marginTop: '15px' }} />
      </div>
      <Menu
        selectedKeys={[selectedKey]}
        items={menuItems}
        mode={'horizontal'}
      />
      <Routes>
        <Route
          path={'/'}
          element={<Navigate to={`/deployments/${deploymentId}/general`} />}
        />
        ]
        <Route
          path={'/general'}
          element={
            <DeploymentGeneralView
              setCurrent={setSelectedKey}
              deploymentProjection={data}
            />
          }
        />
        <Route
          path={'/timeline'}
          element={
            <DeploymentTimelineView
              setCurrent={setSelectedKey}
              deploymentProjection={data}
              setForceReloadKey={setForceReloadKey}
            />
          }
        />
      </Routes>
    </>
  );
}
