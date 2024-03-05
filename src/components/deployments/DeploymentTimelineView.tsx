import { useEffect } from 'react';

import { DeploymentProjection } from '../../libs/core-api/api';

export function DeploymentTimelineView({
  setCurrent,
  deploymentProjection,
}: {
  setCurrent: (key: string) => void;
  deploymentProjection: DeploymentProjection;
}) {
  useEffect(() => {
    setCurrent('timeline');
  }, [setCurrent]);

  return <div>timeline</div>;
}
