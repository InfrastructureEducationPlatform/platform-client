import { useNavigate } from 'react-router-dom';

import { userApi } from '../api';
import { SketchList } from '../components/SketchList';
import { TopBarHeader } from '../components/TopBarHeader';

export function Home() {
  const navigate = useNavigate();
  (async () => {
    const userDetail = await userApi.getUsersDetailProjectionAsync();
    if (userDetail.data.channelPermissionList.length == 0) {
      // 채널 생성 온보딩이 필요한 경우
      navigate('/onBoarding');
    }
  })();

  return (
    <div>
      <div>
        <TopBarHeader />
      </div>

      <div>
        <h1>Home</h1>
        <SketchList />
      </div>
    </div>
  );
}
